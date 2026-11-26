import { describe, expect, it } from "vitest";
import { foldText, matchesAll, matchRanges, parseQuery } from "./list-filter";

describe("parseQuery", () => {
  it("splits on whitespace, folds case and accents, and dedupes", () => {
    expect(parseQuery("  Café  NIME cafe ")).toEqual(["cafe", "nime"]);
  });

  it("returns no terms for a blank query", () => {
    expect(parseQuery("   ")).toEqual([]);
  });
});

describe("matchesAll", () => {
  const haystack = foldText("Sørensen, B. Swift — Proceedings of NIME 2019").folded;

  it("matches when every term appears, ignoring accents", () => {
    expect(matchesAll(haystack, parseQuery("sorensen nime"))).toBe(true);
  });

  it("fails when any term is missing", () => {
    expect(matchesAll(haystack, parseQuery("sorensen icmc"))).toBe(false);
  });

  it("matches everything with no terms", () => {
    expect(matchesAll(haystack, [])).toBe(true);
  });
});

const slice = (text: string, query: string) =>
  matchRanges(foldText(text), parseQuery(query)).map(([start, end]) => text.slice(start, end));

describe("matchRanges", () => {
  it("returns the original text of each match", () => {
    expect(slice("Livecoding and live music", "LIVE")).toEqual(["Live", "live"]);
  });

  it("maps matches back across accents and expanding letters", () => {
    expect(slice("Café Straße", "cafe strasse")).toEqual(["Café", "Straße"]);
  });

  it("covers the whole original letter when a match ends inside its expansion", () => {
    expect(slice("Straße", "stras")).toEqual(["Straß"]);
  });

  it("keeps offsets right after astral characters", () => {
    expect(slice("🎹 piano", "piano")).toEqual(["piano"]);
  });
});
