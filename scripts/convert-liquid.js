#!/usr/bin/env node

/**
 * Convert Jekyll Liquid syntax to VitePress Vue syntax
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.resolve(__dirname, "../posts");

// Patterns to convert
const conversions = [
  // YouTube includes
  {
    pattern: /\{%\s*include\s+youtube\.html\s+id="([^"]+)"\s*%\}/g,
    replacement: '<YouTube id="$1" />',
  },
  // Picture includes (basic)
  {
    pattern:
      /\{%\s*include\s+picture\.html\s+file="([^"]+)"\s+alt="([^"]+)"\s*%\}/g,
    replacement: '<Picture file="$1" alt="$2" />',
  },
  // Picture includes with credit
  {
    pattern:
      /\{%\s*include\s+picture\.html\s+file="([^"]+)"\s+alt="([^"]+)"\s+credit="([^"]+)"\s*%\}/g,
    replacement: '<Picture file="$1" alt="$2" credit="$3" />',
  },
  // Link tags - convert to absolute paths
  {
    pattern: /\{%\s*link\s+research\.md\s*%\}/g,
    replacement: "/research",
  },
  {
    pattern: /\{%\s*link\s+teaching\.md\s*%\}/g,
    replacement: "/teaching",
  },
  {
    pattern: /\{%\s*link\s+livecoding\.md\s*%\}/g,
    replacement: "/livecoding/",
  },
  {
    pattern: /\{%\s*link\s+talks\.md\s*%\}/g,
    replacement: "/talks/",
  },
  {
    pattern: /\{%\s*link\s+blog\.md\s*%\}/g,
    replacement: "/blog/",
  },
  {
    pattern: /\{%\s*link\s+bio\.md\s*%\}/g,
    replacement: "/bio",
  },
  {
    pattern: /\{%\s*link\s+cv\.md\s*%\}/g,
    replacement: "/cv",
  },
  // Links to posts - convert to blog URLs
  {
    pattern:
      /\{%\s*link\s+_posts\/(\d{4})-(\d{2})-(\d{2})-([^\.]+)\.md\s*%\}/g,
    replacement: "/blog/$1/$2/$3/$4",
  },
  // Links to talks
  {
    pattern: /\{%\s*link\s+_talks\/([^\.]+)\.md\s*%\}/g,
    replacement: "/talks/$1",
  },
  // Links to livecoding
  {
    pattern: /\{%\s*link\s+_livecoding\/([^\.]+)\.md\s*%\}/g,
    replacement: "/livecoding/$1",
  },
  // Links to assets (images, pdfs, etc.)
  {
    pattern: /\{%\s*link\s+assets\/([^\s%]+)\s*%\}/g,
    replacement: "/assets/$1",
  },
  // Links to widgets
  {
    pattern: /\{%\s*link\s+widgets\/([^\s%]+)\s*%\}/g,
    replacement: "/widgets/$1",
  },
  // TOC include - use VitePress native [[toc]]
  {
    pattern: /\{%\s*include\s+toc\.html\s*%\}/g,
    replacement: "[[toc]]",
  },
  // Picture includes with style attribute
  {
    pattern:
      /\{%\s*include\s+picture\.html\s+file="([^"]+)"\s+alt="([^"]+)"\s+style="[^"]*"\s*%\}/g,
    replacement: '<Picture file="$1" alt="$2" />',
  },
];

// Process all markdown files in posts directory
const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

let totalChanges = 0;

files.forEach((filename) => {
  const filepath = path.join(postsDir, filename);
  let content = fs.readFileSync(filepath, "utf-8");
  let originalContent = content;
  let fileChanges = 0;

  conversions.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileChanges += matches.length;
      content = content.replace(pattern, replacement);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${filename}: ${fileChanges} changes`);
    totalChanges += fileChanges;
  }
});

console.log(`\nTotal changes: ${totalChanges}`);
console.log("\nRemaining patterns to manually fix:");
console.log('- Complex {% include %} patterns with different attribute orders');
console.log("- {% link %} to files not in the conversion list");
console.log("- {% fa_svg %} font awesome icons");
