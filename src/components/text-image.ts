// A picture set as a grid of monospace text (TextImage.astro). Each cell's
// tone becomes a level: dark cells are heavy, dark-ink letters, light cells
// fade towards the paper. Pure functions only.

export const TEXT_IMAGE_LEVELS = 8;

// A monospace cell is this many em wide (Recursive's advance) and 1em tall.
export const CELL_ASPECT = 0.6;

// Separators between phrases; Recursive draws both, so they keep the grid.
const SEPARATORS = ["→", "↗"] as const;

export interface ToneOptions {
  // Treat light pixels as ink (for light-on-dark source images).
  invert?: boolean;
}

/** Grid rows for a source of this size, so the text keeps its proportions. */
export function gridRows(cols: number, width: number, height: number): number {
  return Math.max(1, Math.round((cols * CELL_ASPECT * height) / width));
}

/**
 * Greyscale pixels (0 black, 255 white) to ink levels (0 paper, LEVELS - 1
 * full ink), by histogram equalisation: each level gets an equal share of
 * the cells, so the picture uses the whole tone ramp whatever its exposure.
 */
export function toneLevels(pixels: ArrayLike<number>, opts: ToneOptions = {}): number[] {
  const { invert = false } = opts;
  const ink = Array.from(pixels, (p) => (invert ? p : 255 - p));
  const counts = Array.from<number>({ length: 256 }).fill(0);
  for (const v of ink) counts[v]++;
  // How many cells are lighter than each ink value.
  let seen = 0;
  const lighter = counts.map((n) => (seen += n) - n);
  // Scaled so the lightest cells are paper and the darkest full ink.
  const span = ink.length - counts[Math.max(...ink)];
  return ink.map((v) =>
    span === 0
      ? Math.floor(TEXT_IMAGE_LEVELS / 2)
      : Math.round((lighter[v] / span) * (TEXT_IMAGE_LEVELS - 1)),
  );
}

/** Phrases run together, spaces shown as middle dots, so no cell is blank. */
export function textStream(phrases: readonly string[]): string {
  return phrases
    .map((phrase, i) => `${phrase} ${SEPARATORS[i % SEPARATORS.length]} `)
    .join("")
    .replaceAll(/\s+/g, "·");
}

const escapeHtml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/**
 * One HTML string per grid row: the stream's characters in reading order,
 * with each run of cells at the same level in one span.
 */
export function textImageRows(levels: readonly number[], cols: number, stream: string): string[] {
  const chars = Array.from(new Intl.Segmenter().segment(stream), (s) => s.segment);
  const rows: string[] = [];
  for (let start = 0; start < levels.length; start += cols) {
    let html = "";
    let run = "";
    let runLevel = levels[start];
    const flush = () => {
      if (run) html += `<span class="ti-${runLevel}">${escapeHtml(run)}</span>`;
    };
    for (let i = start; i < Math.min(start + cols, levels.length); i++) {
      if (levels[i] !== runLevel) {
        flush();
        run = "";
        runLevel = levels[i];
      }
      run += chars[i % chars.length];
    }
    flush();
    rows.push(html);
  }
  return rows;
}
