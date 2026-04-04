declare module "bibtex-parse" {
  interface BibTeXEntry {
    key: string;
    type: string;
    [field: string]: string | undefined;
  }

  function entries(input: string): BibTeXEntry[];

  export default { entries };
}
