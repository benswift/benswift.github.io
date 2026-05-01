import { describe, it, expect } from "vitest";
import { emptyPixels, incrementCell, clearLastCell } from "./pixel-pad-state";

describe("emptyPixels", () => {
  it("returns an array of the requested length", () => {
    expect(emptyPixels(36)).toHaveLength(36);
  });

  it("returns an array filled with zeros", () => {
    expect(emptyPixels(3)).toEqual([0, 0, 0]);
  });
});

describe("incrementCell", () => {
  it("increments the targeted cell by step", () => {
    const result = incrementCell(emptyPixels(36), 5, 0.15, null);
    expect(result.pixels[5]).toBeCloseTo(0.15);
    expect(result.lastIndex).toBe(5);
  });

  it("does not mutate the input array", () => {
    const before = emptyPixels(36);
    const result = incrementCell(before, 5, 0.15, null);
    expect(before[5]).toBe(0);
    expect(result.pixels).not.toBe(before);
  });

  it("caps cell value at 1.0", () => {
    let pixels = emptyPixels(36);
    let lastIndex: number | null = null;
    for (let i = 0; i < 20; i++) {
      const result = incrementCell(pixels, 5, 0.15, lastIndex);
      pixels = result.pixels;
      lastIndex = i % 2 === 0 ? null : 5;
    }
    expect(pixels[5]).toBe(1);
  });

  it("does not double-increment the same cell while it is the last cell", () => {
    const first = incrementCell(emptyPixels(36), 5, 0.15, null);
    const second = incrementCell(first.pixels, 5, 0.15, first.lastIndex);
    expect(second.pixels[5]).toBeCloseTo(0.15);
    expect(second.pixels).toBe(first.pixels); // unchanged → same reference returned
    expect(second.lastIndex).toBe(5);
  });

  it("re-increments a cell after the pointer leaves and returns", () => {
    const a = incrementCell(emptyPixels(36), 5, 0.15, null);
    const b = incrementCell(a.pixels, 6, 0.15, a.lastIndex);
    const c = incrementCell(b.pixels, 5, 0.15, b.lastIndex);
    expect(c.pixels[5]).toBeCloseTo(0.3);
  });

  it("uses the supplied step value", () => {
    const result = incrementCell(emptyPixels(36), 5, 0.25, null);
    expect(result.pixels[5]).toBeCloseTo(0.25);
  });
});

describe("clearLastCell", () => {
  it("returns null lastIndex without touching pixels", () => {
    const pixels = emptyPixels(36);
    pixels[5] = 0.5;
    const result = clearLastCell(pixels);
    expect(result.lastIndex).toBeNull();
    expect(result.pixels).toBe(pixels);
  });
});
