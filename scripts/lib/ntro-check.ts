// Pure comparison of an NTRO record in this repo (src/content/ntro/*.md)
// against the `ntro:` block in a cybernetics-website _projects/*.md page.
// Used by scripts/check-ntro.ts.

export interface RemoteNtro {
  key: string;
  title: string;
  authors: string[];
  year: number;
  doi: string;
  license?: string;
  category: string;
  designation: string;
  for_codes: { code: string; name?: string; weight: number }[];
}

/** The slice of a local `ntro` record the comparison reads. */
export interface LocalNtro {
  key: string;
  title: string;
  authors: { name: string }[];
  year: number;
  doi: string;
  license?: string;
  category: string;
  designation: string;
  for_codes: { code: string; weight: number }[];
}

const forCodes = (codes: { code: string; weight: number }[]) =>
  codes.map((c) => `${c.code}:${c.weight}`).join(", ");

/** Human-readable differences (empty when the two agree). Authors compare in order. */
export function compareNtro(local: LocalNtro, remote: RemoteNtro): string[] {
  const fields: [string, string, string][] = [
    ["title", local.title, remote.title],
    ["doi", local.doi, remote.doi],
    ["authors", local.authors.map((a) => a.name).join("; "), remote.authors.join("; ")],
    ["year", String(local.year), String(remote.year)],
    ["category", local.category, remote.category],
    ["designation", local.designation, remote.designation],
    ["license", local.license ?? "", remote.license ?? ""],
    ["for_codes", forCodes(local.for_codes), forCodes(remote.for_codes ?? [])],
  ];
  return fields
    .filter(([, a, b]) => a !== b)
    .map(([name, a, b]) => `${name}: this repo "${a}" vs cybernetics-website "${b}"`);
}
