#!/usr/bin/env npx tsx

import fs from "node:fs";
import path from "node:path";
import { slugify } from "../src/utils/slugify";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: npx tsx scripts/new-post.ts <title>");
    console.error('Example: npx tsx scripts/new-post.ts "My New Blog Post"');
    process.exit(1);
  }

  const title = args.join(" ");
  const slug = slugify(title);
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const dirPath = path.join("blog", year, month, day);
  const filePath = path.join(dirPath, `${slug}.md`);

  fs.mkdirSync(dirPath, { recursive: true });

  if (fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} already exists`);
    process.exit(1);
  }

  const frontmatter = `---
title: "${title}"
published: false
tags: []
---

`;

  fs.writeFileSync(filePath, frontmatter);
  console.log(`Created ${filePath}`);
}

main();
