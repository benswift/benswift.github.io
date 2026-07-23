import { describe, expect, it } from "vitest";

import fixture from "./scotoma-blur-fixture.json" with { type: "json" };
import { boxRadiusForSigma, gaussianBlurRgba, pairAligned } from "./scotoma";

describe("pairAligned", () => {
  it("pairs equal-length streams position by position", () => {
    const result = pairAligned("abc", "xyz");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.layout).toEqual([
      [
        ["A", "X"],
        ["B", "Y"],
        ["C", "Z"],
      ],
    ]);
    expect(result.cells).toBe(3);
  });

  it("renders a space as a gap in its own stream only", () => {
    const result = pairAligned("A B", "XYZ");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.layout[0]).toEqual([
      ["A", "X"],
      [null, "Y"],
      ["B", "Z"],
    ]);
  });

  it("is symmetric, so the streams can be swapped", () => {
    const forward = pairAligned("TRUST THE HUMAN", "STUFF THE ROBOT");
    const swapped = pairAligned("STUFF THE ROBOT", "TRUST THE HUMAN");
    expect(forward.ok && swapped.ok).toBe(true);
    if (!forward.ok || !swapped.ok) return;
    expect(swapped.layout[0].map(([a, b]) => [b, a])).toEqual(forward.layout[0]);
  });

  it("reports a length mismatch with the offending box and count", () => {
    const result = pairAligned("TOOLONG", "SHORT");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toContain("2 characters too many in the top box");
  });

  it("rejects misaligned line breaks", () => {
    const result = pairAligned("AB\nCD", "ABC\nD");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toContain("Line breaks must line up");
  });

  it("splits rows on matching newlines", () => {
    const result = pairAligned("AB\nCD", "WX\nYZ");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.layout).toHaveLength(2);
    expect(result.cells).toBe(4);
  });

  it("rejects empty streams", () => {
    expect(pairAligned("", "ABC").ok).toBe(false);
    expect(pairAligned("   ", "ABC").ok).toBe(false);
  });
});

describe("boxRadiusForSigma", () => {
  it("matches Pillow's extended-box radius for the default blur", () => {
    // sigma = 0.10 * 96, the default blur: sigma2 = 30.72, L = 19.226, l = 9,
    // fractional part a = 0.0987.
    expect(boxRadiusForSigma(9.6)).toBeCloseTo(9.0987, 3);
  });
});

describe("gaussianBlurRgba", () => {
  const { width, height, input, cases } = fixture;

  it.each(cases.map((c) => [c.sigma, c] as const))(
    "matches PIL.ImageFilter.GaussianBlur at sigma=%s",
    (_sigma, testCase) => {
      const data = new Uint8ClampedArray(input);
      gaussianBlurRgba(data, width, height, testCase.sigma);

      let maxErr = 0;
      let sumErr = 0;
      for (let i = 0; i < data.length; i++) {
        const err = Math.abs(data[i] - testCase.expected[i]);
        maxErr = Math.max(maxErr, err);
        sumErr += err;
      }
      // Pillow accumulates in 24-bit fixed point and rounds every pass; we use
      // float32 and round once. A byte or two of drift is expected, and is far
      // below anything that would shift the measured crossover.
      expect(maxErr).toBeLessThanOrEqual(2);
      expect(sumErr / data.length).toBeLessThan(0.5);
    },
  );

  it("leaves the image untouched at sigma 0", () => {
    const data = new Uint8ClampedArray(input);
    gaussianBlurRgba(data, width, height, 0);
    expect([...data]).toEqual(input);
  });
});
