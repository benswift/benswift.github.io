import fs from "fs";
import path from "path";
import bibtexParse from "bibtex-parse";

export interface Publication {
  key: string;
  type: string;
  title: string;
  authors: string;
  year: string;
  venue?: string;
  doi?: string;
  url?: string;
  abstract?: string;
}

declare const data: Publication[];
export { data };

export default {
  load(): Publication[] {
    const bibFile = path.resolve(__dirname, "../../_data/ben-pubs.bib");

    if (!fs.existsSync(bibFile)) {
      console.warn("ben-pubs.bib not found");
      return [];
    }

    const bibContent = fs.readFileSync(bibFile, "utf-8");

    try {
      const entries = bibtexParse.entries(bibContent);

      return entries
        .map((entry: any) => {
          // Get the year from date field or year field
          let year = "Unknown";
          if (entry.date) {
            const match = entry.date.match(/^(\d{4})/);
            if (match) year = match[1];
          } else if (entry.year) {
            year = entry.year;
          }

          // Determine venue based on entry type
          let venue = "";
          if (entry.booktitle) {
            venue = entry.booktitle;
          } else if (entry.journal) {
            venue = entry.journal;
          } else if (entry.publisher) {
            venue = entry.publisher;
          }

          return {
            key: entry.key,
            type: entry.type,
            title: entry.title?.replace(/[{}]/g, "") || "Untitled",
            authors: entry.author?.replace(/[{}]/g, "") || "Unknown",
            year,
            venue: venue?.replace(/[{}]/g, ""),
            doi: entry.doi,
            url: entry.url,
            abstract: entry.abstract?.replace(/[{}]/g, ""),
          };
        })
        .sort((a: Publication, b: Publication) => b.year.localeCompare(a.year));
    } catch (e) {
      console.error("Error parsing BibTeX:", e);
      return [];
    }
  },
};
