import { describe, expect, it } from "vitest";
import {
  makeStylist,
  mulberry32,
  prepPhrases,
  shuffled,
  tokenise,
  WALL_HUES,
  wallHtml,
} from "./wall";

describe("tokenise", () => {
  it("splits on spaces and after hyphens", () => {
    expect(tokenise("Human-Scale AI")).toEqual([
      { text: "Human-", space: true },
      { text: "Scale", space: false },
      { text: "AI", space: true },
    ]);
  });
});

describe("prepPhrases", () => {
  it("normalises whitespace and dedupes ignoring case", () => {
    expect(prepPhrases(["  Ben   Swift ", "ben swift", "livecoding"])).toEqual([
      "Ben Swift",
      "livecoding",
    ]);
  });

  it("drops phrases too long for the wall, or with a word too long for one line", () => {
    expect(prepPhrases(["x".repeat(40), "a supercalifragilistic word", "", "e", "fine"])).toEqual([
      "fine",
    ]);
  });
});

describe("makeStylist", () => {
  it("never repeats the previous phrase's hue or weight, and keeps yellow heavy", () => {
    const pick = makeStylist(mulberry32(1));
    const styles = Array.from({ length: 200 }, pick);
    for (const [i, style] of styles.entries()) {
      expect(WALL_HUES).toContain(style.hue);
      if (style.hue === "sun") expect(style.weight).toBeGreaterThanOrEqual(700);
      if (i > 0) {
        expect(style.hue).not.toBe(styles[i - 1].hue);
        expect(style.weight).not.toBe(styles[i - 1].weight);
      }
    }
  });
});

describe("shuffled", () => {
  it("is a permutation, repeatable from the same seed", () => {
    const items = ["a", "b", "c", "d", "e"];
    const once = shuffled(items, mulberry32(7));
    expect(once.toSorted()).toEqual(items);
    expect(shuffled(items, mulberry32(7))).toEqual(once);
  });
});

describe("wallHtml", () => {
  it("joins a hyphenated compound without a space and escapes text", () => {
    const html = wallHtml([
      { tokens: tokenise("R&D co-design"), hue: "sky", weight: 800, glyph: "⌘" },
    ]);
    expect(html).toBe(
      '<span class="wall-phrase" style="color:var(--hue-sky);font-weight:800">' +
        '<span class="wall-word">R&amp;D</span> ' +
        '<span class="wall-word">co-</span><span class="wall-word">design</span> ' +
        '<span class="wall-word">⌘</span></span>',
    );
  });
});
