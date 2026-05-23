import type { ImageMetadata } from "astro";
import defaultHero from "../assets/og-default.avif";

const heroImageModules = import.meta.glob<{ default: ImageMetadata }>("/src/assets/heroes/*.avif", {
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
  // Eager-glob already returns the default export per `import: "default"`.
  const map = heroImageModules as unknown as Record<string, ImageMetadata>;
  return resolveHeroImage(slug, map, defaultHero);
}
