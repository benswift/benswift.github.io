// Pure text matching for <list-filter> (ListFilter.astro). Matching ignores
// case and diacritics, so "sorensen" finds "Sørensen" and "cafe" finds "café".

export interface FoldedText {
  // The text lowercased with combining marks stripped.
  folded: string;
  // starts[i] and ends[i] bound the original character that folded[i] came
  // from (one original character can fold to several, e.g. "ß" to "ss").
  starts: number[];
  ends: number[];
}

// Letters NFD leaves whole that a reader would still type without the accent.
const EXTRA_FOLDS: Record<string, string> = {
  ø: "o",
  æ: "ae",
  œ: "oe",
  ß: "ss",
  ł: "l",
  đ: "d",
};

function foldChar(char: string): string {
  const lower = char.toLowerCase();
  return EXTRA_FOLDS[lower] ?? lower.normalize("NFD").replace(/\p{M}/gu, "");
}

export function foldText(text: string): FoldedText {
  let folded = "";
  const starts: number[] = [];
  const ends: number[] = [];
  let offset = 0;
  for (const char of text) {
    const f = foldChar(char);
    folded += f;
    for (let i = 0; i < f.length; i++) {
      starts.push(offset);
      ends.push(offset + char.length);
    }
    offset += char.length;
  }
  return { folded, starts, ends };
}

export function parseQuery(query: string): string[] {
  return [...new Set(foldText(query).folded.split(/\s+/).filter(Boolean))];
}

// An item matches when every term appears somewhere in its text.
export function matchesAll(haystack: string, terms: readonly string[]): boolean {
  return terms.every((term) => haystack.includes(term));
}

// Original-text [start, end) offsets of each occurrence of each term.
export function matchRanges(text: FoldedText, terms: readonly string[]): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  for (const term of terms) {
    for (let at = text.folded.indexOf(term); at !== -1; at = text.folded.indexOf(term, at + 1)) {
      ranges.push([text.starts[at], text.ends[at + term.length - 1]]);
    }
  }
  return ranges;
}
