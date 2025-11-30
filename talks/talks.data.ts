import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Talk {
  title: string;
  url: string;
  date: string;
  dateFormatted: string;
  event?: string;
  slug: string;
}

declare const data: Talk[];
export { data };

export default {
  load(): Talk[] {
    // Read from Jekyll _talks directory
    const talksDir = path.resolve(__dirname, "../_talks");
    if (!fs.existsSync(talksDir)) {
      console.warn("_talks directory not found");
      return [];
    }
    const files = fs.readdirSync(talksDir).filter((f) => f.endsWith(".md"));

    return files
      .map((filename) => {
        const filepath = path.join(talksDir, filename);
        const fileContent = fs.readFileSync(filepath, "utf-8");
        const { data: fm } = matter(fileContent);

        const slug = filename.replace(".md", "");
        const dateStr = fm.date
          ? typeof fm.date === "string"
            ? fm.date
            : fm.date.toISOString().split("T")[0]
          : "2000-01-01";
        const date = new Date(dateStr);

        return {
          title: fm.title || slug,
          url: `/talks/${slug}`,
          date: dateStr,
          dateFormatted: date.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          event: fm.event,
          slug,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  },
};
