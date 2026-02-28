import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { formatDate } from "../.vitepress/utils/date";

export interface LivecodingGig {
  title: string;
  url: string;
  date: string;
  dateFormatted: string;
  venue?: string;
  type?: string;
  slug: string;
}

declare const data: LivecodingGig[];
export { data };

export default {
  load(): LivecodingGig[] {
    // Read from generated livecoding directory (not index.md)
    const livecodingDir = path.resolve(__dirname, ".");
    const files = fs
      .readdirSync(livecodingDir)
      .filter((f) => f.endsWith(".md") && f !== "index.md");

    return files
      .map((filename) => {
        const filepath = path.join(livecodingDir, filename);
        const fileContent = fs.readFileSync(filepath, "utf8");
        const { data: fm } = matter(fileContent);

        const slug = filename.replace(".md", "");

        // Parse date from filename or frontmatter
        let dateStr = "2000-01-01";
        const filenameMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
        if (filenameMatch) {
          dateStr = filenameMatch[1];
        } else if (fm.date) {
          dateStr =
            typeof fm.date === "string"
              ? fm.date
              : fm.date.toISOString().split("T")[0];
        }

        const date = new Date(dateStr);

        return {
          title: fm.title || slug,
          url: `/livecoding/${slug}`,
          date: dateStr,
          dateFormatted: formatDate(date),
          venue: fm.venue,
          type: fm.type,
          slug,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  },
};
