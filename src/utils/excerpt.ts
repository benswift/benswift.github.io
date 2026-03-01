/**
 * Extract a plain text excerpt from markdown content.
 * Removes frontmatter, markdown syntax, and returns the first paragraph.
 */
export function extractExcerpt(src: string, maxLength = 450): string {
  // Remove frontmatter
  const withoutFrontmatter = src.replace(/^---[\s\S]*?---\s*/, "");

  // Split into lines and process
  const lines = withoutFrontmatter.split("\n");
  const paragraphs: string[] = [];
  let currentPara = "";
  let inCodeBlock = false;
  let inContainer = false;

  for (const line of lines) {
    // Track code blocks
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Track custom containers (:::)
    if (line.startsWith(":::")) {
      inContainer = !inContainer || line.trim() === ":::";
      continue;
    }
    if (inContainer) continue;

    // Skip headings, images, blockquotes, list items, HTML
    if (/^#+\s/.test(line)) continue;
    if (line.startsWith("![")) continue;
    if (/^>\s/.test(line)) continue;
    if (/^[-*]\s/.test(line)) continue;
    if (line.startsWith("<")) continue;

    const trimmed = line.trim();
    if (trimmed === "") {
      if (currentPara) {
        paragraphs.push(currentPara);
        currentPara = "";
      }
    } else {
      currentPara += (currentPara ? " " : "") + trimmed;
    }
  }
  if (currentPara) paragraphs.push(currentPara);

  // Get first paragraph and clean markdown syntax
  const first = paragraphs[0] || "";
  const cleaned = first
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replaceAll(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
    .replaceAll(/\*([^*]+)\*/g, "$1") // *italic* -> italic
    .replaceAll(/_([^_]+)_/g, "$1") // _italic_ -> italic
    .replaceAll(/`([^`]+)`/g, "$1") // `code` -> code
    .replaceAll(/\[([^\]]+)\]\[[^\]]*\]/g, "$1") // [text][ref] -> text
    .replaceAll(/\[\^[^\]]+\]/g, "") // footnote references
    .replaceAll(/\s+/g, " ")
    .trim();

  return cleaned.slice(0, maxLength);
}

/**
 * Extract a description from markdown content for meta tags.
 * Similar to extractExcerpt but with truncation and ellipsis.
 */
export function extractDescription(content: string, maxLength = 160): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/, "");

  // Remove common markdown/vue elements that shouldn't be in descriptions
  const cleaned = withoutFrontmatter
    // Remove script/style blocks entirely (content + tags)
    .replaceAll(/<script[\s\S]*?<\/script>/gi, "")
    .replaceAll(/<style[\s\S]*?<\/style>/gi, "")
    // Remove HTML/Vue components
    .replaceAll(/<[^>]+>/g, "")
    // Remove markdown images
    .replaceAll(/!\[[^\]]*\]\([^)]*\)/g, "")
    // Remove markdown links but keep text
    .replaceAll(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Remove footnote references
    .replaceAll(/\[\^[^\]]+\]/g, "")
    // Remove headers
    .replaceAll(/^#{1,6}\s+.*$/gm, "")
    // Remove code blocks
    .replaceAll(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replaceAll(/`[^`]+`/g, "")
    // Remove blockquotes marker
    .replaceAll(/^>\s*/gm, "")
    // Remove custom containers (info, tip, warning, etc.)
    .replaceAll(/^:::\s*\w+\s*$/gm, "")
    .replaceAll(/^:::\s*$/gm, "")
    // Remove bold/italic markers
    .replaceAll(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replaceAll(/_{1,2}([^_]+)_{1,2}/g, "$1")
    // Normalise whitespace
    .replaceAll(/\s+/g, " ")
    .trim();

  // Get first meaningful chunk of text
  const firstParagraph = cleaned.split(/\n\n/)[0] || cleaned;

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  // Truncate at word boundary
  const truncated = firstParagraph.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}
