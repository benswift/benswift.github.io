import fs from "fs";
import path from "path";
import bibtexParse from "bibtex-parse";

const preprintsDir = path.resolve(
  __dirname,
  "../../public/assets/documents/preprints",
);

function syncPreprint(filePath: string | undefined): void {
  if (!filePath) return;

  const filename = path.basename(filePath);
  const destPath = path.join(preprintsDir, filename);

  if (fs.existsSync(destPath)) return;

  if (!fs.existsSync(filePath)) {
    console.warn(`Missing preprint source: ${filePath}`);
    return;
  }

  fs.mkdirSync(preprintsDir, { recursive: true });
  fs.copyFileSync(filePath, destPath);
  console.log(`Copied preprint: ${filename}`);
}

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
  pdfPath?: string;
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
          // bibtex-parse returns field names in UPPERCASE
          const title = entry.TITLE || entry.title;
          const author = entry.AUTHOR || entry.author;
          const date = entry.DATE || entry.date;
          const yearField = entry.YEAR || entry.year;
          const booktitle = entry.BOOKTITLE || entry.booktitle;
          const journal = entry.JOURNAL || entry.journal;
          const publisher = entry.PUBLISHER || entry.publisher;
          const doi = entry.DOI || entry.doi;
          const url = entry.URL || entry.url;
          const abstract = entry.ABSTRACT || entry.abstract;
          const file = entry.FILE || entry.file;

          syncPreprint(file);

          // Get the year from date field or year field
          let year = "Unknown";
          if (date) {
            const match = date.match(/^(\d{4})/);
            if (match) year = match[1];
          } else if (yearField) {
            year = yearField;
          }

          // Determine venue based on entry type
          let venue = "";
          if (booktitle) {
            venue = booktitle;
          } else if (journal) {
            venue = journal;
          } else if (publisher) {
            venue = publisher;
          }

          const pdfPath = file
            ? `/assets/documents/preprints/${path.basename(file)}`
            : undefined;

          return {
            key: entry.key,
            type: entry.type,
            title: title?.replace(/[{}]/g, "") || "Untitled",
            authors: author?.replace(/[{}]/g, "") || "Unknown",
            year,
            venue: venue?.replace(/[{}]/g, ""),
            doi,
            url,
            abstract: abstract?.replace(/[{}]/g, ""),
            pdfPath,
          };
        })
        .sort((a: Publication, b: Publication) => b.year.localeCompare(a.year));
    } catch (e) {
      console.error("Error parsing BibTeX:", e);
      return [];
    }
  },
};
