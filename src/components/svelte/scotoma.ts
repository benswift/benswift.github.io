/**
 * Scotoma: render two text streams into one image, one blurred and composited
 * in front of the other. Humans read the blurred stream as intact letterforms;
 * VLMs apply a "sharp means closer" heuristic and read the crisp one.
 *
 * Port of the `vlm_perception.scotoma` renderer. The blur deliberately
 * replicates Pillow's `ImageFilter.GaussianBlur` rather than using
 * `ctx.filter = "blur(...)"`, for two reasons: Safari still hasn't shipped
 * canvas filters, and the crossover measured in the experiment is sharp
 * (24% -> 97% between blur 0.07 and 0.10), so a blur whose sigma depends on
 * the browser's rasteriser would put the output off-calibration.
 */

/** A cell pairs an optional glyph from each stream. */
export type Cell = [string | null, string | null];
export type Layout = Cell[][];

export type Rgb = [number, number, number];

/** Perceptually uniform hues (OKLCH L=0.7 C=0.15), matching the experiment. */
export const COLOURS = {
  red: [237, 118, 101],
  yellow: [195, 153, 0],
  green: [76, 184, 106],
  cyan: [0, 182, 209],
  blue: [122, 151, 251],
  magenta: [209, 121, 202],
} as const satisfies Record<string, Rgb>;

export type ColourName = keyof typeof COLOURS;

/**
 * Only red/cyan (in both role orderings) was measured in the Scotoma sweep;
 * the remaining complementary pairs come from the circle experiment's colour
 * sweep, so they are plausible but uncalibrated.
 */
export const COLOUR_PAIRS: {
  label: string;
  human: ColourName;
  machine: ColourName;
  measured: boolean;
}[] = [
  { label: "red / cyan (measured)", human: "red", machine: "cyan", measured: true },
  { label: "cyan / red (measured)", human: "cyan", machine: "red", measured: true },
  { label: "magenta / green", human: "magenta", machine: "green", measured: false },
  { label: "yellow / blue", human: "yellow", machine: "blue", measured: false },
];

export const DEFAULTS = {
  fontSize: 96,
  /** 0.10 sits just past the measured crossover and stays human-readable. */
  blurFraction: 0.1,
  offsetFraction: 0.38,
  trackingFraction: 0.12,
  lineHeightFraction: 1.3,
  backgroundGrey: 128,
};

export type ScotomaStyle = {
  fontSize: number;
  blurFraction: number;
  offsetFraction: number;
  trackingFraction: number;
  lineHeightFraction: number;
  backgroundGrey: number;
  humanColour: Rgb;
  machineColour: Rgb;
  /** True = the blurred (human) stream is composited in front: the exploit. */
  blurredOnTop: boolean;
};

// --- stream pairing ---------------------------------------------------------

export type PairResult =
  | { ok: true; layout: Layout; cells: number }
  | { ok: false; message: string };

/**
 * Pair two equal-length streams position by position.
 *
 * Neither stream drives layout: cell *i* holds `human[i]` over `machine[i]`,
 * with spaces rendered as gaps in their own stream only. Symmetric, so the two
 * streams can be swapped without changing what pairs with what.
 */
export function pairAligned(human: string, machine: string): PairResult {
  const a = human.toUpperCase();
  const b = machine.toUpperCase();

  if (!a.trim() || !b.trim()) return { ok: false, message: "Both streams need some text." };
  if (a.length !== b.length) {
    const diff = Math.abs(a.length - b.length);
    const longer = a.length > b.length ? "top" : "bottom";
    return {
      ok: false,
      message: `${diff} character${diff === 1 ? "" : "s"} too many in the ${longer} box (${a.length} vs ${b.length}).`,
    };
  }

  const rows: Layout = [[]];
  for (let i = 0; i < a.length; i++) {
    const ca = a[i];
    const cb = b[i];
    if (ca === "\n" || cb === "\n") {
      if (ca !== cb)
        return {
          ok: false,
          message: `Line breaks must line up (they differ at character ${i + 1}).`,
        };
      rows.push([]);
      continue;
    }
    rows.at(-1)!.push([ca === " " ? null : ca, cb === " " ? null : cb]);
  }

  const cells = rows.reduce((n, row) => n + row.length, 0);
  if (cells === 0) return { ok: false, message: "Both streams need some text." };
  return { ok: true, layout: rows, cells };
}

// --- blur -------------------------------------------------------------------

/**
 * Pillow approximates a Gaussian with three box-blur passes over an
 * "extended box" of fractional radius (Gwosdek et al. 2011). Given a target
 * sigma, this returns that fractional radius.
 */
export function boxRadiusForSigma(sigma: number, passes = 3): number {
  const sigma2 = (sigma * sigma) / passes;
  const L = Math.sqrt(12.0 * sigma2 + 1.0);
  const l = Math.floor((L - 1.0) / 2.0);
  const a = ((2 * l + 1) * (l * (l + 1) - 3 * sigma2)) / (6 * (sigma2 - (l + 1) * (l + 1)));
  return l + a;
}

/**
 * One extended-box pass along a row or column. Weights are 1 for offsets
 * within `l` and the fractional part `a` for the two pixels just outside,
 * normalised by 2r+1. Edges replicate, as Pillow's does.
 */
function boxPass(
  src: Float32Array,
  dst: Float32Array,
  len: number,
  stride: number,
  base: number,
  r: number,
) {
  const l = Math.floor(r);
  const a = r - l;
  const norm = 1 / (2 * r + 1);
  const at = (i: number) => src[base + Math.min(len - 1, Math.max(0, i)) * stride];

  // Running sum over the integer window [i-l, i+l].
  let sum = 0;
  for (let k = -l; k <= l; k++) sum += at(k);

  for (let i = 0; i < len; i++) {
    dst[base + i * stride] = (sum + a * (at(i - l - 1) + at(i + l + 1))) * norm;
    sum += at(i + l + 1) - at(i - l);
  }
}

/**
 * Gaussian blur matching `PIL.ImageFilter.GaussianBlur(radius=sigma)`.
 *
 * All four channels are blurred independently and unpremultiplied, which is
 * what Pillow does to an RGBA layer; it drags edge colour toward the
 * transparent black background exactly as the reference renderer does.
 */
export function gaussianBlurRgba(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  sigma: number,
  passes = 3,
) {
  if (sigma <= 0) return;
  const r = boxRadiusForSigma(sigma, passes);
  const n = w * h;
  let buf = new Float32Array(n);
  let tmp = new Float32Array(n);

  for (let c = 0; c < 4; c++) {
    for (let i = 0; i < n; i++) buf[i] = data[i * 4 + c];

    for (let p = 0; p < passes; p++) {
      for (let y = 0; y < h; y++) boxPass(buf, tmp, w, 1, y * w, r);
      [buf, tmp] = [tmp, buf];
    }
    for (let p = 0; p < passes; p++) {
      for (let x = 0; x < w; x++) boxPass(buf, tmp, h, w, x, r);
      [buf, tmp] = [tmp, buf];
    }

    for (let i = 0; i < n; i++) data[i * 4 + c] = Math.round(buf[i]);
  }
}

// --- rendering --------------------------------------------------------------

const rgbCss = ([r, g, b]: Rgb) => `rgb(${r} ${g} ${b})`;

function fontString(size: number): string {
  // The Astro Fonts API registers families under hashed names, so resolve the
  // real stack from the CSS variable rather than hardcoding "Jost".
  const stack =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue("--font-jost").trim()
      : "";
  return `900 ${size}px ${stack || "Futura, 'Century Gothic', sans-serif"}`;
}

/**
 * Load the webfont before first paint; canvas silently falls back otherwise.
 *
 * Only the primary family is requested. Astro appends a synthetic
 * metric-matching fallback face to the stack which never actually loads, and
 * `document.fonts.load()` rejects if any face in the stack fails — which would
 * otherwise leave the generator permanently unrendered. A missing font should
 * degrade to a system face, never block.
 */
export async function ensureFontLoaded(size = DEFAULTS.fontSize): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await document.fonts.load(fontString(size).split(",")[0]);
  } catch {
    // Fall through and draw with whatever the stack resolves to.
  }
}

export type RenderResult = { width: number; height: number };

/** Draw a paired layout onto `canvas`, resizing it to fit. */
export function drawScotoma(
  canvas: HTMLCanvasElement,
  layout: Layout,
  style: ScotomaStyle,
): RenderResult {
  const { fontSize } = style;
  const font = fontString(fontSize);

  const measure = canvas.getContext("2d");
  if (!measure) throw new Error("2D canvas context unavailable");
  measure.font = font;

  const glyphs = new Set<string>();
  for (const row of layout) for (const cell of row) for (const g of cell) if (g) glyphs.add(g);

  // Widest glyph in either stream. fontSize is the fallback for an empty glyph
  // set, not a floor — flooring it would widen every cell past the reference.
  const advances = [...glyphs].map((g) => measure.measureText(g).width);
  const maxAdvance = advances.length ? Math.max(...advances) : fontSize;
  const cellW = maxAdvance + style.trackingFraction * fontSize;
  const cellH = style.lineHeightFraction * fontSize;
  const pad = fontSize * 0.75;
  const cols = Math.max(...layout.map((row) => row.length));
  const width = Math.round(2 * pad + cellW * cols);
  const height = Math.round(2 * pad + cellH * layout.length);

  // Pillow's anchor="mm" centres a glyph on the midpoint of the font's
  // ascender/descender span, whereas canvas "middle" uses the em box — an ~11px
  // discrepancy at 96px. Drive the baseline directly so the framing matches the
  // reference stimuli, falling back to "middle" where the metrics are missing.
  const fm = measure.measureText("H");
  const anchorable =
    typeof fm.fontBoundingBoxAscent === "number" && typeof fm.fontBoundingBoxDescent === "number";
  const baselineShift = anchorable ? (fm.fontBoundingBoxAscent - fm.fontBoundingBoxDescent) / 2 : 0;

  const layer = (index: 0 | 1, dx: number, colour: Rgb) => {
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const ctx = off.getContext("2d")!;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = anchorable ? "alphabetic" : "middle";
    ctx.fillStyle = rgbCss(colour);
    layout.forEach((row, rowIndex) => {
      const cy = pad + cellH * (rowIndex + 0.5) + baselineShift;
      row.forEach((cell, colIndex) => {
        const glyph = cell[index];
        if (glyph) ctx.fillText(glyph, pad + cellW * (colIndex + 0.5) + dx, cy);
      });
    });
    return off;
  };

  const d = (style.offsetFraction * fontSize) / 2;
  const human = layer(0, +d, style.humanColour);
  const machine = layer(1, -d, style.machineColour);

  const sigma = style.blurFraction * fontSize;
  if (sigma > 0) {
    const ctx = human.getContext("2d")!;
    const img = ctx.getImageData(0, 0, width, height);
    gaussianBlurRgba(img.data, width, height, sigma);
    ctx.putImageData(img, 0, 0);
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const g = style.backgroundGrey;
  ctx.fillStyle = rgbCss([g, g, g]);
  ctx.fillRect(0, 0, width, height);
  const [back, front] = style.blurredOnTop ? [machine, human] : [human, machine];
  ctx.drawImage(back, 0, 0);
  ctx.drawImage(front, 0, 0);

  return { width, height };
}
