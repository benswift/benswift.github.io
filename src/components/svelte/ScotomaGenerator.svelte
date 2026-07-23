<script lang="ts">
  import { onMount } from "svelte";

  import {
    COLOURS,
    COLOUR_PAIRS,
    DEFAULTS,
    drawScotoma,
    ensureFontLoaded,
    pairAligned,
  } from "./scotoma";

  let humanText = $state("TRUST THE HUMAN");
  let machineText = $state("STUFF THE ROBOT");
  let blurFraction = $state(DEFAULTS.blurFraction);
  let offsetFraction = $state(DEFAULTS.offsetFraction);
  let pairIndex = $state(0);
  let blurredOnTop = $state(true);

  // $state, not a plain let: the canvas lives inside an {#if}, so it remounts
  // and the redraw effect has to re-run when the new element is bound.
  let canvas: HTMLCanvasElement | undefined = $state();
  let fontReady = $state(false);
  let status = $state("");

  const pairing = $derived(pairAligned(humanText, machineText));
  const colours = $derived(COLOUR_PAIRS[pairIndex]);

  onMount(async () => {
    await ensureFontLoaded();
    fontReady = true;
  });

  $effect(() => {
    if (!fontReady || !canvas || !pairing.ok) return;
    drawScotoma(canvas, pairing.layout, {
      ...DEFAULTS,
      blurFraction,
      offsetFraction,
      blurredOnTop,
      humanColour: [...COLOURS[colours.human]],
      machineColour: [...COLOURS[colours.machine]],
    });
  });

  function swap() {
    [humanText, machineText] = [machineText, humanText];
    status = "";
  }

  const toBlob = () =>
    new Promise<Blob>((resolve, reject) => {
      if (!canvas) return reject(new Error("Nothing rendered yet"));
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
        "image/png",
      );
    });

  async function download() {
    const url = URL.createObjectURL(await toBlob());
    const link = document.createElement("a");
    link.href = url;
    link.download = `scotoma-${humanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}.png`;
    link.click();
    URL.revokeObjectURL(url);
    status = "Downloaded.";
  }

  async function copy() {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": toBlob() })]);
      status = "Copied to clipboard.";
    } catch {
      status = "Clipboard blocked by the browser — use Download instead.";
    }
  }
</script>

<figure class="scotoma">
  <div class="streams">
    <label class="stream">
      <span class="stream-label">Blurred stream <em>— what you read</em></span>
      <textarea bind:value={humanText} rows="2" spellcheck="false" autocapitalize="characters"
      ></textarea>
    </label>

    <button class="swap" type="button" onclick={swap} title="Swap the two streams">
      <span aria-hidden="true">⇅</span>
      <span class="sr-only">Swap the two streams</span>
    </button>

    <label class="stream">
      <span class="stream-label">Crisp stream <em>— what the model reads</em></span>
      <textarea bind:value={machineText} rows="2" spellcheck="false" autocapitalize="characters"
      ></textarea>
    </label>
  </div>

  <p class="validation" class:invalid={!pairing.ok} role="status">
    {#if pairing.ok}
      {pairing.cells} cells — the streams line up.
    {:else}
      {pairing.message}
    {/if}
  </p>

  <div class="controls">
    <label>
      <span>Blur <code>{blurFraction.toFixed(2)}</code></span>
      <input
        type="range"
        min="0"
        max="0.2"
        step="0.01"
        bind:value={blurFraction}
        list="blur-ticks"
      />
      <datalist id="blur-ticks"><option value="0.1" label="measured crossover"></option></datalist>
      <small>Models flip to the crisp stream at about 0.10.</small>
    </label>

    <label>
      <span>Offset <code>{offsetFraction.toFixed(2)}</code></span>
      <input type="range" min="0" max="0.6" step="0.01" bind:value={offsetFraction} />
      <small>Held at 0.38 throughout the experiment — not calibrated.</small>
    </label>

    <label>
      <span>Colours</span>
      <select bind:value={pairIndex}>
        {#each COLOUR_PAIRS as pair, i (pair.label)}
          <option value={i}>{pair.label}</option>
        {/each}
      </select>
      <small>Only red/cyan was measured for Scotoma.</small>
    </label>

    <label class="toggle">
      <input type="checkbox" bind:checked={blurredOnTop} />
      <span>Blurred stream in front</span>
      <small
        >Unticked is the congruent control: the crisp stream really is in front, and everyone reads
        it.</small
      >
    </label>
  </div>

  <div class="preview">
    {#if pairing.ok}
      <canvas bind:this={canvas}></canvas>
    {:else}
      <p class="placeholder">Make the two streams the same length to render.</p>
    {/if}
  </div>

  <div class="actions">
    <button type="button" onclick={download} disabled={!pairing.ok}>Download PNG</button>
    <button type="button" onclick={copy} disabled={!pairing.ok}>Copy image</button>
    <span class="status" role="status">{status}</span>
  </div>
</figure>

<style>
  .scotoma {
    margin: 2rem 0;
    padding: 1.25rem;
    border: 1px solid var(--divider, #363338);
    border-radius: 8px 0 8px 8px;
    background: var(--bg-soft, #272529);
  }
  .streams {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.75rem;
    align-items: end;
  }
  .stream {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }
  .stream-label {
    font-size: 0.85rem;
    color: var(--text-2, #aaa);
  }
  .stream-label em {
    color: var(--text-3, #888);
    font-style: normal;
  }
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--divider, #363338);
    border-radius: 4px;
    background: var(--background-color, #1c1a1d);
    color: var(--text-color, #e0e0e0);
    font-family: var(--font-family-mono);
    font-size: 1rem;
    text-transform: uppercase;
    resize: vertical;
  }
  textarea:focus-visible,
  select:focus-visible,
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--highlight-color, #be2edd);
    outline-offset: 2px;
  }
  .swap {
    margin-bottom: 0.4rem;
    padding: 0.5rem 0.7rem;
    border: 1px solid var(--divider, #363338);
    border-radius: 999px;
    background: var(--background-color, #1c1a1d);
    color: var(--text-color, #e0e0e0);
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
  }
  .swap:hover {
    border-color: var(--highlight-color, #be2edd);
    color: var(--brand-1);
  }
  .validation {
    margin: 0.6rem 0 0;
    font-size: 0.85rem;
    color: var(--text-3, #888);
  }
  .validation.invalid {
    color: var(--brand-1);
  }
  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    gap: 1rem;
    margin-top: 1.25rem;
  }
  .controls label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.85rem;
    color: var(--text-2, #aaa);
  }
  .controls small {
    color: var(--text-3, #888);
    font-size: 0.75rem;
    line-height: 1.35;
  }
  .controls code {
    color: var(--text-color, #e0e0e0);
  }
  .toggle {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.4rem;
  }
  .toggle small {
    grid-column: 1 / -1;
  }
  select {
    padding: 0.35rem;
    border: 1px solid var(--divider, #363338);
    border-radius: 4px;
    background: var(--background-color, #1c1a1d);
    color: var(--text-color, #e0e0e0);
    font: inherit;
  }
  input[type="range"] {
    accent-color: var(--highlight-color, #be2edd);
  }
  .preview {
    margin-top: 1.25rem;
  }
  canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 4px;
  }
  .placeholder {
    margin: 0;
    padding: 2rem;
    border: 1px dashed var(--divider, #363338);
    border-radius: 4px;
    color: var(--text-3, #888);
    text-align: center;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
    margin-top: 1rem;
  }
  .actions button {
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--divider, #363338);
    border-radius: 4px;
    background: var(--background-color, #1c1a1d);
    color: var(--text-color, #e0e0e0);
    font: inherit;
    cursor: pointer;
  }
  .actions button:hover:not(:disabled) {
    border-color: var(--highlight-color, #be2edd);
    color: var(--brand-1);
  }
  .actions button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .status {
    font-size: 0.85rem;
    color: var(--text-3, #888);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  @media (width <= 40rem) {
    .streams {
      grid-template-columns: 1fr;
    }
    .swap {
      justify-self: center;
      margin: 0;
    }
  }
</style>
