declare module "bibtex-parse" {
  interface BibEntry {
    key: string;
    type: string;
    title?: string;
    author?: string;
    date?: string;
    year?: string;
    booktitle?: string;
    journal?: string;
    publisher?: string;
    doi?: string;
    url?: string;
    abstract?: string;
    [key: string]: string | undefined;
  }

  export function entries(bibtex: string): BibEntry[];
}
