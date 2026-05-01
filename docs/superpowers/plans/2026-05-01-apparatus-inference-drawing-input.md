# Drawing input for ApparatusInference widget — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the preset-only digit picker in `ApparatusInference.svelte` with a 6×6 drawing pad that mirrors live to the apparatus's A-ring sliders, while keeping presets as a "load and tweak" affordance and adding a fullscreen landscape layout.

**Architecture:** A pure `pixel-pad-state.ts` module owns the cell-increment + anti-flood state machine and is the sole unit-tested surface. A new `PixelDrawingPad.svelte` Svelte 5 component renders an SVG grid and wires mouse/touch DOM events to that module, exposing a controlled-input API (`pixels`, `onChange`). `ApparatusInference.svelte` is rewritten around an `inputPixels` source-of-truth + a `$effect` that pushes A-ring updates instantly and only clears stale forward-pass state when there is some to clear.

**Tech stack:** Astro 6, Svelte 5 (runes), TypeScript, Vitest. Upstream library: `perceptron-apparatus` (`PerceptronApparatus.setSliders`, `clearSlideRuleMarkers`, `ComputationAnimator`).

**Spec reference:** `docs/superpowers/specs/2026-05-01-apparatus-inference-drawing-input-design.md`

**Plan-time decisions** (resolving spec's "open implementation considerations"):

- **Test surface:** Extract pad logic into a pure `pixel-pad-state.ts` module and unit-test that. The repo has no Svelte component test infra, and the spec's test bullets all map cleanly to pure-function tests.
- **A-ring updates:** Push all 36 A-ring values on every change via `setSliders` with `duration: 0`. The upstream `setSliders` is batched (single `Record<string, number>` call); diffing to push only changed cells is YAGNI until measurement shows it isn't.
- **C/E reset throttling:** Only reset C/E sliders + clear prediction/markers when there is stale state to clear (`prediction !== null || progress > 0`). On a clean board, drawing causes no reset work. After a forward pass, the next input change fires one 300ms reset and then the guard prevents repeats.

---

## File structure

**New files:**

- `src/components/svelte/pixel-pad-state.ts` — pure functions: `incrementCell`, `clearLastCell`, `emptyPixels`. No DOM, no Svelte.
- `src/components/svelte/pixel-pad-state.test.ts` — vitest unit tests for the pure module.
- `src/components/svelte/PixelDrawingPad.svelte` — Svelte 5 controlled-input component. Renders SVG, wires DOM events to `pixel-pad-state`.

**Modified files:**

- `src/components/svelte/ApparatusInference.svelte` — replace `selectedDigit` state with `inputPixels` + `loadedPreset`; add reactive A-ring sync; embed `PixelDrawingPad`; rework Reset; add fullscreen toggle + landscape grid layout.

**No deleted files.**

---

## Task 1: Pure pixel-pad state module + tests

**Files:**

- Create: `src/components/svelte/pixel-pad-state.ts`
- Create: `src/components/svelte/pixel-pad-state.test.ts`

The pure state machine that the `.svelte` file will call from its DOM event handlers. Anti-flood is implemented via an opaque `lastIndex: number | null` that the caller threads through drag events.

- [ ] **Step 1: Write failing tests**

Create `src/components/svelte/pixel-pad-state.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { emptyPixels, incrementCell, clearLastCell } from "./pixel-pad-state"

describe("emptyPixels", () => {
  it("returns a zero-filled array of the requested length", () => {
    expect(emptyPixels(36)).toEqual(new Array(36).fill(0))
  })
})

describe("incrementCell", () => {
  it("increments the targeted cell by step", () => {
    const result = incrementCell(emptyPixels(36), 5, 0.15, null)
    expect(result.pixels[5]).toBeCloseTo(0.15)
    expect(result.lastIndex).toBe(5)
  })

  it("does not mutate the input array", () => {
    const before = emptyPixels(36)
    const result = incrementCell(before, 5, 0.15, null)
    expect(before[5]).toBe(0)
    expect(result.pixels).not.toBe(before)
  })

  it("caps cell value at 1.0", () => {
    let pixels = emptyPixels(36)
    let lastIndex: number | null = null
    for (let i = 0; i < 20; i++) {
      const result = incrementCell(pixels, 5, 0.15, lastIndex)
      pixels = result.pixels
      lastIndex = i % 2 === 0 ? null : 5
    }
    expect(pixels[5]).toBe(1)
  })

  it("does not double-increment the same cell while it is the last cell", () => {
    const first = incrementCell(emptyPixels(36), 5, 0.15, null)
    const second = incrementCell(first.pixels, 5, 0.15, first.lastIndex)
    expect(second.pixels[5]).toBeCloseTo(0.15)
    expect(second.pixels).toBe(first.pixels) // unchanged → same reference returned
    expect(second.lastIndex).toBe(5)
  })

  it("re-increments a cell after the pointer leaves and returns", () => {
    const a = incrementCell(emptyPixels(36), 5, 0.15, null)
    const b = incrementCell(a.pixels, 6, 0.15, a.lastIndex)
    const c = incrementCell(b.pixels, 5, 0.15, b.lastIndex)
    expect(c.pixels[5]).toBeCloseTo(0.3)
  })

  it("uses the supplied step value", () => {
    const result = incrementCell(emptyPixels(36), 5, 0.25, null)
    expect(result.pixels[5]).toBeCloseTo(0.25)
  })
})

describe("clearLastCell", () => {
  it("returns null lastIndex without touching pixels", () => {
    const pixels = emptyPixels(36)
    pixels[5] = 0.5
    const result = clearLastCell(pixels)
    expect(result.lastIndex).toBeNull()
    expect(result.pixels).toBe(pixels)
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `pnpm test src/components/svelte/pixel-pad-state.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the module**

Create `src/components/svelte/pixel-pad-state.ts`:

```ts
export type PadState = {
  pixels: number[]
  lastIndex: number | null
}

export function emptyPixels(length: number): number[] {
  return new Array(length).fill(0)
}

export function incrementCell(
  pixels: number[],
  index: number,
  step: number,
  lastIndex: number | null,
): PadState {
  if (index === lastIndex) {
    return { pixels, lastIndex }
  }
  const next = pixels.slice()
  next[index] = Math.min(1, pixels[index] + step)
  return { pixels: next, lastIndex: index }
}

export function clearLastCell(pixels: number[]): PadState {
  return { pixels, lastIndex: null }
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `pnpm test src/components/svelte/pixel-pad-state.test.ts`
Expected: PASS, all 7 tests.

- [ ] **Step 5: Type-check, lint, format**

Run: `pnpm typecheck && pnpm lint && pnpm format:check`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/svelte/pixel-pad-state.ts src/components/svelte/pixel-pad-state.test.ts
git commit -m "feat(pixel-pad): add pure cell-increment state module"
```

---

## Task 2: PixelDrawingPad Svelte component

**Files:**

- Create: `src/components/svelte/PixelDrawingPad.svelte`

Controlled-input SVG widget. Parent owns `pixels`; the pad reports changes through `onChange`. Anti-flood is delegated to `pixel-pad-state.incrementCell`.

- [ ] **Step 1: Create the component**

Create `src/components/svelte/PixelDrawingPad.svelte`:

```svelte
<script lang="ts">
  import { incrementCell, clearLastCell } from "./pixel-pad-state"

  type Props = {
    pixels: number[]
    rows: number
    cols: number
    step?: number
    onChange: (pixels: number[]) => void
  }

  let { pixels, rows, cols, step = 0.15, onChange }: Props = $props()

  let svgEl: SVGSVGElement
  let isDrawing = $state(false)
  let lastIndex: number | null = null

  function cellFill(value: number): string {
    if (value <= 0) return "var(--bg-soft, #252525)"
    const alpha = 0.3 + value * 0.7
    return `rgba(190, 46, 221, ${alpha})`
  }

  function pointerToCell(clientX: number, clientY: number): number | null {
    if (!svgEl) return null
    const ctm = svgEl.getScreenCTM()
    if (!ctm) return null
    const pt = svgEl.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const local = pt.matrixTransform(ctm.inverse())
    const col = Math.floor(local.x)
    const row = Math.floor(local.y)
    if (col < 0 || col >= cols || row < 0 || row >= rows) return null
    return row * cols + col
  }

  function paintAt(clientX: number, clientY: number) {
    const index = pointerToCell(clientX, clientY)
    if (index === null) return
    const result = incrementCell(pixels, index, step, lastIndex)
    lastIndex = result.lastIndex
    if (result.pixels !== pixels) onChange(result.pixels)
  }

  function handleMouseDown(event: MouseEvent) {
    isDrawing = true
    lastIndex = null
    paintAt(event.clientX, event.clientY)
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDrawing) return
    paintAt(event.clientX, event.clientY)
  }

  function endDrag() {
    isDrawing = false
    lastIndex = clearLastCell(pixels).lastIndex
  }

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return
    event.preventDefault()
    isDrawing = true
    lastIndex = null
    const t = event.touches[0]
    paintAt(t.clientX, t.clientY)
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isDrawing || event.touches.length !== 1) return
    event.preventDefault()
    const t = event.touches[0]
    paintAt(t.clientX, t.clientY)
  }
</script>

<svg
  bind:this={svgEl}
  class="pixel-drawing-pad"
  viewBox="0 0 {cols} {rows}"
  preserveAspectRatio="xMidYMid meet"
  role="application"
  aria-label="Pixel drawing pad"
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={endDrag}
  onmouseleave={endDrag}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={endDrag}
  ontouchcancel={endDrag}
>
  {#each { length: rows * cols } as _, i}
    <rect
      x={i % cols}
      y={Math.floor(i / cols)}
      width="1"
      height="1"
      fill={cellFill(pixels[i] ?? 0)}
      stroke="var(--divider, #333)"
      stroke-width="0.02"
    />
  {/each}
</svg>

<style>
  .pixel-drawing-pad {
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
    cursor: crosshair;
    background: var(--bg-soft, #252525);
    border-radius: 6px 0 6px 6px;
    user-select: none;
  }
</style>
```

- [ ] **Step 2: Type-check the component**

Run: `pnpm typecheck`
Expected: clean (no svelte-check errors on the new file).

- [ ] **Step 3: Lint and format**

Run: `pnpm lint && pnpm format:check`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/svelte/PixelDrawingPad.svelte
git commit -m "feat(pixel-pad): add Svelte drawing pad component"
```

---

## Task 3: ApparatusInference state migration — input pixels source of truth

**Files:**

- Modify: `src/components/svelte/ApparatusInference.svelte`

This task replaces `selectedDigit` with `inputPixels` + `loadedPreset` and the reactive A-ring sync, but leaves the UI mostly intact (preset thumbnails still render; pad is added in this task). Reset behaviour and prediction display are updated. Fullscreen is deferred to Task 4.

- [ ] **Step 1: Replace state declarations and add the sync effect**

In `src/components/svelte/ApparatusInference.svelte`, replace the `<script>` block top-down. Locate:

```ts
  let selectedDigit = $state(0)
  let isRunning = $state(false)
```

Replace `selectedDigit` declaration with:

```ts
  let inputPixels = $state<number[]>(new Array(36).fill(0))
  let loadedPreset = $state<number | null>(null)
  let isRunning = $state(false)
```

(Keep `isRunning`, `stepDescription`, `prediction`, `progress`, `currentMac` exactly as they are.)

- [ ] **Step 2: Replace `setInputSliders` and `selectDigit` with a reactive effect**

Delete the existing `setInputSliders(index)` function (lines 101–109 in the original file) and `selectDigit(index)` function (lines 127–136).

In their place, add a reactive `$effect` that mirrors `inputPixels` to the apparatus and clears stale forward-pass state when present. Place it immediately after the `currentMac = $state(...)` declaration line so it runs in script-top context:

```ts
  $effect(() => {
    if (!apparatus) return
    const values: Record<string, number> = {}
    for (let i = 0; i < inputPixels.length; i++) {
      values[`A${i}`] = inputPixels[i]
    }
    apparatus.setSliders(values, { duration: 0 })

    if (prediction !== null || progress > 0) {
      prediction = null
      currentMac = null
      stepDescription = ""
      progress = 0
      apparatus.clearSlideRuleMarkers()
      void resetSliders()
    }
  })
```

Note: this effect intentionally reads `prediction` / `progress` so that it re-runs when they change too, but the guard prevents runaway resets — once `prediction` becomes `null` and `progress` becomes `0`, the inner block is a no-op.

- [ ] **Step 3: Update `run` to read `inputPixels`**

Find the body of `async function run(mode: "step" | "fast")` (lines 46–73 in the original). Locate:

```ts
      const result = await animator.compute(
        sampleDigits[selectedDigit].pixels,
```

Replace `sampleDigits[selectedDigit].pixels` with `inputPixels`:

```ts
      const result = await animator.compute(
        inputPixels,
```

- [ ] **Step 4: Rewrite `reset` to wipe input as well**

Replace the body of `async function reset()` (lines 81–90 in the original):

```ts
  async function reset() {
    abort()
    prediction = null
    currentMac = null
    stepDescription = ""
    progress = 0
    apparatus?.clearSlideRuleMarkers()
    await resetSliders()
    setInputSliders(selectedDigit)
  }
```

with:

```ts
  async function reset() {
    abort()
    inputPixels = new Array(36).fill(0)
    loadedPreset = null
    prediction = null
    currentMac = null
    stepDescription = ""
    progress = 0
    apparatus?.clearSlideRuleMarkers()
    await resetSliders()
  }
```

The `$effect` will pick up the `inputPixels = ...` write and zero the A-ring. Calling `resetSliders()` here is still required because the effect's reset-block is gated on `prediction !== null || progress > 0` — which is true when Reset is hit during/after a run, but we want a defensive zero of C/E either way.

- [ ] **Step 5: Update `onMount` — drop the initial `setInputSliders` call**

Locate:

```ts
  onMount(() => {
    apparatus = new PerceptronApparatus(containerEl, config)
    animator = new ComputationAnimator(apparatus, mnistWeights)
    setWeightSliders()
    setInputSliders(selectedDigit)
  })
```

Replace with:

```ts
  onMount(() => {
    apparatus = new PerceptronApparatus(containerEl, config)
    animator = new ComputationAnimator(apparatus, mnistWeights)
    setWeightSliders()
  })
```

The `$effect` will fire once `apparatus` becomes truthy on the next reactive tick and push the (zero) `inputPixels` to the A-ring.

- [ ] **Step 6: Add `PixelDrawingPad` import and update preset thumbnails + markup**

At the top of the `<script>`, add:

```ts
  import PixelDrawingPad from "./PixelDrawingPad.svelte"
```

In the markup, replace the preset-thumbnail click handler. Locate:

```svelte
          <button
            class="digit-button"
            class:selected={selectedDigit === i}
            onclick={() => selectDigit(i)}
            title="Digit {digit.label}"
          >
```

Replace with:

```svelte
          <button
            class="digit-button"
            class:selected={loadedPreset === i}
            onclick={() => {
              abort()
              inputPixels = [...sampleDigits[i].pixels]
              loadedPreset = i
            }}
            title="Digit {digit.label}"
          >
```

Below the closing `</div>` of `.digit-picker` (around line 177 in the original), and before `<div class="playback">`, insert the drawing pad:

```svelte
    <div class="drawing-pad-wrapper">
      <PixelDrawingPad
        pixels={inputPixels}
        rows={6}
        cols={6}
        onChange={(next) => {
          if (isRunning) abort()
          inputPixels = next
          loadedPreset = null
        }}
      />
    </div>
```

- [ ] **Step 7: Update prediction display — drop ✓/✗ when no preset is loaded**

Locate the prediction block (lines 212–223 in the original):

```svelte
      <div class="prediction">
        {#if prediction !== null}
          Prediction: <strong>{prediction}</strong>
          {#if prediction === sampleDigits[selectedDigit].label}
            <span class="correct">✓</span>
          {:else}
            <span class="incorrect">✗ (expected {sampleDigits[selectedDigit].label})</span>
          {/if}
        {:else}
          &nbsp;
        {/if}
      </div>
```

Replace with:

```svelte
      <div class="prediction">
        {#if prediction !== null}
          Prediction: <strong>{prediction}</strong>
          {#if loadedPreset !== null}
            {#if prediction === sampleDigits[loadedPreset].label}
              <span class="correct">✓</span>
            {:else}
              <span class="incorrect">✗ (expected {sampleDigits[loadedPreset].label})</span>
            {/if}
          {/if}
        {:else}
          &nbsp;
        {/if}
      </div>
```

- [ ] **Step 8: Add CSS for the drawing-pad wrapper**

Inside the `<style>` block, add (immediately after the `.digit-grid` rule around line 278):

```css
  .drawing-pad-wrapper {
    width: 150px;
    height: 150px;
    margin-top: 0.5rem;
  }
```

- [ ] **Step 9: Type-check, lint, format**

Run: `pnpm typecheck && pnpm lint && pnpm format:check`
Expected: clean. If `svelte-check` flags an unused import (`sampleDigits` is still used in markup; `selectedDigit` should be gone), fix.

- [ ] **Step 10: Manual verification in dev**

Run: `pnpm dev`
Open the browser, navigate to the perceptron-apparatus inference walkthrough post (`blog/2026/03/19/perceptron-apparatus-inference-walkthrough.mdx`).
Verify:
- Page loads with a blank A-ring (no preset preselected).
- Drawing on the pad lights up cells; the apparatus's A-ring sliders move in sync.
- Clicking a preset thumbnail loads its pixels into the pad and the A-ring; the thumbnail is highlighted as selected.
- Drawing after loading a preset clears the highlight (no thumbnail looks selected).
- Step through / Instant runs the forward pass on whatever is currently in the pad.
- After a run, prediction shows; if a preset is loaded, ✓/✗ shows; if user has drawn, only the prediction number shows.
- Drawing again after a run clears the prediction and the slide-rule markers; C/E sliders animate back to 0 once.
- Reset clears the pad to all zeros and clears the prediction.

Stop the dev server when done.

- [ ] **Step 11: Commit**

```bash
git add src/components/svelte/ApparatusInference.svelte
git commit -m "feat(apparatus-inference): replace preset picker with drawing pad"
```

---

## Task 4: Fullscreen toggle + landscape grid layout

**Files:**

- Modify: `src/components/svelte/ApparatusInference.svelte`

Mirrors the pattern from `NeonPerceptron.svelte:483-495` and `:555-565`.

- [ ] **Step 1: Add fullscreen state and handlers**

In the `<script>` block, after the existing state declarations (after `loadedPreset = $state(...)`), add:

```ts
  let isFullscreen = $state(false)

  function toggleFullscreen() {
    if (!containerEl) return
    if (!document.fullscreenElement) {
      containerEl.requestFullscreen().catch((err) => console.error("Fullscreen failed:", err))
    } else {
      document.exitFullscreen()
    }
  }

  function onFullscreenChange() {
    isFullscreen = !!document.fullscreenElement
  }
```

`containerEl` already exists (currently `let containerEl: HTMLDivElement` for the apparatus container). The fullscreen target needs to be the *root* of the widget, not the inner apparatus container — so we'll repurpose `containerEl` for the root and introduce a separate `apparatusEl` for the inner div.

- [ ] **Step 2: Split `containerEl` into root + apparatus refs**

Locate:

```ts
  let containerEl: HTMLDivElement
  let apparatus: PerceptronApparatus | null = null
```

Replace with:

```ts
  let containerEl: HTMLDivElement
  let apparatusEl: HTMLDivElement
  let apparatus: PerceptronApparatus | null = null
```

In `onMount`, change:

```ts
    apparatus = new PerceptronApparatus(containerEl, config)
```

to:

```ts
    apparatus = new PerceptronApparatus(apparatusEl, config)
```

In the markup, change:

```svelte
  <div bind:this={containerEl} class="apparatus-container"></div>
```

to:

```svelte
  <div bind:this={apparatusEl} class="apparatus-container"></div>
```

And change the root element. Locate:

```svelte
<div class="apparatus-inference">
```

Replace with:

```svelte
<div bind:this={containerEl} class="apparatus-inference" class:fullscreen={isFullscreen}>
```

Find the matching close at the bottom (`</div>` paired with `<div class="apparatus-inference">`) — no change needed.

- [ ] **Step 3: Wire up fullscreen listener in `onMount` / `onDestroy`**

Update `onMount` to add the listener:

```ts
  onMount(() => {
    apparatus = new PerceptronApparatus(apparatusEl, config)
    animator = new ComputationAnimator(apparatus, mnistWeights)
    setWeightSliders()
    document.addEventListener("fullscreenchange", onFullscreenChange)
  })
```

Update `onDestroy` to remove it:

```ts
  onDestroy(() => {
    abort()
    document.removeEventListener("fullscreenchange", onFullscreenChange)
  })
```

- [ ] **Step 4: Add the fullscreen toggle button to markup**

Inside the root `<div bind:this={containerEl} ...>` and *before* `<div class="controls">`, add:

```svelte
  <button
    class="fullscreen-button"
    onclick={toggleFullscreen}
    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
  >
    {#if !isFullscreen}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
    {:else}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
      </svg>
    {/if}
  </button>
```

- [ ] **Step 5: Add fullscreen CSS**

In the `<style>` block, change `.apparatus-inference` to be `position: relative` (so the absolute-positioned button anchors to it), and add fullscreen rules.

Locate:

```css
  .apparatus-inference {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
```

Replace with:

```css
  .apparatus-inference {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .apparatus-inference:fullscreen,
  .apparatus-inference.fullscreen {
    width: 100vw;
    height: 100vh;
    padding: 1rem;
    background: var(--background-color, #1a1a1a);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1.5rem;
  }

  .apparatus-inference:fullscreen .apparatus-container,
  .apparatus-inference.fullscreen .apparatus-container {
    grid-column: 1;
    height: 100%;
    max-width: none;
    aspect-ratio: 1;
    margin: 0 auto;
  }

  .apparatus-inference:fullscreen .controls,
  .apparatus-inference.fullscreen .controls {
    grid-column: 2;
    overflow-y: auto;
  }

  .apparatus-inference:fullscreen .drawing-pad-wrapper,
  .apparatus-inference.fullscreen .drawing-pad-wrapper {
    width: min(50vh, 100%);
    height: min(50vh, 100%);
    aspect-ratio: 1;
  }

  .fullscreen-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.4rem;
    background: var(--bg-soft, #252525);
    color: var(--text-color, #e0e0e0);
    border: 1px solid var(--divider, #333);
    border-radius: 6px 0 6px 6px;
    cursor: pointer;
    z-index: 10;
    transition: background 0.15s;
  }

  .fullscreen-button:hover {
    background: var(--divider, #333);
  }

  .fullscreen-button svg {
    width: 100%;
    height: 100%;
  }
```

- [ ] **Step 6: Type-check, lint, format**

Run: `pnpm typecheck && pnpm lint && pnpm format:check`
Expected: clean.

- [ ] **Step 7: Manual verification in dev (desktop + phone-shaped viewport)**

Run: `pnpm dev`
- Click the fullscreen button (top-right of the widget). Widget should fill the viewport, with apparatus on the left, controls (including a larger drawing pad) on the right.
- Draw on the larger pad — A-ring still mirrors live.
- Click the (now exit-fullscreen) button. Widget should return to inline layout; pad reverts to 150px.
- Resize the browser to a phone-shaped viewport (~390×844 portrait), enter fullscreen. The 1fr 1fr grid will look cramped — acceptable for v1; document any follow-up wanted in commit message.
- Verify on a touch-capable device or DevTools touch emulation that single-finger drawing still works in fullscreen.

Stop the dev server when done.

- [ ] **Step 8: Commit**

```bash
git add src/components/svelte/ApparatusInference.svelte
git commit -m "feat(apparatus-inference): add fullscreen toggle with landscape layout"
```

---

## Task 5: Final verification

**Files:** none changed.

- [ ] **Step 1: Full test suite**

Run: `pnpm test`
Expected: all tests pass, including the new `pixel-pad-state.test.ts`.

- [ ] **Step 2: Type-check**

Run: `pnpm typecheck`
Expected: clean.

- [ ] **Step 3: Lint and format check**

Run: `pnpm lint && pnpm format:check`
Expected: clean.

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: build succeeds, no console errors related to the modified post.

- [ ] **Step 5: End-to-end manual exercise**

Run: `pnpm dev`
Open `/blog/2026/03/19/perceptron-apparatus-inference-walkthrough/`.

Run through the full UX flow once:
1. Draw a rough digit on the pad. Confirm A-ring mirrors live.
2. Click "Step through". Watch the forward pass animate. Prediction shows (no ✓/✗).
3. Click "Reset". Pad and apparatus zero out.
4. Click preset "4". Pad and A-ring populate; thumbnail is highlighted.
5. Click "Instant". Prediction shows with ✓ (assuming the trained model classifies preset 4 correctly — it should, per the existing post's claims).
6. Edit the preset by drawing. Thumbnail highlight clears. Prediction clears. Slide-rule markers clear. C/E sliders reset.
7. Click fullscreen. Confirm landscape layout. Repeat steps 1–2 in fullscreen.
8. Exit fullscreen.

If any of the above is broken, fix in a follow-up commit on this branch.

---

## Notes for the executing engineer

- **Why no Svelte component test:** The repo currently has no `jsdom`/`happy-dom`/`@testing-library/svelte`. Adding component-test infra for one widget is out of scope; the pure-module + manual-verification split is the right cost/benefit.
- **Why push all 36 sliders, not a diff:** Upstream `setSliders` is a single batched call accepting `Record<string, number>`. Diffing in JS to maybe save 35 entries in a hashmap lookup is premature optimisation. Revisit if profiling on a real device shows the per-tick overhead matters.
- **Why gate the C/E reset on `prediction !== null || progress > 0`:** Without the gate, the 300ms `resetSliders` animation re-fires on every drag tick and stacks. With the gate, it fires exactly once after a forward pass and then becomes a no-op until the next run.
- **Existing upstream `MnistInputWidget`** (`perceptron-apparatus/widgets`) does drawable 6×6 grid input, but is a vanilla DOM widget with imperative `getValues`/`setValues`. Embedding it inside a Svelte 5 component would mean lifecycle juggling and a one-way data flow shim — clearer to write a Svelte-native pad and own the styling.
- **Upstream library is read-only on apparatus rim sliders.** The drawing surface lives in the wrapper, not the apparatus SVG. Allowing the user to drag the rim sliders directly would require upstream changes (per the spec's non-goals).
