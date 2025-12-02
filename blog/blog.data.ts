import { createContentLoader } from "vitepress";

function stripHtml(html: string): string {
  return html
    .replace(/<h1[^>]*>.*?<\/h1>/gi, "") // Remove h1 (title is in frontmatter)
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/&\w+;/g, " ") // Remove named HTML entities (nbsp, ZeroWidthSpace, etc.)
    .replace(/&#\d+;/g, "") // Remove numeric HTML entities
    .replace(/&#x[\da-fA-F]+;/g, "") // Remove hex HTML entities
    .replace(/\s+/g, " ") // Collapse whitespace
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
  excerpt: true,
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
          excerpt: stripHtml(page.excerpt || "").slice(0, 150),
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
