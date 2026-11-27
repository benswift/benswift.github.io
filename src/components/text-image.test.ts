import { describe, expect, it } from "vitest";
import { gridRows, TEXT_IMAGE_LEVELS, textImageRows, textStream, toneLevels } from "./text-image";

describe("gridRows", () => {
  it("keeps the source's proportions with cells 0.6 as wide as they are tall", () => {
    expect(gridRows(100, 1000, 1000)).toBe(60);
    expect(gridRows(100, 1000, 500)).toBe(30);
  });
});

describe("toneLevels", () => {
  it("makes black full ink and white paper", () => {
    const levels = toneLevels([0, 255]);
    expect(levels[0]).toBe(TEXT_IMAGE_LEVELS - 1);
    expect(levels[1]).toBe(0);
  });

  it("swaps ink and paper when inverted", () => {
    expect(toneLevels([0, 255], { invert: true })).toEqual([0, TEXT_IMAGE_LEVELS - 1]);
  });

  it("spreads a low-contrast image across the whole ramp", () => {
    const grey = Array.from({ length: 800 }, (_, i) => 100 + (i % 8));
    const levels = new Set(toneLevels(grey));
    expect(levels.size).toBe(TEXT_IMAGE_LEVELS);
  });
});

describe("textStream", () => {
  it("joins the phrases with separators and shows spaces as dots", () => {
    expect(textStream(["Ben Swift", "livecoding"])).toBe("Ben·Swift·→·livecoding·↗·");
  });
});

describe("textImageRows", () => {
  it("lays the stream out in reading order, one span per run of a level", () => {
    expect(textImageRows([7, 7, 0, 3, 3, 3], 3, "abcd")).toEqual([
      '<span class="ti-7">ab</span><span class="ti-0">c</span>',
      '<span class="ti-3">dab</span>',
    ]);
  });

  it("escapes the stream", () => {
    expect(textImageRows([1, 1], 2, "<&")).toEqual(['<span class="ti-1">&lt;&amp;</span>']);
  });
});
