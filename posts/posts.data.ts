import { createContentLoader } from "vitepress";

export interface Post {
  title: string;
  url: string;
  date: {
    raw: string;
    formatted: string;
    year: string;
    month: string;
    day: string;
  };
  excerpt: string | undefined;
  tags: string[];
}

declare const data: Post[];
export { data };

export default createContentLoader("posts/*.md", {
  excerpt: true,
  transform(rawData): Post[] {
    return rawData
      .map(({ url, frontmatter, excerpt }) => {
        // Extract date from filename: posts/YYYY-MM-DD-slug.md
        const filename = url.split("/").pop()?.replace(".html", "") || "";
        const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);

        if (!dateMatch) {
          console.warn(`Could not parse date from: ${url}`);
          return null;
        }

        const [, year, month, day, slug] = dateMatch;
        const dateStr = `${year}-${month}-${day}`;
        const date = new Date(dateStr);

        // Parse tags - handle both array and space-separated string formats
        let tags: string[] = [];
        if (frontmatter.tags) {
          if (Array.isArray(frontmatter.tags)) {
            tags = frontmatter.tags;
          } else if (typeof frontmatter.tags === "string") {
            tags = frontmatter.tags.split(/\s+/).filter(Boolean);
          }
        }

        return {
          title: frontmatter.title || slug,
          // Transform URL to match Jekyll pattern: /blog/YYYY/MM/DD/slug/
          url: `/blog/${year}/${month}/${day}/${slug}`,
          date: {
            raw: dateStr,
            formatted: date.toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }),
            year,
            month,
            day,
          },
          excerpt: excerpt?.replace(/<[^>]*>/g, "").slice(0, 200),
          tags,
        };
      })
      .filter((post): post is Post => post !== null)
      .sort((a, b) => b.date.raw.localeCompare(a.date.raw));
  },
});
