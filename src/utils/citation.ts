export function generateCiteKey(year: string, slug: string): string {
  const camel = slug
    .split("-")
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join("");
  return `swift${year}${camel}`;
}

export function generateBibtex(opts: {
  citeKey: string;
  author: string;
  title: string;
  url: string;
  year: string;
  month: string;
  atUri?: string;
}): string {
  const lines = [
    `@online{${opts.citeKey},`,
    `  author = {${opts.author}},`,
    `  title = {${opts.title}},`,
    `  url = {${opts.url}},`,
    `  year = {${opts.year}},`,
    `  month = {${opts.month}},`,
  ];

  if (opts.atUri) {
    lines.push(`  note = {AT-URI: ${opts.atUri}},`);
  }

  lines.push("}");
  return lines.join("\n");
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Leon Volbers" -> "Volbers, Leon"; leaves already-comma'd or mononym names alone. */
function bibtexName(name: string): string {
  if (name.includes(",")) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const family = parts.pop();
  return `${family}, ${parts.join(" ")}`;
}

/** Escape the BibTeX special characters that show up in titles/venues. */
function bibtexEscape(s: string): string {
  return s.replace(/([&%#_$])/g, "\\$1");
}

export interface GigCitation {
  title: string;
  /** DataCite DOI, e.g. "10.5281/zenodo.20743708". */
  doi: string;
  /** ISO date "YYYY-MM-DD". */
  date: string;
  event?: string;
  venue?: string;
  artists?: { name: string; orcid?: string }[];
}

/**
 * A BibTeX entry for a live-coding performance with a Zenodo DOI. Uses @misc
 * (the entry type Zenodo itself exports), the performance context in
 * howpublished, and ORCIDs in a note since BibTeX has no ORCID field. The cite
 * key mirrors Zenodo's own `swift_<year>_<recid>`.
 */
export function gigToBibtex(gig: GigCitation): string {
  const year = gig.date.slice(0, 4);
  const month = MONTHS[Number(gig.date.slice(5, 7)) - 1] ?? "";
  const recid = gig.doi.match(/zenodo\.(\d+)$/)?.[1] ?? gig.doi.replace(/\W+/g, "");
  const creators = [{ name: "Ben Swift", orcid: "0000-0003-2138-5969" }, ...(gig.artists ?? [])];
  const author = creators.map((c) => bibtexName(c.name)).join(" and ");
  const context = ["Live-coding performance", gig.event, gig.venue].filter(Boolean).join(", ");
  const orcids = creators
    .filter((c) => c.orcid)
    .map((c) => `${bibtexName(c.name)} (${c.orcid})`)
    .join("; ");

  const lines = [
    `@misc{swift_${year}_${recid},`,
    `  author       = {${author}},`,
    `  title        = {{${bibtexEscape(gig.title)}}},`,
    `  year         = {${year}},`,
  ];
  if (month) lines.push(`  month        = {${month}},`);
  lines.push(
    `  howpublished = {${bibtexEscape(context)}},`,
    `  publisher    = {Zenodo},`,
    `  doi          = {${gig.doi}},`,
    `  url          = {https://doi.org/${gig.doi}},`,
  );
  if (orcids) lines.push(`  note         = {ORCID: ${orcids}},`);
  lines.push("}");
  return lines.join("\n");
}
