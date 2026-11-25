// The typed wall's phrase handling, shared by the server render (Wall.astro)
// and the browser typist (wall-typist.ts). Pure functions only.

// Each hue is a `--hue-<name>` custom property in global.css.
export const WALL_HUES = [
  "tomato",
  "tangerine",
  "sun",
  "leaf",
  "lagoon",
  "sky",
  "iris",
  "orchid",
  "rose",
] as const;

export const WALL_WEIGHTS = [100, 200, 300, 500, 700, 800, 900] as const;

// Key caps and marks Allo draws itself, so they take each phrase's weight.
export const WALL_GLYPHS = [
  "⌘",
  "⏎",
  "⇥",
  "⌫",
  "⌥",
  "⇧",
  "⎋",
  "␣",
  "❯",
  "→",
  "↗",
  "★",
  "♥",
  "◆",
  "✓",
  "⌕",
  "&",
  "#",
  "§",
] as const;

const MAX_PHRASE_LEN = 36;
// A token never breaks across lines, so one longer than this would overflow
// the wall on a phone.
const MAX_TOKEN_LEN = 13;

export interface WallToken {
  text: string;
  // Whether a space separates this token from the one before it.
  space: boolean;
}

export interface WallStyle {
  hue: (typeof WALL_HUES)[number];
  weight: (typeof WALL_WEIGHTS)[number];
  glyph: (typeof WALL_GLYPHS)[number];
}

export interface WallPhrase extends WallStyle {
  tokens: WallToken[];
}

/** Words, split again after hyphens so a compound can wrap there. */
export function tokenise(phrase: string): WallToken[] {
  return phrase.split(" ").flatMap((word) =>
    word
      .split(/(?<=-)(?=.)/)
      .filter(Boolean)
      .map((text, i) => ({ text, space: i === 0 })),
  );
}

/** Normalise whitespace, drop phrases that won't fit, and dedupe ignoring case. */
export function prepPhrases(phrases: readonly string[]): string[] {
  const seen = new Set<string>();
  return phrases
    .map((phrase) => phrase.replaceAll(/\s+/g, " ").trim())
    .filter((phrase) => {
      if (phrase.length < 2 || phrase.length > MAX_PHRASE_LEN) return false;
      if (tokenise(phrase).some((token) => token.text.length > MAX_TOKEN_LEN)) return false;
      const key = phrase.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

/** Seeded PRNG, so a page's server-rendered wall is the same on every build. */
export function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Returns a function that picks each phrase's hue, weight and closing glyph,
 * never repeating the previous phrase's hue or weight.
 */
export function makeStylist(random: () => number): () => WallStyle {
  let lastHue: string | undefined;
  let lastWeight: number | undefined;
  const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length)];
  return () => {
    const weight = pick(WALL_WEIGHTS.filter((w) => w !== lastWeight));
    // Yellow is too faint on a white page in the thin weights.
    const hue = pick(WALL_HUES.filter((h) => h !== lastHue && (h !== "sun" || weight >= 700)));
    lastHue = hue;
    lastWeight = weight;
    return { hue, weight, glyph: pick(WALL_GLYPHS) };
  };
}

export function phraseStyle({ hue, weight }: WallStyle): string {
  return `color:var(--hue-${hue});font-weight:${weight}`;
}

const escapeHtml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const wordHtml = (text: string) => `<span class="wall-word">${escapeHtml(text)}</span>`;

/**
 * The wall's markup, built as a string because its whitespace matters: a
 * space is a line-break opportunity, and hyphenated tokens must touch.
 */
export function wallHtml(phrases: readonly WallPhrase[]): string {
  return phrases
    .map((phrase) => {
      const words = phrase.tokens.map((token) => (token.space ? " " : "") + wordHtml(token.text));
      return `<span class="wall-phrase" style="${phraseStyle(phrase)}">${words.join("").trim()} ${wordHtml(phrase.glyph)}</span>`;
    })
    .join(" ");
}
