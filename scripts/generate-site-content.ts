#!/usr/bin/env pnpm exec tsx

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();

function readMarkdownFiles(dir: string): string[] {
  const absDir = path.resolve(ROOT, dir);
  if (!fs.existsSync(absDir)) return [];
  return fs
    .readdirSync(absDir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .filter((f) => !f.includes("index.md"))
    .map((f) => path.join(absDir, f))
    .toSorted();
}

function stripMdxSyntax(content: string): string {
  return content
    .replaceAll(/^import\s+.+$/gm, "")
    .replaceAll(/<[A-Z]\w+[^>]*\/>/g, "")
    .replaceAll(/<[A-Z]\w+[^>]*>[\s\S]*?<\/[A-Z]\w+>/g, "")
    .replaceAll(/<(svg|div|span)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replaceAll(/:::(tip|info|warning|danger|details).*\n/g, "")
    .replaceAll(/^:::\s*$/gm, "")
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}

function formatTags(tags: unknown): string {
  if (!tags) return "";
  if (Array.isArray(tags)) return tags.join(", ");
  return String(tags);
}

function main() {
  const sections: string[] = [];

  const pages = [
    { file: "src/pages/index.md", label: "Home" },
    { file: "src/pages/bio.mdx", label: "Bio" },
    { file: "src/pages/cv.mdx", label: "CV" },
    { file: "src/pages/research.mdx", label: "Research" },
    { file: "src/pages/teaching.mdx", label: "Teaching" },
  ];

  for (const { file, label } of pages) {
    const absPath = path.resolve(ROOT, file);
    if (!fs.existsSync(absPath)) continue;
    const raw = fs.readFileSync(absPath, "utf8");
    const { content } = matter(raw);
    sections.push(`## ${label}\n\n${stripMdxSyntax(content)}`);
  }

  const blogFiles = readMarkdownFiles("blog");
  const posts: string[] = [];

  for (const file of blogFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);
    if (data.published === false) continue;
    const slug = file.replace(ROOT + "/blog/", "").replace(/\.(md|mdx)$/, "");
    const date = slug.split("/").slice(0, 3).join("-");
    const tags = formatTags(data.tags);
    posts.push(`- ${data.title} (${date})${tags ? ` [${tags}]` : ""}`);
  }

  if (posts.length > 0) {
    sections.push(`\n## Blog posts\n\n${posts.join("\n")}`);
  }

  const output = sections.join("\n");
  const outPath = path.resolve(ROOT, "public", "site-content.txt");
  fs.writeFileSync(outPath, output);

  const sizeKB = (Buffer.byteLength(output) / 1024).toFixed(1);
  console.log(`Wrote ${sizeKB} KB to ${outPath} (${posts.length} blog posts)`);
}

main();
