#!/usr/bin/env node
/**
 * Generate blog post pages from posts/ directory
 * Creates /blog/YYYY/MM/DD/slug.md files for each post
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.resolve(__dirname, "../posts");
const blogDir = path.resolve(__dirname, "../blog");

// Clean up existing generated posts (but keep index.md and tag/)
const existingDirs = fs.readdirSync(blogDir);
for (const item of existingDirs) {
  const itemPath = path.join(blogDir, item);
  const stat = fs.statSync(itemPath);
  // Remove year directories (they're generated)
  if (stat.isDirectory() && /^\d{4}$/.test(item)) {
    fs.rmSync(itemPath, { recursive: true });
    console.log("Removed:", itemPath);
  }
}

// Remove old paths files
const pathsFiles = ["[...slug].md", "[...slug].paths.js", "[...slug].paths.ts"];
for (const file of pathsFiles) {
  const filePath = path.join(blogDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Removed:", filePath);
  }
}

// Skip these posts that have complex HTML that Vue can't parse
// These need manual cleanup of Jekyll-specific attributes like markdown="1"
const skipList = [
  "2019-11-07-codesign-culture-lab-workshop.md", // Complex inline HTML/JS widgets
  "2021-04-23-a-short-list-of-extempore-livecoding-tricks.md", // HTML parsing issues with < symbols
  "2023-02-02-academic-integrity-policy-re-chatgpt-and-generative-ai-tools.md", // markdown="1" attribute
];

// Process each post
const files = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md") && !skipList.includes(f));
let count = 0;

for (const filename of files) {
  const filepath = path.join(postsDir, filename);
  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { data: fm, content } = matter(fileContent);

  // Parse filename: YYYY-MM-DD-slug.md
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) {
    console.warn("Could not parse filename:", filename);
    continue;
  }

  const [, year, month, day, slug] = match;
  const dateStr = year + "-" + month + "-" + day;
  const date = new Date(dateStr);

  // Parse tags
  let tags = [];
  if (fm.tags) {
    if (Array.isArray(fm.tags)) {
      tags = fm.tags;
    } else if (typeof fm.tags === "string") {
      tags = fm.tags.split(/\s+/).filter(Boolean);
    }
  }

  const title = fm.title || slug;
  const subtitle = fm.subtitle;
  const dateFormatted = date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

  // Build the page content
  const tagsYaml =
    tags.length > 0 ? "tags:\n" + tags.map((t) => "  - " + t).join("\n") : "";
  const subtitleLine = subtitle
    ? '\n<p class="post-subtitle">' + subtitle + "</p>\n"
    : "";
  const tagsComponent =
    tags.length > 0
      ? "\n<TagList :tags='" + JSON.stringify(tags) + "' />\n"
      : "";
  const escapedTitle = title.replace(/"/g, '\\"');

  // Remove inline script and style tags that Vue can't handle (they were for Jekyll widgets)
  // Also convert autolinks <url> to [url](url) format that Vue can handle
  // And replace Jekyll {{ site.baseurl }} with empty string (baseurl is /)
  let processedContent = content
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      "<!-- Script removed during migration -->",
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      "<!-- Style removed during migration -->",
    )
    .replace(/<(https?:\/\/[^>]+)>/g, "[$1]($1)")
    .replace(/\{\{\s*site\.baseurl\s*\}\}/g, "");

  const pageContent = `---
title: "${escapedTitle}"
aside: false
layout: doc
${tagsYaml}
---

# ${title}

<p class="post-date">${dateFormatted}</p>
${subtitleLine}${tagsComponent}
${processedContent}`;

  // Create directory structure: blog/YYYY/MM/DD/slug.md
  const postDir = path.join(blogDir, year, month, day);
  fs.mkdirSync(postDir, { recursive: true });

  const outputPath = path.join(postDir, `${slug}.md`);
  fs.writeFileSync(outputPath, pageContent);
  count++;
}

console.log(`Generated ${count} blog posts`);
