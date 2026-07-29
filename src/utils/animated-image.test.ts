import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { isAnimatedWebp } from "./animated-image";

/** Build a minimal WebP container: RIFF header, then an optional VP8X chunk. */
function webp({ vp8x, flags = 0 }: { vp8x: boolean; flags?: number }): Uint8Array {
  const bytes = new Uint8Array(32);
  const write = (offset: number, text: string) => {
    for (const [i, char] of [...text].entries()) bytes[offset + i] = char.charCodeAt(0);
  };
  write(0, "RIFF");
  write(8, "WEBP");
  if (vp8x) {
    write(12, "VP8X");
    bytes[16] = 10; // chunk size
    bytes[20] = flags;
  } else {
    write(12, "VP8 "); // a plain lossy still frame
  }
  return bytes;
}

describe("isAnimatedWebp", () => {
  it("detects the animation flag in a VP8X chunk", () => {
    expect(isAnimatedWebp(webp({ vp8x: true, flags: 0x02 }))).toBe(true);
  });

  it("ignores other VP8X flags", () => {
    // 0x10 is the alpha flag — extended format, but a still image.
    expect(isAnimatedWebp(webp({ vp8x: true, flags: 0x10 }))).toBe(false);
  });

  it("treats a WebP with no VP8X chunk as still", () => {
    expect(isAnimatedWebp(webp({ vp8x: false }))).toBe(false);
  });

  it("rejects non-WebP and truncated input", () => {
    expect(isAnimatedWebp(new Uint8Array(0))).toBe(false);
    expect(isAnimatedWebp(new Uint8Array(64))).toBe(false);
    expect(isAnimatedWebp(new TextEncoder().encode("GIF89a"))).toBe(false);
  });

  it("detects the real animated post image", async () => {
    const bytes = await readFile("src/assets/post-images/posts/ben-oils.webp");
    expect(isAnimatedWebp(bytes)).toBe(true);
  });
});
