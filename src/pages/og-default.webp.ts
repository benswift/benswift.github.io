import { readFile } from "node:fs/promises";
import sharp from "sharp";

// A stable URL for the site's default social card. Pages get theirs through
// astro:assets (a hashed /_astro/ path), but the astromotion integration's
// `ogImage` option, used by every deck without its own image, needs a fixed one.
export async function GET() {
  const source = await readFile("src/assets/og-default.avif");
  const webp = await sharp(source).resize({ width: 1200 }).webp({ quality: 80 }).toBuffer();
  return new Response(new Uint8Array(webp), { headers: { "Content-Type": "image/webp" } });
}
