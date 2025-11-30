import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface TagPageData {
  params: {
    tag: string;
  };
}

export default {
  paths(): TagPageData[] {
    const postsDir = path.resolve(__dirname, "../../posts");

    if (!fs.existsSync(postsDir)) {
      console.warn("posts directory not found");
      return [];
    }

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
    const allTags = new Set<string>();

    files.forEach((filename) => {
      const filepath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filepath, "utf-8");
      const { data: fm } = matter(fileContent);

      // Parse tags - handle both array and space-separated string formats
      if (fm.tags) {
        if (Array.isArray(fm.tags)) {
          fm.tags.forEach((tag: string) => allTags.add(tag));
        } else if (typeof fm.tags === "string") {
          fm.tags
            .split(/\s+/)
            .filter(Boolean)
            .forEach((tag: string) => allTags.add(tag));
        }
      }
    });

    return Array.from(allTags).map((tag) => ({
      params: { tag },
    }));
  },
};
