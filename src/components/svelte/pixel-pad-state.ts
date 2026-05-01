export type PadState = {
  pixels: number[];
  lastIndex: number | null;
};

export function emptyPixels(length: number): number[] {
  return Array.from({ length }, () => 0);
}

export function incrementCell(
  pixels: number[],
  index: number,
  step: number,
  lastIndex: number | null,
): PadState {
  if (index === lastIndex) {
    return { pixels, lastIndex };
  }
  const next = pixels.slice();
  next[index] = Math.min(1, pixels[index] + step);
  return { pixels: next, lastIndex: index };
}

export function clearLastCell(pixels: number[]): PadState {
  return { pixels, lastIndex: null };
}
