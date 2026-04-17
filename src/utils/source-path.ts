import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Resolve the actual source file path for a content collection entry, so
 * footer "source" and "history" links target a file that exists on GitHub.
 *
 * Astro's glob loader strips the `.md`/`.mdx` extension from entry ids, but
 * GitHub needs the real filename to render the blob. We check which extension
 * exists on disk at build time.
 */
export function resolveContentPath(
  collection: string,
  id: string,
  root: string = process.cwd(),
): string {
  const stem = id.replace(/\.mdx?$/, "");
  for (const ext of [".md", ".mdx"] as const) {
    const candidate = `${collection}/${stem}${ext}`;
    if (existsSync(resolve(root, candidate))) return candidate;
  }
  // Fall back to .md — the caller knows this content exists because it came
  // from the loader, so this only hits for entries outside a collection.
  return `${collection}/${stem}.md`;
}
