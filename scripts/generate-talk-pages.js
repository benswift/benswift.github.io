#!/usr/bin/env node
/**
 * Generate talk pages from _talks/ directory
 * Converts Jekyll-style talks to VitePress reveal.js presentations
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const talksSourceDir = path.resolve(__dirname, "../_talks");
const talksOutputDir = path.resolve(__dirname, "../talks");

// Clean up existing generated talks (but keep index.md and talks.data.ts)
const keepFiles = ["index.md", "talks.data.ts"];
const existingItems = fs.readdirSync(talksOutputDir);
for (const item of existingItems) {
  if (keepFiles.includes(item)) continue;
  const itemPath = path.join(talksOutputDir, item);
  const stat = fs.statSync(itemPath);
  if (stat.isDirectory() || item.endsWith(".md")) {
    fs.rmSync(itemPath, { recursive: true });
    console.log("Removed:", itemPath);
  }
}

// Jekyll include to Vue component mapping
const includeMapping = {
  "slides/title.html": "<SlideTitle />",
  "slides/fin.html": "<SlideFin />",
  "slides/questions.html": "<SlideQuestions />",
  "slides/impact.html": convertImpactInclude,
  "slides/background-image.html": convertBackgroundImageInclude,
  "slides/youtube.html": convertYouTubeInclude,
  "slides/box.html": convertBoxInclude,
  "slides/image-credit.html": convertImageCreditInclude,
  "slides/stacked-papers.html": convertStackedPapersInclude,
  "slides/info.html":
    '<h2 class="info-box" data-background-color="#b6daf2">info</h2>',
  "slides/talk.html":
    '<h2 class="talk-box" data-background-color="#aef4e6">talk</h2>',
  // Acknowledgement of country slide
  "slides/ack-country.html": "<SlideAckCountry />",
  // QR code - not yet implemented
  "qrcode.html": "<!-- QR code not yet implemented -->",
  // Highlight.js config - not needed in VitePress (handled by theme)
  "hljs.html": "",
  // Euclidean algorithm widget - complex, needs separate implementation
  "slides/euclid-algo-widget.html": convertEuclidWidgetInclude,
};

function parseJekyllIncludeParams(paramString) {
  const params = {};
  // Match key=value or key="value with spaces"
  const regex = /(\w+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let match;
  while ((match = regex.exec(paramString)) !== null) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4];
    params[key] = value;
  }
  return params;
}

function convertImpactInclude(params) {
  // Output an hr with the right attributes - revealify will convert to section
  const attrs = ['class="impact center"', 'data-background-color="#262626"'];
  if (params.id) attrs.push(`id="${params.id}"`);
  if (params.bgcol) attrs[1] = `data-background-color="${params.bgcol}"`;
  return `<hr ${attrs.join(" ")} />`;
}

function convertBackgroundImageInclude(params) {
  const props = [];
  if (params.image) props.push(`image="${params.image}"`);
  if (params.heading) props.push(`heading="${params.heading}"`);
  if (params.bgsize) props.push(`bgsize="${params.bgsize}"`);
  if (params.bgpos) props.push(`bgpos="${params.bgpos}"`);
  if (params.id) props.push(`id="${params.id}"`);
  if (params.center) props.push(':center="true"');
  if (params.alt) props.push(`alt="${params.alt}"`);
  if (params.bgcol) props.push(`bgcol="${params.bgcol}"`);
  return `<SlideBackgroundImage ${props.join(" ")} />`;
}

function convertYouTubeInclude(params) {
  const props = [];
  if (params.id) props.push(`id="${params.id}"`);
  if (params.heading) props.push(`heading="${params.heading}"`);
  return `<SlideYouTube ${props.join(" ")} />`;
}

function convertBoxInclude(params) {
  const type = params.type || "info";
  const backgroundColours = {
    error: "#f99",
    warning: "#ffe699",
    info: "#b6daf2",
    success: "#93e7b6",
    think: "#f9cbe1",
    talk: "#aef4e6",
    push: "#ff9854",
    extension: "#dbc3e5",
  };
  const bgColour = backgroundColours[type] || "#b6daf2";
  // Output an h2 with attributes - revealify will convert to section
  return `<h2 class="${type}-box" data-background-color="${bgColour}">${type}</h2>`;
}

function convertImageCreditInclude(params) {
  const props = [];
  if (params.artist) props.push(`artist="${params.artist}"`);
  if (params.title) props.push(`title="${params.title}"`);
  if (params.year) props.push(`year="${params.year}"`);
  if (params.style) props.push(`style="${params.style}"`);
  return `<SlideImageCredit ${props.join(" ")} />`;
}

function convertStackedPapersInclude(params) {
  const props = [];
  if (params["image-path"]) props.push(`imagePath="${params["image-path"]}"`);
  if (params.link) props.push(`link="${params.link}"`);
  if (params.alt) props.push(`alt="${params.alt}"`);
  if (params.width) props.push(`width="${params.width}"`);
  if (params.id) props.push(`id="${params.id}"`);
  return `<SlideStackedPapers ${props.join(" ")} />`;
}

function convertEuclidWidgetInclude(params) {
  // This is a complex widget that needs separate implementation
  // For now, just show a placeholder with the parameters
  const algobits = params.algobits || "";
  return `<!-- Euclidean algorithm widget: ${algobits} -->`;
}

function convertJekyllIncludes(content) {
  // Match {% include path params %}
  const includeRegex = /\{%\s*include\s+(\S+)\s*(.*?)\s*%\}/g;

  return content.replace(includeRegex, (match, includePath, paramString) => {
    const converter = includeMapping[includePath];
    if (converter === undefined) {
      console.warn(`  Unknown include: ${includePath}`);
      return `<!-- TODO: Convert ${includePath} -->`;
    }

    const params = parseJekyllIncludeParams(paramString);

    if (typeof converter === "function") {
      return converter(params);
    }
    return converter;
  });
}

function convertJekyllLinks(content) {
  // Convert {% link file.md %} to relative links
  return content.replace(/\{%\s*link\s+(\S+)\s*%\}/g, (match, file) => {
    // Handle _posts/YYYY-MM-DD-slug.md -> /blog/YYYY/MM/DD/slug
    if (file.startsWith("_posts/")) {
      const postFile = file.replace("_posts/", "");
      const postMatch = postFile.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
      if (postMatch) {
        const [, year, month, day, slug] = postMatch;
        return `/blog/${year}/${month}/${day}/${slug}`;
      }
    }
    // Handle livecoding.md -> /livecoding/
    if (file === "livecoding.md") {
      return "/livecoding/";
    }
    // Convert file.md to /file path
    const path = "/" + file.replace(/\.md$/, "");
    return path;
  });
}

function convertFontAwesome(content) {
  // Remove {% fa_svg ... %} tags - we handle icons differently in Vue
  return content.replace(/\{%\s*fa_svg\s+\S+\s*%\}/g, "");
}

function removeJekyllSpecificTags(content) {
  // Remove cc-link include (handled in component)
  content = content.replace(/\{%\s*include\s+cc-link\.html\s*%\}/g, "");
  // Remove qrcode include for now
  content = content.replace(
    /\{%\s*include\s+qrcode\.html[^%]*%\}/g,
    "<!-- QR code not yet implemented -->",
  );
  // Remove Liquid {{ }} expressions (Vue would try to interpret these)
  content = content.replace(
    /\{\{[^}]+\}\}/g,
    "<!-- Liquid expression removed -->",
  );
  // Remove remaining {% %} Liquid tags
  content = content.replace(/\{%[^%]+%\}/g, "");
  // Remove inline script tags (Vue can't handle these in markdown)
  content = content.replace(
    /<script[\s\S]*?<\/script>/gi,
    "<!-- Script removed during migration -->",
  );
  // Remove inline style tags
  content = content.replace(
    /<style[\s\S]*?<\/style>/gi,
    "<!-- Style removed during migration -->",
  );
  // Convert email autolinks <email@domain.com> to markdown links
  content = content.replace(/<([^@>]+@[^>]+)>/g, "[$1](mailto:$1)");
  return content;
}

function convertKramdownAttributes(content) {
  // Convert {:.classname} to HTML class syntax
  // These are typically on the line before the element
  content = content.replace(/\{:\s*\.(\w+)\s*\}/g, "<!-- class: $1 -->");

  // Convert {: #id} syntax
  content = content.replace(/\{:\s*#(\w+)\s*\}/g, "<!-- id: $1 -->");

  // Remove other kramdown attribute syntax like {:style="..."} or {:target="..."}
  content = content.replace(/\{:[^}]+\}/g, "");

  return content;
}

// Skip files that need special handling (HTML files)
const skipList = ["selection-wheel.html"];

// Process each talk
if (!fs.existsSync(talksSourceDir)) {
  console.error("_talks directory not found");
  process.exit(1);
}

const files = fs
  .readdirSync(talksSourceDir)
  .filter((f) => f.endsWith(".md") && !skipList.includes(f));

let count = 0;

for (const filename of files) {
  const filepath = path.join(talksSourceDir, filename);
  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { data: fm, content } = matter(fileContent);

  // Skip hidden talks
  if (fm.hidden) {
    console.log(`Skipping hidden talk: ${filename}`);
    continue;
  }

  const slug = filename.replace(/\.md$/, "");
  console.log(`Processing: ${filename}`);

  // Convert Jekyll syntax to VitePress/Vue
  let processedContent = content;
  processedContent = convertJekyllIncludes(processedContent);
  processedContent = convertJekyllLinks(processedContent);
  processedContent = convertFontAwesome(processedContent);
  processedContent = removeJekyllSpecificTags(processedContent);
  processedContent = convertKramdownAttributes(processedContent);

  // Close SlideImpact tags that were opened (they expect slot content after)
  // This is tricky - SlideImpact opens a section that needs to be closed
  // For now, we'll handle this by making SlideImpact self-closing and
  // the content after it becomes a regular slide

  // Build frontmatter
  const title = fm.title || slug;
  const escapedTitle = title.replace(/"/g, '\\"');
  const author = fm.author || "Ben Swift";

  let frontmatterLines = [
    "---",
    `title: "${escapedTitle}"`,
    "layout: reveal",
    `author: "${author}"`,
  ];

  if (fm.date) {
    const dateStr =
      typeof fm.date === "string" ? fm.date : fm.date.toISOString();
    frontmatterLines.push(`date: "${dateStr}"`);
  }

  if (fm.subtitle) {
    frontmatterLines.push(`subtitle: "${fm.subtitle.replace(/"/g, '\\"')}"`);
  }

  if (fm.event) {
    frontmatterLines.push(`event: "${fm.event.replace(/"/g, '\\"')}"`);
  }

  frontmatterLines.push("---");

  const pageContent = frontmatterLines.join("\n") + "\n\n" + processedContent;

  // Write to talks/slug.md
  const outputPath = path.join(talksOutputDir, `${slug}.md`);
  fs.writeFileSync(outputPath, pageContent);
  count++;
}

console.log(`Generated ${count} talk pages`);
