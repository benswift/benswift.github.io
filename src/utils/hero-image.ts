import type { ImageMetadata } from "astro";
import defaultHero from "../assets/og-default.avif";

const heroImageModules = import.meta.glob<ImageMetadata>("/src/assets/heroes/*.avif", {
  eager: true,
  import: "default",
});

export function resolveHeroImage(
  slug: string,
  map: Record<string, ImageMetadata>,
  fallback: ImageMetadata,
): ImageMetadata {
  if (!slug) return fallback;
  const key = `/src/assets/heroes/${slug}.avif`;
  return map[key] ?? fallback;
}

export function getHeroImage(slug: string): ImageMetadata {
  return resolveHeroImage(slug, heroImageModules, defaultHero);
}
