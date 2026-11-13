// Pure comparison of an NTRO record (src/content/ntro/*.md) with its Zenodo
// record, and the metadata edit that brings Zenodo into line. Used by
// scripts/ntro-zenodo.ts.

import { familyFirst } from "./zenodo";

/** The Zenodo fields this repo owns, in report order. */
export type ManagedField =
  | "title"
  | "creators"
  | "orcids"
  | "publication_date"
  | "license"
  | "upload_type"
  | "related_identifiers";

export interface ZenodoCreator {
  name: string;
  orcid?: string | null;
  affiliation?: string | null;
  [key: string]: unknown;
}

export interface ZenodoRelated {
  identifier: string;
  relation: string;
  resource_type?: string;
  scheme?: string;
}

/** The managed fields of a Zenodo record, in the legacy Deposit API's terms. */
export interface ZenodoMeta {
  title: string;
  creators: ZenodoCreator[];
  publication_date: string;
  license?: string;
  upload_type?: string;
  related_identifiers: ZenodoRelated[];
}

/** The slice of an `ntro` record the comparison reads. */
export interface NtroForZenodo {
  title: string;
  authors: { name: string; orcid?: string }[];
  publication_date: string;
  license?: string;
  upload_type: string;
  related_works: { relation: string; identifier?: string; url?: string; type?: string }[];
}

export interface ZenodoDiff {
  field: ManagedField;
  message: string;
}

/**
 * A comparable form of a person's name: "Swift, Ben" and "Ben Swift" both
 * become "ben swift". Lowercased, accents and full stops dropped, whitespace
 * collapsed.
 */
export function normaliseName(name: string): string {
  const comma = name.indexOf(",");
  const ordered = comma < 0 ? name : `${name.slice(comma + 1)} ${name.slice(0, comma)}`;
  return ordered
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replaceAll(".", " ")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** The Zenodo licence id for a licence as this repo spells it: "CC BY-SA 4.0" → "cc-by-sa-4.0", "MIT" → "mit". */
export function licenseId(license: string): string {
  return license.trim().toLowerCase().replace(/\s+/g, "-");
}

/** `id` without a doi.org or doi: prefix, case kept. */
const stripDoiPrefix = (id: string) =>
  id
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:/i, "");

/** A bare, lowercased DOI ("https://doi.org/10.1/X" → "10.1/x"), or undefined if `id` isn't one. */
export function normaliseDoi(id: string): string | undefined {
  const bare = stripDoiPrefix(id);
  return /^10\.\d{4,9}\/\S+$/.test(bare) ? bare.toLowerCase() : undefined;
}

/** The record's related works that are DOIs, with the DOI as written. */
function relatedDois(local: NtroForZenodo) {
  return local.related_works.flatMap((w) => {
    const id = w.identifier ?? w.url;
    return id && normaliseDoi(id) ? [{ ...w, identifier: id }] : [];
  });
}

/** Managed metadata from a published record (GET /api/records/<id>). */
export function fromRecord(record: any): ZenodoMeta {
  const m = record.metadata;
  return {
    title: m.title,
    creators: m.creators ?? [],
    publication_date: m.publication_date,
    license: m.license?.id,
    upload_type: m.resource_type?.type,
    related_identifiers: m.related_identifiers ?? [],
  };
}

/** Managed metadata from a deposition (GET /api/deposit/depositions/<id>). */
export function fromDeposition(deposition: any): ZenodoMeta {
  const m = deposition.metadata;
  return {
    title: m.title,
    creators: m.creators ?? [],
    publication_date: m.publication_date,
    license: typeof m.license === "string" ? m.license : m.license?.id,
    upload_type: m.upload_type,
    related_identifiers: m.related_identifiers ?? [],
  };
}

/**
 * Where Zenodo disagrees with the record (empty when they agree). Creators
 * compare in order by normalised name; an ORCID is checked only where the
 * record gives one; every related-work DOI must be among Zenodo's related
 * identifiers (other related identifiers on Zenodo are left alone).
 */
export function diffNtroZenodo(local: NtroForZenodo, remote: ZenodoMeta): ZenodoDiff[] {
  const diffs: ZenodoDiff[] = [];
  const differs = (field: ManagedField, mine: string, theirs: string | undefined) => {
    if (mine !== (theirs ?? ""))
      diffs.push({ field, message: `${field}: this repo "${mine}" vs Zenodo "${theirs ?? ""}"` });
  };

  differs("title", local.title, remote.title);

  const mine = local.authors.map((a) => normaliseName(a.name));
  const theirs = remote.creators.map((c) => normaliseName(c.name));
  if (mine.join("; ") !== theirs.join("; "))
    diffs.push({
      field: "creators",
      message: `creators: this repo "${local.authors.map((a) => a.name).join("; ")}" vs Zenodo "${remote.creators.map((c) => c.name).join("; ")}"`,
    });

  const orcids = local.authors.flatMap((a, i) => {
    const theirsOrcid = remote.creators[i]?.orcid ?? undefined;
    return a.orcid && a.orcid !== theirsOrcid
      ? [`${a.name} "${a.orcid}" vs Zenodo "${theirsOrcid ?? ""}"`]
      : [];
  });
  if (orcids.length) diffs.push({ field: "orcids", message: `orcids: ${orcids.join("; ")}` });

  differs("publication_date", local.publication_date, remote.publication_date);
  if (local.license) differs("license", licenseId(local.license), remote.license);
  differs("upload_type", local.upload_type, remote.upload_type);

  const present = new Set(remote.related_identifiers.map((r) => normaliseDoi(r.identifier)));
  const missing = relatedDois(local).filter((w) => !present.has(normaliseDoi(w.identifier)));
  if (missing.length)
    diffs.push({
      field: "related_identifiers",
      message: `related_identifiers: missing on Zenodo: ${missing.map((w) => `${w.identifier} (${w.relation})`).join(", ")}`,
    });

  return diffs;
}

const dropEmpty = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined));

/**
 * The record's creators as Zenodo creators. A creator already on Zenodo
 * (matched by normalised name) keeps its name as spelled there, its
 * affiliation and any other fields; the record's ORCID wins where it gives one.
 */
function mergeCreators(local: NtroForZenodo, existing: ZenodoCreator[]): ZenodoCreator[] {
  const unused = [...existing];
  return local.authors.map((a) => {
    const i = unused.findIndex((c) => normaliseName(c.name) === normaliseName(a.name));
    const match = i >= 0 ? unused.splice(i, 1)[0] : undefined;
    return dropEmpty({
      ...match,
      name: match?.name ?? familyFirst(a.name),
      orcid: a.orcid ?? match?.orcid,
    }) as ZenodoCreator;
  });
}

/**
 * Deposition `metadata` with `fields` set from the record and everything else
 * (description, keywords, communities, other related identifiers...) kept.
 * Missing related-work DOIs are appended; nothing is removed.
 */
export function applyNtro(
  metadata: Record<string, any>,
  local: NtroForZenodo,
  fields: ManagedField[],
): Record<string, any> {
  const out = { ...metadata };
  const want = new Set(fields);
  if (want.has("title")) out.title = local.title;
  if (want.has("creators") || want.has("orcids"))
    out.creators = mergeCreators(local, metadata.creators ?? []);
  if (want.has("publication_date")) out.publication_date = local.publication_date;
  if (want.has("license") && local.license) out.license = licenseId(local.license);
  if (want.has("upload_type")) out.upload_type = local.upload_type;
  if (want.has("related_identifiers")) {
    const existing: ZenodoRelated[] = metadata.related_identifiers ?? [];
    const present = new Set(existing.map((r) => normaliseDoi(r.identifier)));
    const added = relatedDois(local)
      .filter((w) => !present.has(normaliseDoi(w.identifier)))
      .map((w) => ({
        identifier: stripDoiPrefix(w.identifier),
        relation: w.relation,
        scheme: "doi",
        ...(w.type ? { resource_type: w.type } : {}),
      }));
    out.related_identifiers = [...existing, ...added];
  }
  return out;
}
