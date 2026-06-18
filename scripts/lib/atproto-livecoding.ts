// Per-gig atproto records for the live-coding body of work (TASK-23.10).
//
// AC #1 decision — COMPANION, not extend: site.standard.document is a
// third-party longform-publishing lexicon (title/path/contents/publication
// link) with no field for DOIs or research-output metadata, and it isn't ours
// to fork. So each gig gets TWO records:
//   1. a standard site.standard.document (the human-facing page), and
//   2. a companion me.benswift.ntro record in our own namespace holding the
//      DataCite DOI + a strongRef {uri,cid} to the document.
// The document's AT-URI is what gets carried into the gig's DataCite record as
// a relatedIdentifier (verified: Zenodo accepts a raw at:// identifier).

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { computeHash, toPlainText } from "./posts";

export const DOCUMENT_NSID = "site.standard.document";
export const NTRO_NSID = "me.benswift.ntro";

export interface StrongRef {
  uri: string;
  cid: string;
}

export interface GigData {
  /** Filename stem (e.g. 2024-05-31-iclc-24) — also the rkey and URL segment. */
  slug: string;
  title: string;
  date: string;
  description: string;
  textContent: string;
  contentHash: string;
  doi?: string;
  venue?: string;
  event?: string;
  type?: string;
  instrument?: string;
  forCodes?: string[];
}

/** Public URL path for a gig — matches src/pages/livecoding/[slug].astro. */
export function gigDocPath(slug: string): string {
  return `/livecoding/${slug}`;
}

export function atUri(did: string, collection: string, rkey: string): string {
  return `at://${did}/${collection}/${rkey}`;
}

export function discoverGigs(dir: string, only?: string): GigData[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "index.md" && (!only || f.includes(only)))
    .toSorted()
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data: fm, content: body } = matter(raw);
      const slug = f.replace(/\.md$/, "");
      const date = (typeof fm.date === "string" && fm.date) || slug.slice(0, 10);
      return {
        slug,
        title: fm.title ?? slug,
        date: String(date).slice(0, 10),
        description: fm.description ?? "",
        textContent: toPlainText(body),
        contentHash: computeHash(raw),
        doi: fm.doi,
        venue: fm.venue,
        event: fm.event,
        type: fm.type,
        instrument: fm.instrument,
        forCodes: fm.for_codes,
      } satisfies GigData;
    });
}

/** A standard site.standard.document record for the gig's page. */
export function buildDocumentRecord(gig: GigData, pubUri: string): Record<string, unknown> {
  return {
    $type: DOCUMENT_NSID,
    title: gig.title,
    site: pubUri,
    path: gigDocPath(gig.slug),
    textContent: gig.textContent,
    publishedAt: `${gig.date}T00:00:00.000Z`,
    description: gig.description,
    tags: ["livecoding", "performance", ...(gig.instrument ? [gig.instrument.toLowerCase()] : [])],
  };
}

/**
 * The companion me.benswift.ntro record: carries the DataCite DOI and a
 * strongRef to the document, plus enough denormalised context to stand alone.
 */
export function buildNtroRecord(
  gig: GigData,
  document: StrongRef,
  createdAt: string,
  collectionDoi?: string,
): Record<string, unknown> {
  return {
    $type: NTRO_NSID,
    document,
    outputType: "performance",
    title: gig.title,
    performedAt: `${gig.date}T00:00:00.000Z`,
    ...(gig.doi ? { doi: gig.doi } : {}),
    ...(gig.venue ? { venue: gig.venue } : {}),
    ...(gig.event ? { event: gig.event } : {}),
    ...(gig.forCodes?.length ? { fieldsOfResearch: gig.forCodes } : {}),
    ...(collectionDoi ? { partOf: collectionDoi } : {}),
    createdAt,
  };
}

/** Writes one record and returns its strong reference; mockable in tests. */
export type PutFn = (
  collection: string,
  rkey: string,
  record: Record<string, unknown>,
) => Promise<StrongRef>;

export interface GigPublishResult {
  slug: string;
  document: StrongRef;
  ntro: StrongRef;
  doi?: string;
  /** The document AT-URI, ready to carry as a DataCite relatedIdentifier (AC #4). */
  dataciteRelatedIdentifier: string;
}

/** Put the document, then the companion NTRO that strongRefs it. */
export async function publishGig(
  put: PutFn,
  gig: GigData,
  pubUri: string,
  createdAt: string,
  collectionDoi?: string,
): Promise<GigPublishResult> {
  const document = await put(DOCUMENT_NSID, gig.slug, buildDocumentRecord(gig, pubUri));
  const ntro = await put(
    NTRO_NSID,
    gig.slug,
    buildNtroRecord(gig, document, createdAt, collectionDoi),
  );
  return { slug: gig.slug, document, ntro, doi: gig.doi, dataciteRelatedIdentifier: document.uri };
}
