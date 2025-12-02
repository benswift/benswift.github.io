import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface TagPageData {
  params: {
    tag: string;
  };
}

function parseTags(frontmatter: { tags?: string | string[] }): string[] {
  if (!frontmatter.tags) return [];
  if (Array.isArray(frontmatter.tags)) return frontmatter.tags;
  if (typeof frontmatter.tags === "string") {
    return frontmatter.tags.split(/\s+/).filter(Boolean);
  }
  return [];
}

function collectTagsFromDir(dir: string, allTags: Set<string>): void {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item !== "tag") {
        collectTagsFromDir(fullPath, allTags);
      }
    } else if (item.endsWith(".md") && item !== "index.md") {
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const { data: fm } = matter(fileContent);
      parseTags(fm).forEach((tag) => allTags.add(tag));
    }
  }
}

export default {
  paths(): TagPageData[] {
    const blogDir = path.resolve(__dirname, "..");

    if (!fs.existsSync(blogDir)) {
      console.warn("blog directory not found");
      return [];
    }

    const allTags = new Set<string>();
    collectTagsFromDir(blogDir, allTags);

    return Array.from(allTags).map((tag) => ({
      params: { tag },
    }));
  },
};
