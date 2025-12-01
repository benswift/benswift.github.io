#!/usr/bin/env node
/**
 * Generate livecoding pages from _livecoding/ directory
 * Converts Jekyll-style livecoding gig pages to VitePress format
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const livecodingSourceDir = path.resolve(__dirname, "../_livecoding");
const livecodingOutputDir = path.resolve(__dirname, "../livecoding");

// Clean up existing generated pages (but keep index.md and livecoding.data.ts)
const keepFiles = ["index.md", "livecoding.data.ts"];
const existingItems = fs.readdirSync(livecodingOutputDir);
for (const item of existingItems) {
  if (keepFiles.includes(item)) continue;
  const itemPath = path.join(livecodingOutputDir, item);
  const stat = fs.statSync(itemPath);
  if (stat.isDirectory() || item.endsWith(".md")) {
    fs.rmSync(itemPath, { recursive: true });
    console.log("Removed:", itemPath);
  }
}

function removeJekyllSyntax(content, frontmatter) {
  // Replace Liquid {{ page.X }} expressions with actual frontmatter values
  content = content.replace(/\{\{\s*page\.(\w+)\s*\}\}/g, (match, key) => {
    if (frontmatter[key]) {
      return frontmatter[key];
    }
    return "";
  });
  // Remove any remaining Liquid {{ }} expressions
  content = content.replace(/\{\{[^}]+\}\}/g, "");
  // Remove {% %} Liquid tags (including includes)
  content = content.replace(/\{%[^%]+%\}/g, "");
  // Remove inline script tags (Vue can't handle these)
  content = content.replace(
    /<script[\s\S]*?<\/script>/gi,
    "<!-- Script removed during migration -->",
  );
  // Remove inline style tags
  content = content.replace(
    /<style[\s\S]*?<\/style>/gi,
    "<!-- Style removed during migration -->",
  );
  // Convert email autolinks (only simple email patterns, not HTML tags)
  content = content.replace(
    /<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/g,
    "[$1](mailto:$1)",
  );
  // Remove kramdown attribute syntax
  content = content.replace(/\{:[^}]+\}/g, "");
  // Remove empty markdown links like [text]()
  content = content.replace(/\[([^\]]+)\]\(\)/g, "$1");
  return content;
}

// Process each livecoding page
if (!fs.existsSync(livecodingSourceDir)) {
  console.error("_livecoding directory not found");
  process.exit(1);
}

const files = fs
  .readdirSync(livecodingSourceDir)
  .filter((f) => f.endsWith(".md"));

let count = 0;

for (const filename of files) {
  const filepath = path.join(livecodingSourceDir, filename);
  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { data: fm, content } = matter(fileContent);

  // Skip hidden pages
  if (fm.hidden) {
    console.log(`Skipping hidden: ${filename}`);
    continue;
  }

  const slug = filename.replace(/\.md$/, "");
  console.log(`Processing: ${filename}`);

  // Clean up Jekyll syntax
  let processedContent = removeJekyllSyntax(content, fm);

  // Build frontmatter
  const title = fm.title || slug;
  const escapedTitle = title.replace(/"/g, '\\"');

  let frontmatterLines = ["---", `title: "${escapedTitle}"`, "layout: doc"];

  if (fm.date) {
    const dateStr =
      typeof fm.date === "string" ? fm.date : fm.date.toISOString();
    frontmatterLines.push(`date: "${dateStr}"`);
  }

  if (fm.venue) {
    frontmatterLines.push(`venue: "${fm.venue.replace(/"/g, '\\"')}"`);
  }

  if (fm.type) {
    frontmatterLines.push(`type: "${fm.type}"`);
  }

  if (fm.event_url) {
    // Use single quotes for URLs that may contain escape sequences
    frontmatterLines.push(`event_url: '${fm.event_url}'`);
  }

  if (fm.venue_url) {
    frontmatterLines.push(`venue_url: '${fm.venue_url}'`);
  }

  if (fm.video_url) {
    frontmatterLines.push(`video_url: '${fm.video_url}'`);
  }

  frontmatterLines.push("---");

  // Parse date for display
  let dateStr = "2000-01-01";
  const filenameMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  if (filenameMatch) {
    dateStr = filenameMatch[1];
  } else if (fm.date) {
    dateStr =
      typeof fm.date === "string"
        ? fm.date.split("T")[0]
        : fm.date.toISOString().split("T")[0];
  }
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Build metadata section
  let metaLines = [];
  if (fm.venue) {
    if (fm.venue_url) {
      metaLines.push(`**Venue:** [${fm.venue}](${fm.venue_url})`);
    } else {
      metaLines.push(`**Venue:** ${fm.venue}`);
    }
  }
  if (fm.type) {
    metaLines.push(`**Type:** ${fm.type}`);
  }
  if (fm.event_url) {
    metaLines.push(`[Event page](${fm.event_url})`);
  }
  if (fm.video_url) {
    metaLines.push(`[Video](${fm.video_url})`);
  }

  // Build curators/artists lists if present
  if (fm.curators && Array.isArray(fm.curators) && fm.curators.length > 0) {
    metaLines.push(`**Curators:** ${fm.curators.join(", ")}`);
  }
  if (fm.artists && Array.isArray(fm.artists) && fm.artists.length > 0) {
    metaLines.push(`**Artists:** ${fm.artists.join(", ")}`);
  }

  const metaSection =
    metaLines.length > 0 ? metaLines.join(" | ") + "\n\n" : "";

  const pageContent =
    frontmatterLines.join("\n") +
    "\n\n" +
    `# ${title}\n\n` +
    `<p class="post-date">${dateFormatted}</p>\n\n` +
    metaSection +
    processedContent;

  // Write to livecoding/slug.md
  const outputPath = path.join(livecodingOutputDir, `${slug}.md`);
  fs.writeFileSync(outputPath, pageContent);
  count++;
}

console.log(`Generated ${count} livecoding pages`);
