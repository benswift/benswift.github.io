<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import {
    PerceptronApparatus,
    type BoardConfig,
  } from "perceptron-apparatus"
  import PixelDrawingPad from "./PixelDrawingPad.svelte"
  import {
    ComputationAnimator,
    sampleDigits,
    mnistWeights,
    type StepInfo,
    type MultiplyAccumulateStep,
  } from "perceptron-apparatus/widgets"

  const ANIM_DURATION = 300

  let containerEl: HTMLDivElement
  let apparatus: PerceptronApparatus | null = null
  let animator: ComputationAnimator | null = null
  let abortController: AbortController | null = null

  let inputPixels = $state<number[]>(new Array(36).fill(0))
  let loadedPreset = $state<number | null>(null)
  let isRunning = $state(false)
  let stepDescription = $state("")
  let prediction = $state<number | null>(null)
  let progress = $state(0)
  let currentMac = $state<MultiplyAccumulateStep | null>(null)

  $effect(() => {
    inputPixels // track
    pushInputToApparatus()
  })

  const config: BoardConfig = {
    size: 1000,
    nInput: 36,
    nHidden: 6,
    nOutput: 10,
  }

  function onStep(info: StepInfo) {
    stepDescription = info.description
    progress = info.progress
    if (info.step?.type === "multiply-accumulate") {
      currentMac = info.step
    } else {
      currentMac = null
    }
  }

  async function run(mode: "step" | "fast") {
    if (!animator || isRunning) return
    abort()
    prediction = null
    currentMac = null
    stepDescription = "Setting weights..."
    progress = 0
    isRunning = true
    abortController = new AbortController()

    try {
      const result = await animator.compute(
        inputPixels,
        {
          mode,
          stepDuration: mode === "step" ? 400 : 0,
          signal: abortController.signal,
          onStep,
        },
      )
      prediction = result.prediction
      currentMac = null
    } catch {
      // aborted
    } finally {
      isRunning = false
    }
  }

  function abort() {
    abortController?.abort()
    abortController = null
    isRunning = false
  }

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

  async function resetSliders() {
    if (!apparatus) return
    const values: Record<string, number> = {}
    for (let j = 0; j < 6; j++) values[`C${j}`] = 0
    for (let k = 0; k < 10; k++) values[`E${k}`] = 0
    await apparatus.setSliders(values, { duration: ANIM_DURATION })
    await apparatus.setLogRingRotation(0, { duration: ANIM_DURATION })
  }

  function setWeightSliders() {
    if (!apparatus) return
    const values: Record<string, number> = {}
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 36; i++) {
        values[`B${j}-${i}`] = mnistWeights.B[i][j]
      }
    }
    for (let k = 0; k < 10; k++) {
      for (let j = 0; j < 6; j++) {
        values[`D${k}-${j}`] = mnistWeights.D[j][k]
      }
    }
    apparatus.setSliders(values)
  }

  function pushInputToApparatus() {
    if (!apparatus) return
    const values: Record<string, number> = {}
    for (let i = 0; i < inputPixels.length; i++) {
      values[`A${i}`] = inputPixels[i]
    }
    apparatus.setSliders(values, { duration: 0 })
  }

  function clearStaleRunState() {
    if (prediction === null && progress === 0) return
    prediction = null
    currentMac = null
    stepDescription = ""
    progress = 0
    apparatus?.clearSlideRuleMarkers()
    resetSliders().catch((err) => {
      console.error("resetSliders failed:", err)
    })
  }

  onMount(() => {
    apparatus = new PerceptronApparatus(containerEl, config)
    animator = new ComputationAnimator(apparatus, mnistWeights)
    setWeightSliders()
    pushInputToApparatus()
  })

  onDestroy(() => {
    abort()
  })
</script>

<div class="apparatus-inference">
  <div class="controls">
    <div class="digit-picker">
      <span class="label">Input digit:</span>
      <div class="digits">
        {#each sampleDigits as digit, i}
          <button
            class="digit-button"
            class:selected={loadedPreset === i}
            onclick={() => {
              abort()
              clearStaleRunState()
              inputPixels = [...sampleDigits[i].pixels]
              loadedPreset = i
            }}
            title="Digit {digit.label}"
          >
            <svg viewBox="0 0 6 6" class="digit-grid">
              {#each { length: 36 } as _, pi}
                <rect
                  x={pi % 6}
                  y={Math.floor(pi / 6)}
                  width="1"
                  height="1"
                  fill={digit.pixels[pi] > 0.15 ? `rgba(190, 46, 221, ${0.3 + digit.pixels[pi] * 0.7})` : "transparent"}
                />
              {/each}
            </svg>
            <span class="digit-label">{digit.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="drawing-pad-wrapper">
      <PixelDrawingPad
        pixels={inputPixels}
        rows={6}
        cols={6}
        onChange={(next) => {
          if (isRunning) abort()
          clearStaleRunState()
          inputPixels = next
          loadedPreset = null
        }}
      />
    </div>

    <div class="playback">
      <button onclick={() => run("step")} disabled={isRunning}>
        ▶ Step through
      </button>
      <button onclick={() => run("fast")} disabled={isRunning}>
        ⏩ Instant
      </button>
      <button onclick={reset} disabled={!isRunning && prediction === null}>
        ↺ Reset
      </button>
    </div>

    <div class="status">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress * 100}%"></div>
      </div>
      <span class="step-description">{stepDescription}&nbsp;</span>
      {#if currentMac}
        <div class="hud">
          <span class="hud-op">
            <span class="hud-label">{currentMac.inputSlider}</span>
            <span class="hud-value">{currentMac.inputValue.toFixed(3)}</span>
            ×
            <span class="hud-label">{currentMac.weightSlider}</span>
            <span class="hud-value">{currentMac.weightValue.toFixed(3)}</span>
            =
            <span class="hud-value">{currentMac.product.toFixed(3)}</span>
          </span>
          <span class="hud-acc">
            {currentMac.target} = {currentMac.accumulator.toFixed(3)}
          </span>
        </div>
      {/if}
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
    </div>
  </div>

  <div bind:this={containerEl} class="apparatus-container"></div>
</div>

<style>
  .apparatus-inference {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .digit-picker .label {
    font-size: 0.875rem;
    color: var(--text-2, #aaa);
  }

  .digits {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .digit-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem;
    background: var(--bg-soft, #252525);
    border: 2px solid var(--divider, #333);
    border-radius: 6px 0 6px 6px;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .digit-button:hover {
    border-color: var(--text-3, #666);
  }

  .digit-button.selected {
    border-color: var(--highlight-color, #be2edd);
  }

  .digit-grid {
    width: 36px;
    height: 36px;
  }

  .drawing-pad-wrapper {
    width: 150px;
    height: 150px;
    margin-top: 0.5rem;
  }

  .digit-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-color, #e0e0e0);
  }

  .playback {
    display: flex;
    gap: 0.5rem;
  }

  .playback button {
    padding: 0.5rem 1rem;
    background: var(--bg-soft, #252525);
    color: var(--text-color, #e0e0e0);
    border: 1px solid var(--divider, #333);
    border-radius: 6px 0 6px 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.15s;
  }

  .playback button:hover:not(:disabled) {
    background: var(--divider, #333);
  }

  .playback button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .status {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-height: 3.5rem;
  }

  .progress-bar {
    height: 4px;
    background: var(--bg-soft, #252525);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--highlight-color, #be2edd);
    transition: width 0.3s ease;
  }

  .step-description {
    font-family: var(--font-family-mono, monospace);
    font-size: 0.8rem;
    color: var(--text-2, #aaa);
  }

  .hud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    font-family: var(--font-family-mono, monospace);
    font-size: 0.8rem;
    color: var(--text-2, #aaa);
    padding: 0.375rem 0.5rem;
    background: var(--bg-soft, #252525);
    border-radius: 4px;
  }

  .hud-label {
    font-weight: 600;
    color: var(--text-color, #e0e0e0);
  }

  .hud-value {
    color: var(--highlight-color, #be2edd);
    font-variant-numeric: tabular-nums;
  }

  .hud-acc {
    color: var(--text-3, #666);
  }

  .prediction {
    font-size: 1.1rem;
  }

  .prediction strong {
    font-size: 1.5rem;
    color: var(--highlight-color, #be2edd);
  }

  .correct {
    color: #b8bb26;
  }

  .incorrect {
    color: #fb4934;
  }

  .apparatus-container {
    width: 100%;
    aspect-ratio: 1;
    max-width: 800px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 8px 0 8px 8px;
    background: var(--background-color, #1a1a1a);
    color: var(--text-color, #e0e0e0);
    --pa-highlight: var(--highlight-color, #be2edd);
  }

  .apparatus-container :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
