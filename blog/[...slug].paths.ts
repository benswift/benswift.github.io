import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface PostData {
  params: {
    slug: string;
  };
  frontmatter: {
    title: string;
    date: string;
    dateFormatted: string;
    tags: string[];
    subtitle?: string;
    layout: string;
  };
  content: string;
}

export default {
  paths(): PostData[] {
    const postsDir = path.resolve(__dirname, "../posts");

    if (!fs.existsSync(postsDir)) {
      console.warn("posts directory not found");
      return [];
    }

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

    return files
      .map((filename) => {
        const filepath = path.join(postsDir, filename);
        const fileContent = fs.readFileSync(filepath, "utf-8");
        const { data: fm, content } = matter(fileContent);

        // Parse filename: YYYY-MM-DD-slug.md
        const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
        if (!match) {
          console.warn(`Could not parse filename: ${filename}`);
          return null;
        }

        const [, year, month, day, slug] = match;
        const dateStr = `${year}-${month}-${day}`;
        const date = new Date(dateStr);

        // Parse tags - handle both array and space-separated string formats
        let tags: string[] = [];
        if (fm.tags) {
          if (Array.isArray(fm.tags)) {
            tags = fm.tags;
          } else if (typeof fm.tags === "string") {
            tags = fm.tags.split(/\s+/).filter(Boolean);
          }
        }

        return {
          params: {
            // This creates URL: /blog/YYYY/MM/DD/slug
            slug: `${year}/${month}/${day}/${slug}`,
          },
          frontmatter: {
            title: fm.title || slug,
            date: dateStr,
            dateFormatted: date.toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }),
            tags,
            subtitle: fm.subtitle,
            layout: "doc",
          },
          content,
        };
      })
      .filter((p): p is PostData => p !== null);
  },
};
