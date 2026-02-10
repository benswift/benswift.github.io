import fs from "fs";
import path from "path";
import bibtexParse from "bibtex-parse";

const preprintsDir = path.resolve(
  __dirname,
  "../../public/assets/documents/preprints",
);

function syncPreprint(filePath: string | undefined): void {
  if (!filePath) return;

  const trimmed = filePath.trim();
  const filename = path.basename(trimmed);
  const destPath = path.join(preprintsDir, filename);

  if (fs.existsSync(destPath)) return;

  if (!fs.existsSync(trimmed)) {
    console.warn(`Missing preprint source: ${trimmed}`);
    return;
  }

  fs.mkdirSync(preprintsDir, { recursive: true });
  fs.copyFileSync(filePath, destPath);
  console.log(`Copied preprint: ${filename}`);
}

// BibTeX entry interface (bibtex-parse returns fields in both cases)
interface BibTeXEntry {
  key: string;
  type: string;
  // Fields can be uppercase or lowercase depending on the .bib file
  TITLE?: string;
  title?: string;
  AUTHOR?: string;
  author?: string;
  DATE?: string;
  date?: string;
  YEAR?: string;
  year?: string;
  BOOKTITLE?: string;
  booktitle?: string;
  JOURNAL?: string;
  journal?: string;
  PUBLISHER?: string;
  publisher?: string;
  DOI?: string;
  doi?: string;
  URL?: string;
  url?: string;
  ABSTRACT?: string;
  abstract?: string;
  FILE?: string;
  file?: string;
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

function getField(entry: BibTeXEntry, field: string): string | undefined {
  return (
    (entry[field.toUpperCase() as keyof BibTeXEntry] as string | undefined) ??
    (entry[field.toLowerCase() as keyof BibTeXEntry] as string | undefined)
  );
}

export default {
  load(): Publication[] {
    const bibFile = path.resolve(__dirname, "../../_data/ben-pubs.bib");

    if (!fs.existsSync(bibFile)) {
      console.warn("ben-pubs.bib not found");
      return [];
    }

    const bibContent = fs.readFileSync(bibFile, "utf-8");

    try {
      const entries = bibtexParse.entries(bibContent) as BibTeXEntry[];

      return entries
        .map((entry) => {
          const title = getField(entry, "title");
          const author = getField(entry, "author");
          const date = getField(entry, "date");
          const yearField = getField(entry, "year");
          const booktitle = getField(entry, "booktitle") ?? getField(entry, "eventtitle");
          const journal = getField(entry, "journal") ?? getField(entry, "journaltitle");
          const publisher = getField(entry, "publisher");
          const doi = getField(entry, "doi");
          const url = getField(entry, "url");
          const abstract = getField(entry, "abstract");
          const file = getField(entry, "file");

          syncPreprint(file);

          // Get the year from date field or year field
          let year = "Unknown";
          if (date) {
            const match = date.match(/^(\d{4})/);
            if (match) year = match[1];
          } else if (yearField) {
            year = String(yearField);
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
            ? `/assets/documents/preprints/${path.basename(file.trim())}`
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
