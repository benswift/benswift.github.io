import { createContentLoader } from "vitepress";

function extractExcerpt(src: string): string {
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
    if (/^!\[/.test(line)) continue;
    if (/^>\s/.test(line)) continue;
    if (/^[-*]\s/.test(line)) continue;
    if (/^</.test(line)) continue;

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
  return first
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
    .replace(/\*([^*]+)\*/g, "$1") // *italic* -> italic
    .replace(/_([^_]+)_/g, "$1") // _italic_ -> italic
    .replace(/`([^`]+)`/g, "$1") // `code` -> code
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1") // [text][ref] -> text
    .replace(/\s+/g, " ")
    .trim();
}

interface Post {
  title: string;
  url: string;
  date: {
    raw: string;
    formatted: string;
  };
  tags: string[];
  excerpt: string;
}

interface BlogData {
  posts: Post[];
  tags: string[];
}

export default createContentLoader("blog/**/*.md", {
  includeSrc: true,
  transform(rawData): BlogData {
    const posts = rawData
      .filter((page) => {
        // Exclude index.md and tag pages
        if (page.url === "/blog/" || page.url.startsWith("/blog/tag/")) {
          return false;
        }
        // Exclude unpublished posts
        if (page.frontmatter.published === false) {
          return false;
        }
        // Must match date pattern in URL
        return /\/blog\/\d{4}\/\d{2}\/\d{2}\//.test(page.url);
      })
      .map((page) => {
        // Extract date from URL: /blog/YYYY/MM/DD/slug
        const match = page.url.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//);
        const [, year, month, day] = match!;
        const dateStr = `${year}-${month}-${day}`;
        const date = new Date(dateStr);

        // Parse tags from frontmatter
        let tags: string[] = [];
        if (page.frontmatter.tags) {
          if (Array.isArray(page.frontmatter.tags)) {
            tags = page.frontmatter.tags;
          } else if (typeof page.frontmatter.tags === "string") {
            tags = page.frontmatter.tags.split(/\s+/).filter(Boolean);
          }
        }

        return {
          title: page.frontmatter.title || page.url.split("/").pop() || "",
          url: page.url,
          date: {
            raw: dateStr,
            formatted: date.toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }),
          },
          tags,
          excerpt: extractExcerpt(page.src || "").slice(0, 450),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.date.raw).getTime() - new Date(a.date.raw).getTime(),
      );

    // Collect all unique tags
    const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();

    return { posts, tags };
  },
});

declare const data: BlogData;
export { data };
