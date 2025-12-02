import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

function getAllBlogPosts(dir: string, posts: Post[] = []): Post[] {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectories (year/month/day structure)
      // Skip 'tag' directory
      if (item !== "tag") {
        getAllBlogPosts(fullPath, posts);
      }
    } else if (item.endsWith(".md") && item !== "index.md") {
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const { data: fm, content } = matter(fileContent);

      // Extract date from path: blog/YYYY/MM/DD/slug.md
      const relativePath = path.relative(path.resolve(__dirname), fullPath);
      const pathMatch = relativePath.match(
        /(\d{4})\/(\d{2})\/(\d{2})\/(.+)\.md$/,
      );

      if (pathMatch) {
        // Skip unpublished posts
        if (fm.published === false) {
          continue;
        }

        const [, year, month, day, slug] = pathMatch;
        const dateStr = `${year}-${month}-${day}`;
        const date = new Date(dateStr);

        // Parse tags
        let tags: string[] = [];
        if (fm.tags) {
          if (Array.isArray(fm.tags)) {
            tags = fm.tags;
          } else if (typeof fm.tags === "string") {
            tags = fm.tags.split(/\s+/).filter(Boolean);
          }
        }

        // Generate excerpt from content (first ~150 chars of text, no markdown)
        const textContent = content
          .replace(/^#.*$/gm, "") // Remove headings
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
          .replace(/[*_`]/g, "") // Remove formatting
          .replace(/<[^>]+>/g, "") // Remove HTML tags
          .replace(/\n+/g, " ") // Collapse newlines
          .trim();
        const excerpt = textContent.slice(0, 150);

        posts.push({
          title: fm.title || slug,
          url: `/blog/${year}/${month}/${day}/${slug}`,
          date: {
            raw: dateStr,
            formatted: date.toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }),
          },
          tags,
          excerpt,
        });
      }
    }
  }

  return posts;
}

export default {
  watch: ["./blog/**/*.md"],
  load(): Post[] {
    const blogDir = path.resolve(__dirname);
    const posts = getAllBlogPosts(blogDir);

    // Sort by date descending (newest first)
    posts.sort(
      (a, b) => new Date(b.date.raw).getTime() - new Date(a.date.raw).getTime(),
    );

    return posts;
  },
};

declare const data: Post[];
export { data };
