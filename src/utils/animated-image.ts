/**
 * Detect animated WebP from its container bytes.
 *
 * sharp doesn't animate by default, so an animated source fed through Astro's
 * image pipeline silently comes out as a single still frame. Picture.astro uses
 * this to route animated sources to a raw <img> instead.
 *
 * The WebP container spec puts an optional VP8X extended-format chunk first,
 * immediately after the 12-byte RIFF header, and its flags byte carries the
 * animation bit. A file with no VP8X chunk is a plain still WebP.
 *
 * @see https://developers.google.com/speed/webp/docs/riff_container
 */

const ANIMATION_FLAG = 0x02;

const asciiAt = (bytes: Uint8Array, offset: number, expected: string): boolean =>
  expected.split("").every((char, i) => bytes[offset + i] === char.charCodeAt(0));

export function isAnimatedWebp(bytes: Uint8Array): boolean {
  // RIFF header ("RIFF" + 4-byte size + "WEBP"), then the VP8X chunk id and its
  // 4-byte size, putting the flags byte at offset 20.
  if (bytes.length < 21) return false;
  if (!asciiAt(bytes, 0, "RIFF") || !asciiAt(bytes, 8, "WEBP")) return false;
  if (!asciiAt(bytes, 12, "VP8X")) return false;

  return (bytes[20]! & ANIMATION_FLAG) !== 0;
}
