import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const TALKS_DIR = path.resolve(import.meta.dirname, "../talks");
const DECKS_DIR = path.resolve(import.meta.dirname, "../src/decks");

const SKIP_FILES = new Set([
  "chi-12.md",
  "chi-14.md",
  "live-13.md",
  "ozchi-07.md",
  "ozchi-10.md",
  "viscotheque.md",
  "yunda-16.md",
  "acmc-09.md",
  "scf-15.md",
  "dsi-2015.md",
  "livecoding-in-20mins.md",
  "futureschools-2020.md",
]);

function convertFrontmatter(data: Record<string, unknown>): string {
  const title = data.title as string;
  const event = data.event as string | undefined;
  const description = event
    ? `A slide deck presented at ${event}`
    : `A slide deck by ${(data.author as string) || "Ben Swift"}`;

  const lines = ["---"];
  lines.push(`title: ${JSON.stringify(title)}`);
  lines.push(`description: ${JSON.stringify(description)}`);
  lines.push("---");
  return lines.join("\n");
}

function generateTitleSlide(data: Record<string, unknown>): string {
  const title = data.title as string;
  const subtitle = (data.subtitle as string) || (data.event as string) || "";
  const lines = [`# ${title}`];
  if (subtitle) {
    lines.push("");
    lines.push(`## ${subtitle}`);
  }
  return lines.join("\n");
}

function normaliseImagePath(imagePath: string): string {
  if (imagePath.startsWith("/")) return imagePath;
  return `/assets/${imagePath}`;
}

function convertSlideBackgroundImage(image: string, heading?: string): string {
  const normPath = normaliseImagePath(image);
  const lines: string[] = [];
  lines.push(`![bg](${normPath})`);
  if (heading) {
    lines.push("");
    lines.push(`## ${heading}`);
  }
  return lines.join("\n");
}

function convertSlideYouTube(id: string): string {
  return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
}

function convertSlideQuestions(): string {
  return `<!-- _class: centered -->\n\n## questions?`;
}

function convertSlideAckCountry(): string {
  return `<!-- _class: centered -->\n\nI'd like to acknowledge and celebrate the First Australians on whose traditional lands we meet, and pay respect to the elders past and present.`;
}

function convertSlideFin(): string {
  return `<!-- _class: impact -->\n\n**fin**`;
}

function convertSlideImageCredit(attrs: string): string {
  const artistMatch = attrs.match(/artist="([^"]*)"/);
  const titleMatch = attrs.match(/title="([^"]*)"/);
  const yearMatch = attrs.match(/year="([^"]*)"/);
  const parts: string[] = [];
  if (artistMatch) parts.push(artistMatch[1]);
  if (titleMatch) parts.push(titleMatch[1]);
  if (yearMatch) parts.push(yearMatch[1]);
  return `<div class="image-credit">${parts.join(", ")}</div>`;
}

function extractAttr(tag: string, attrName: string): string | undefined {
  const re = new RegExp(`${attrName}="([^"]*)"`, "s");
  const m = tag.match(re);
  return m ? m[1] : undefined;
}

function processContent(content: string, data: Record<string, unknown>): string {
  let lines = content.split("\n");

  // Slides are collected as arrays of lines; each sub-array is one slide
  const slides: string[][] = [];
  let pendingClass: string | null = null;

  function startNewSlide() {
    slides.push([]);
  }

  function currentSlide(): string[] {
    if (slides.length === 0) startNewSlide();
    return slides.at(-1)!;
  }

  function addToSlide(text: string) {
    currentSlide().push(text);
  }

  function newSlideWith(text: string) {
    startNewSlide();
    if (pendingClass) {
      currentSlide().push(pendingClass);
      pendingClass = null;
    }
    currentSlide().push(text);
  }

  function newSlideWithClass(cls: string) {
    startNewSlide();
    pendingClass = cls;
  }

  // Join lines back for regex processing
  let body = lines.join("\n");

  // Fix broken [SlideBackgroundImage ... /](mailto:...) patterns
  // These span multiple lines, so handle them with a multiline regex
  body = body.replaceAll(
    /\[SlideBackgroundImage\s+image="([^"]*)"\s+heading="([^"]*)"[^]*?\]\([^)]*\)/g,
    (_, image, heading) => `<SlideBackgroundImage image="${image}" heading="${heading}" />`,
  );
  body = body.replaceAll(
    /\[SlideBackgroundImage\s+image="([^"]*)"[^]*?\]\([^)]*\)/g,
    (_, image) => `<SlideBackgroundImage image="${image}" />`,
  );

  // Remove <!-- class: fragment --> lines (and surrounding blank lines)
  body = body.replaceAll(/\n*<!-- class: fragment -->\n*/g, "\n\n");

  // Remove <!-- Liquid expression removed --> lines
  body = body.replaceAll("<<!-- Liquid expression removed -->>", "");

  // Process line by line now
  lines = body.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines when current slide is empty
    if (trimmed === "" && (slides.length === 0 || currentSlide().length === 0)) {
      i++;
      continue;
    }

    // <SlideTitle />
    if (trimmed === "<SlideTitle />") {
      newSlideWith(generateTitleSlide(data));
      i++;
      continue;
    }

    // <SlideQuestions />
    if (trimmed === "<SlideQuestions />") {
      startNewSlide();
      addToSlide(convertSlideQuestions());
      i++;
      continue;
    }

    // <SlideAckCountry />
    if (trimmed === "<SlideAckCountry />") {
      startNewSlide();
      addToSlide(convertSlideAckCountry());
      i++;
      continue;
    }

    // <SlideFin />
    if (trimmed === "<SlideFin />") {
      startNewSlide();
      addToSlide(convertSlideFin());
      i++;
      continue;
    }

    // <SlideYouTube id="..." />
    const youtubeMatch = trimmed.match(/^<SlideYouTube\s+id="([^"]*)"\s*\/>$/);
    if (youtubeMatch) {
      newSlideWith(convertSlideYouTube(youtubeMatch[1]));
      i++;
      continue;
    }

    // <SlideBackgroundImage ... />
    const bgImgMatch = trimmed.match(/^<SlideBackgroundImage\s+(.+?)\s*\/>$/);
    if (bgImgMatch) {
      const attrs = bgImgMatch[1];
      const image = extractAttr(attrs, "image");
      const heading = extractAttr(attrs, "heading");
      if (image) {
        newSlideWith(convertSlideBackgroundImage(image, heading));
      }
      i++;
      continue;
    }

    // <SlideImageCredit ... /> (not commented out)
    const imgCreditMatch = trimmed.match(/^<SlideImageCredit\s*(.*?)\s*\/>$/);
    if (imgCreditMatch && !trimmed.startsWith("<!--")) {
      const attrs = imgCreditMatch[1];
      if (attrs.trim()) {
        addToSlide(convertSlideImageCredit(attrs));
      }
      i++;
      continue;
    }

    // <SlideStackedPapers ... />
    if (trimmed.match(/^<SlideStackedPapers\s/)) {
      addToSlide("<!-- TODO: SlideStackedPapers not auto-converted -->");
      i++;
      continue;
    }

    // <hr class="impact center" data-background-color="..." />
    const impactHrMatch = trimmed.match(
      /^<hr\s+class="impact center"\s*(?:data-background-color="[^"]*")?\s*\/?>$/,
    );
    if (impactHrMatch) {
      newSlideWithClass("<!-- _class: impact -->");
      i++;
      continue;
    }

    // <hr class="center"> or <hr class="center"/>
    const centerHrMatch = trimmed.match(/^<hr\s+class="center"\s*\/?>$/);
    if (centerHrMatch) {
      newSlideWithClass("<!-- _class: centered -->");
      i++;
      continue;
    }

    // --- thematic break (explicit slide separator)
    if (trimmed === "---") {
      startNewSlide();
      i++;
      continue;
    }

    // ## heading implies new slide
    if (trimmed.startsWith("## ")) {
      newSlideWith(line);
      i++;
      continue;
    }

    // <h2 ...> heading tags imply new slide
    if (trimmed.match(/^<h2[\s>]/i)) {
      newSlideWith(line);
      i++;
      continue;
    }

    // <section ...> tags: pass through
    if (trimmed.match(/^<section[\s>]/i) || trimmed.match(/^<\/section>/i)) {
      addToSlide(line);
      i++;
      continue;
    }

    // Regular content line
    if (pendingClass && trimmed !== "") {
      addToSlide(pendingClass);
      pendingClass = null;
    }
    addToSlide(line);
    i++;
  }

  // If there's a dangling pending class, flush it
  if (pendingClass) {
    addToSlide(pendingClass);
    pendingClass = null;
  }

  // Build final output from slides, skipping empty ones
  const result: string[] = [];
  for (const slide of slides) {
    const slideContent = slide.join("\n").trim();
    if (!slideContent) continue;
    if (result.length > 0) {
      result.push("---");
    }
    result.push(slideContent);
  }

  // Trim trailing whitespace from each line
  return result
    .join("\n\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");
}

function convertFile(inputPath: string): string | null {
  const raw = fs.readFileSync(inputPath, "utf8");
  const { data, content } = matter(raw);

  if (data.layout !== "reveal") return null;

  const frontmatter = convertFrontmatter(data);
  const body = processContent(content, data);

  return `${frontmatter}\n\n${body}\n`;
}

function main() {
  if (!fs.existsSync(DECKS_DIR)) {
    fs.mkdirSync(DECKS_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(TALKS_DIR)
    .filter((f) => f.endsWith(".md"))
    .toSorted();

  const converted: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (SKIP_FILES.has(file)) {
      skipped.push(file);
      continue;
    }

    const inputPath = path.join(TALKS_DIR, file);

    try {
      const result = convertFile(inputPath);
      if (result === null) {
        skipped.push(file);
        continue;
      }

      const outName = file.replace(/\.md$/, ".deck.md");
      const outPath = path.join(DECKS_DIR, outName);
      fs.writeFileSync(outPath, result, "utf8");
      converted.push(`${file} -> ${outName}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`${file}: ${msg}`);
    }
  }

  console.log("\n=== Convert Talks Summary ===\n");
  console.log(`Converted: ${converted.length}`);
  for (const c of converted) console.log(`  ✓ ${c}`);

  if (skipped.length > 0) {
    console.log(`\nSkipped: ${skipped.length}`);
    for (const s of skipped) console.log(`  - ${s}`);
  }

  if (errors.length > 0) {
    console.log(`\nErrors: ${errors.length}`);
    for (const e of errors) console.log(`  ✗ ${e}`);
    process.exit(1);
  }

  console.log("\nDone.");
}

main();
