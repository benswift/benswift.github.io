// Zod fragments shared by the `livecoding` and `ntro` content collections, so
// the DataCite-style fields mean the same thing in both. Imported by
// src/content.config.ts and by scripts/check-ntro.ts.
import { z } from "astro/zod";

/** A person credited on a record; `orcid` is the bare iD, e.g. "0000-0003-2138-5969". */
export const personSchema = z.object({
  name: z.string(),
  orcid: z.string().optional(),
});

/**
 * A link to a related work (paper, repo, AT-URI, living site, streaming copy).
 * relation/type follow the DataCite relationType / resourceTypeGeneral
 * vocabularies (e.g. relation "isDocumentedBy", "isVariantFormOf").
 */
export const relatedWorkSchema = z.object({
  relation: z.string(),
  identifier: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional(),
});

const ntroFields = z.object({
  // BibTeX-style citation key, shared with cybernetics-website's `ntro.key`.
  key: z.string(),
  title: z.string(),
  // Creators in credit order. ORCIDs only where verifiably held.
  authors: z.array(personSchema),
  // Year of first public presentation, as in cybernetics-website; must be the
  // year of `publication_date`.
  year: z.number().int(),
  // Full date (YYYY-MM-DD) of the work's first public showing: the Zenodo
  // record's publication_date.
  publication_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // Concept (all-versions) DOI: always cite this, never a version DOI.
  doi: z.string(),
  // Latest archived version DOI, for reference only.
  latest_version_doi: z.string().optional(),
  // Licence on the deposited Zenodo record, as spelled in cybernetics-website
  // (e.g. "MIT", "CC BY 4.0").
  license: z.string().optional(),
  // Zenodo resource type of the deposited record (the legacy Deposit API's
  // upload_type).
  upload_type: z.enum([
    "physicalobject",
    "other",
    "dataset",
    "software",
    "image",
    "video",
    "publication",
    "lesson",
  ]),
  // "single" output, or a "portfolio" of related outputs under one endeavour.
  kind: z.enum(["single", "portfolio"]).default("single"),
  // ERA output "Category: Sub-category", as in cybernetics-website (the
  // sub-category is the part after the colon).
  category: z.string(),
  // Register qualifier dropped from `category` (e.g. "interactive installation").
  category_note: z.string().optional(),
  // Other category readings to raise with the collection officer.
  category_alternates: z.array(z.string()).default([]),
  designation: z.enum(["Standard", "Major"]),
  // Ben's share of the work, 0--100, with who else contributed.
  individual_contribution: z
    .object({ percent: z.number(), note: z.string().optional() })
    .optional(),
  // Weighted ANZSRC 2020 FoR codes (6-digit); weights sum to 100.
  for_codes: z.array(z.object({ code: z.string(), name: z.string(), weight: z.number() })),
  // Rationale and alternate codes for the split.
  for_notes: z.string().optional(),
  // "proposed" until the collection officer signs off category, sub-category,
  // standard-vs-major and FoR codes together.
  coding_status: z.enum(["proposed", "validated"]).default("proposed"),
  // Research Portal Plus lodgement.
  rp_plus: z.object({
    // RP+ "Non-textual form" subcategory (never "Other contribution").
    subcategory: z.string().optional(),
    subcategory_note: z.string().optional(),
    status: z.enum(["not-lodged", "lodged", "validated"]).default("not-lodged"),
    // Link to the RP+ / Open Research record once it exists.
    record_url: z.string().optional(),
  }),
  // Per-NTRO progress checklist (the register's tick-list).
  checklist: z.object({
    statement_finalised: z.boolean().default(false),
    coding_validated: z.boolean().default(false),
    evidence_filed: z.boolean().default(false),
    rp_plus_record: z.boolean().default(false),
  }),
  // Verification evidence on file (programmes, proceedings, install docs...).
  verification_evidence: z.array(z.string()).default([]),
  // Companion papers, living sites, archives (DataCite relation vocabulary).
  related_works: z.array(relatedWorkSchema).default([]),
  // Anything else worth keeping: provenance, outstanding edits, reception.
  notes: z.array(z.string()).default([]),
});

/** Front matter of a `src/content/ntro/*.md` record; field comments are the schema docs. */
export const ntroSchema = ntroFields.refine((r) => r.publication_date.startsWith(`${r.year}-`), {
  message: "year must be the year of publication_date",
  path: ["year"],
});
