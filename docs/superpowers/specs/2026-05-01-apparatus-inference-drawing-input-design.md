# Drawing input for ApparatusInference widget

## Background

`src/components/svelte/ApparatusInference.svelte` renders the digital twin of
the perceptron apparatus (a 1.2m wooden table that classifies digits via
sliders and a slide rule), used in the
`blog/2026/03/19/perceptron-apparatus-inference-walkthrough.mdx` post.

Today the user can only pick from five preset MNIST digits (0, 1, 4, 6, 7) and
watch the forward pass animate. We want users to draw their own input on a 6×6
grid and watch the apparatus respond, while keeping the presets as a starting
point.

The upstream `perceptron-apparatus` package exposes only a write-side API
(`setSlider`, `setSliders`, `setLogRingRotation`, `setSlideRuleMarkers`,
`clearSlideRuleMarkers`). It has no input/event hooks on the SVG sliders, so
the drawing surface must live in the Svelte wrapper, not the upstream library.

## Goals

- Let the user draw on a 6×6 grid using the same incremental-fill model as
  `NeonPerceptron.svelte` (drag to build up cell intensity in small steps).
- Mirror the drawn pixels onto the apparatus's A-ring (input) sliders in real
  time, so the act of drawing is visibly reflected on the wooden rim.
- Preserve the existing "Step through" / "Instant" forward-pass animation as
  the explicit compute action — the apparatus is meant to be watched, not
  auto-recomputed on every drag tick.
- Preserve the preset thumbnails as a discoverable "load and tweak" affordance.
- Add a fullscreen toggle for the whole widget, with a landscape-friendly
  layout when fullscreen.

## Non-goals

- Eraser tool. Reset is the only undo.
- Persisting drawings across reloads.
- Auto-running the forward pass on input change.
- Smoothing or blurring drawn input.
- Editing the apparatus rim sliders directly. (Would require changes to the
  upstream library.)

## Architecture

Two changed files, one new file.

### New: `src/components/svelte/PixelDrawingPad.svelte`

A controlled-input widget. The parent owns the pixel state; the pad reports
changes back via a callback.

**Props:**

- `pixels: number[]` — current values, length `rows * cols`, each in `[0, 1]`.
- `rows: number` — grid rows.
- `cols: number` — grid columns.
- `step?: number` — increment per draw event. Default `0.15` (matches
  `NeonPerceptron.svelte`).
- `onChange: (pixels: number[]) => void` — called with a new array whenever a
  cell value changes.

**Behaviour:**

- Renders an `<svg>` with `viewBox="0 0 cols rows"` so it scales fluidly to its
  container. One `<rect>` per cell.
- Cell visual: dark background fill at intensity 0; brand purple
  `rgba(190, 46, 221, α)` ramping with intensity, mirroring the existing
  thumbnail style at `ApparatusInference.svelte:169`. A subtle 1px stroke
  between cells so the grid is legible at any size.
- Mouse handlers: `mousedown` starts a drag, `mousemove` while drag-active
  hit-tests the cell under the pointer and increments it by `step` (capped at
  1.0). `mouseup` and `mouseleave` end the drag.
- Touch handlers: `touchstart`, `touchmove`, `touchend`. Single-finger only
  (skip multi-touch). `event.preventDefault()` on `touchmove` to suppress page
  scrolling while drawing.
- Anti-flood: track the most recently incremented cell within the current
  drag, and don't increment the same cell twice in a row without first leaving
  it. This stops a slow drag-pause from saturating one cell instantly. Same
  pattern as a paint app's "build up" behaviour.
- Hit-testing: convert pointer coordinates to SVG coordinates via
  `getScreenCTM().inverse()`, then `floor` to (col, row).

### Modified: `src/components/svelte/ApparatusInference.svelte`

**State changes:**

- Replace `selectedDigit = $state(0)` with:
  - `inputPixels = $state<number[]>(new Array(36).fill(0))` — canonical input
    state, source of truth for the apparatus and the pad.
  - `loadedPreset = $state<number | null>(null)` — UI hint showing which preset
    (if any) is currently in the pad. `null` once the user has edited.

**Reactive sync (apparatus follows input):**

- A `$effect` watching `inputPixels` pushes values to the apparatus's A-ring
  and clears stale state from the previous forward pass:
  - `apparatus.setSliders({ A0: ..., A35: ... })` (no animation duration —
    instant, since this fires on every drag tick).
  - `prediction = null`, `currentMac = null`, `stepDescription = ""`,
    `progress = 0`.
  - `apparatus.clearSlideRuleMarkers()`.
  - Reset C0–C5 and E0–E9 sliders to 0 (the existing `resetSliders` logic, but
    triggered on input change rather than just on the Reset button).
- The effect must not fire during initial mount before `apparatus` is ready;
  guard with `if (!apparatus) return`.

**UI flow:**

- Preset thumbnails (existing): clicking thumbnail `i` sets
  `inputPixels = [...sampleDigits[i].pixels]` and `loadedPreset = i`. The
  reactive effect above handles A-ring sync and stale-state clearing.
- Drawing pad (new): `<PixelDrawingPad pixels={inputPixels} rows={6} cols={6}
  onChange={(next) => { inputPixels = next; loadedPreset = null }} />`.
- "Step through" / "Instant" buttons: unchanged in behaviour, but now read
  `inputPixels` instead of `sampleDigits[selectedDigit].pixels`.
- "Reset" button: clears `inputPixels` to zeros and sets `loadedPreset = null`.
  **Behaviour change:** the existing Reset preserves the selected preset's
  input and only clears the computation state. The new Reset wipes the input
  too, since with the eraser deferred (per non-goals), Reset is the only way
  to clear the canvas and start over.
- Existing `setInputSliders` and `selectDigit` collapse into the reactive
  effect plus the thumbnail click handler.
- Prediction display (existing line 215 compares
  `prediction === sampleDigits[selectedDigit].label`): when `loadedPreset` is
  `null`, there's no ground truth to compare against. Show the prediction
  number alone, without the ✓ / ✗ marker.
- Thumbnail "selected" highlight (`class:selected={selectedDigit === i}` at
  line 158): rename to `class:selected={loadedPreset === i}`. A thumbnail is
  only highlighted as selected when its pixels match the pad exactly (i.e.
  user hasn't edited since loading it).

### Fullscreen

Lift the pattern from `NeonPerceptron.svelte:483-495`:

- `isFullscreen = $state(false)`.
- `toggleFullscreen()` calls `containerEl.requestFullscreen()` /
  `document.exitFullscreen()`.
- `onFullscreenChange` listener on `document` updates `isFullscreen`.
- Fullscreen button positioned top-right of the root container, same icon
  treatment as `NeonPerceptron.svelte:555-565`.

### Layout

**Non-fullscreen** (unchanged): controls stacked above the apparatus. The
controls block now contains the digit-picker row, the drawing pad below it,
the playback row, and the status block. The apparatus container sits below.

**Fullscreen**: root container becomes
`display: grid; grid-template-columns: 1fr 1fr; height: 100vh`. Apparatus
fills the left column (still constrained `aspect-ratio: 1`, centred). Controls
fill the right column, vertically stacked, with the drawing pad sized large
enough to be touch-friendly on a tablet (target ~50vh).

CSS uses the `:fullscreen` pseudo-class on the root, plus a `.fullscreen`
class fallback set from `isFullscreen` for browsers that miss the
pseudo-class on the actual element (matches the NeonPerceptron approach).

## Data flow

```
user draws on pad
  ↓ onChange
parent inputPixels updates
  ↓ $effect
apparatus.setSliders({ A0..A35 }) (instant)
apparatus C/E sliders reset to 0 (animated)
prediction / mac / description / progress reset
clearSlideRuleMarkers()

user clicks "Step through" or "Instant"
  ↓
animator.compute(inputPixels, ...)
  ↓
existing animation runs forward pass on apparatus
  ↓
prediction set on completion
```

## Testing

Light unit coverage on `PixelDrawingPad.svelte`:

- Pointer down + move over a cell increments it by `step`.
- Repeated pointer events on the same cell within a drag don't double-increment
  until the pointer leaves and re-enters.
- Cell value caps at 1.0.
- `onChange` is called with a new array (not mutated in place).

`ApparatusInference.svelte` itself is mostly orchestration of the upstream
library, which is hard to unit-test meaningfully without mocking
`PerceptronApparatus`. Integration verification is via running `pnpm dev` and
manually exercising the post in a browser, including fullscreen on both
desktop and a phone-shaped viewport.

## Open implementation considerations (deferred to plan)

- Whether `$effect` re-pushing all 36 A-ring sliders on every drag tick is
  fast enough, or whether to only push the cells that actually changed. The
  upstream `setSliders` is a batched call, so likely fine, but worth measuring.
- Whether to throttle the C/E reset animation if drag events come faster than
  `ANIM_DURATION` (300ms). May want to skip the duration on the C/E reset
  during active drawing to avoid lagging slider movement.
- Exact dimensions of the drawing pad in non-fullscreen mode. Probably ~150px
  square (about 4× the existing thumbnail size).
