import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

const mdxParser = unified().use(remarkParse).use(remarkMdx);

function stripMdxImportsExports(content: string): string {
  try {
    const tree = mdxParser.parse(content);
    const esmNodes = tree.children.filter((n) => n.type === "mdxjsEsm");
    if (esmNodes.length === 0) return content;
    return content.slice(esmNodes.at(-1)!.position!.end.offset);
  } catch {
    return content;
  }
}

/**
 * Extract a description from markdown content for meta tags.
 */
export function extractDescription(content: string, maxLength = 160): string {
  // Remove frontmatter and MDX imports/exports
  const withoutPreamble = stripMdxImportsExports(
    content.replace(/^---[\s\S]*?---\s*/, ""),
  );

  // Remove common markdown/vue elements that shouldn't be in descriptions
  const cleaned = withoutPreamble
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
