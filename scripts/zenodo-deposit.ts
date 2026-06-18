#!/usr/bin/env pnpm exec tsx
// Mint a DataCite DOI per live-coding gig via the Zenodo REST (legacy Deposit)
// API, and write the reserved DOI back into the gig's frontmatter (TASK-23.08).
//
// Run via `mise exec --` so the tokens are in the env:
//   mise exec -- pnpm exec tsx scripts/zenodo-deposit.ts                       # dry run, sandbox
//   mise exec -- pnpm exec tsx scripts/zenodo-deposit.ts --write --only iclc-24 --publish
//   mise exec -- pnpm exec tsx scripts/zenodo-deposit.ts --write --prod        # production (rights pass first!)
//
// Flags:
//   --write     actually call the API + edit frontmatter (default: dry run)
//   --prod      target zenodo.org with ZENODO_ACCESS_TOKEN (default: sandbox.zenodo.org + ZENODO_SANDBOX_TOKEN)
//   --only <s>  restrict to gigs whose slug contains <s>
//   --publish   publish the deposition (default: leave as an editable draft)
//   --no-files  skip the documentation-file upload
//
// Idempotent: skips gigs that already have a `doi`. A sidecar state file
// (scripts/.zenodo-state-<target>.json, gitignored) tracks in-flight
// depositions so a re-run resumes rather than orphaning drafts.

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import matter from "gray-matter";
import { loadCollectionState } from "./lib/zenodo-collection-state";
import { acceptInclusionRequests } from "./lib/zenodo-community";

// Happy Eyeballs: race IPv4/IPv6 and use whichever connects first, so the
// deposit still works on networks where IPv6 routing is broken.
net.setDefaultAutoSelectFamily(true);
net.setDefaultAutoSelectFamilyAttemptTimeout(500);

const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const argOf = (f: string) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const WRITE = has("--write");
const PROD = has("--prod");
const PUBLISH = has("--publish");
const NO_FILES = has("--no-files");
const ONLY = argOf("--only");

const TARGET = PROD ? "prod" : "sandbox";
const BASE = PROD ? "https://zenodo.org" : "https://sandbox.zenodo.org";
const TOKEN = PROD ? process.env.ZENODO_ACCESS_TOKEN : process.env.ZENODO_SANDBOX_TOKEN;
// Body-of-work umbrella (TASK-23.09), if set up: every gig links back via
// isPartOf and is filed under the same Zenodo Community.
const COLLECTION = loadCollectionState(TARGET);
const COLLECTION_DOI = COLLECTION.doi;
const COLLECTION_COMMUNITY = COLLECTION.communitySlug;

const LIVECODING_DIR = path.resolve(process.cwd(), "src/content/livecoding");
const STATE_PATH = path.resolve(process.cwd(), `scripts/.zenodo-state-${TARGET}.json`);
const BEN_ORCID = "0000-0003-2138-5969";
const ANU = "Australian National University";

interface Artist {
  name: string;
  role: string;
  orcid?: string;
}
interface RelatedWork {
  relation: string;
  identifier?: string;
  url?: string;
  type?: string;
}
interface Gig {
  title: string;
  date?: string;
  venue?: string;
  venue_url?: string;
  event?: string;
  event_url?: string;
  type?: string;
  instrument?: string;
  description?: string;
  doi?: string;
  artists?: Artist[];
  videos?: { url: string; label?: string }[];
  related_works?: RelatedWork[];
  archived_event_url?: string;
  archived_venue_url?: string;
  license?: string;
}

type State = Record<
  string,
  { depositionId: number; doi: string; published: boolean; bucket?: string }
>;

const loadState = (): State =>
  fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) : {};
const saveState = (s: State) => fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2) + "\n");

async function zenodo(method: string, url: string, body?: unknown): Promise<any> {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zenodo ${method} ${url} → ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

/** "Ben Swift" → "Swift, Ben"; leaves already-comma'd or single-token names alone. */
function familyFirst(name: string): string {
  if (name.includes(",")) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const family = parts.pop()!;
  return `${family}, ${parts.join(" ")}`;
}

function buildCreators(gig: Gig) {
  const creators: { name: string; orcid?: string; affiliation?: string }[] = [
    { name: "Swift, Ben", orcid: BEN_ORCID, affiliation: ANU },
  ];
  for (const a of gig.artists ?? []) {
    creators.push({ name: familyFirst(a.name), ...(a.orcid ? { orcid: a.orcid } : {}) });
  }
  return creators;
}

function buildRelated(gig: Gig) {
  const rel: { relation: string; identifier: string; resource_type?: string }[] = [];
  for (const v of gig.videos ?? []) {
    rel.push({ relation: "isVariantFormOf", identifier: v.url, resource_type: "video" });
  }
  if (gig.event_url) rel.push({ relation: "references", identifier: gig.event_url });
  if (gig.archived_event_url)
    rel.push({ relation: "isDocumentedBy", identifier: gig.archived_event_url });
  if (gig.archived_venue_url)
    rel.push({ relation: "isDocumentedBy", identifier: gig.archived_venue_url });
  for (const w of gig.related_works ?? []) {
    const id = w.identifier ?? w.url;
    if (id)
      rel.push({
        relation: w.relation,
        identifier: id,
        ...(w.type ? { resource_type: w.type } : {}),
      });
  }
  // Link back to the body-of-work umbrella (TASK-23.09), once it's reserved.
  if (COLLECTION_DOI) rel.push({ relation: "isPartOf", identifier: COLLECTION_DOI });
  // Zenodo rejects an identifier that equals the record's own — none here. Dedupe by identifier+relation.
  const seen = new Set<string>();
  return rel.filter((r) => {
    const k = `${r.relation}:${r.identifier}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function buildDescription(gig: Gig): string {
  const bits = [`<p>${gig.description ?? "Live-coded music performance by Ben Swift."}</p>`];
  const dl: string[] = [];
  if (gig.event) dl.push(`<dt>Event</dt><dd>${gig.event}</dd>`);
  if (gig.venue) dl.push(`<dt>Venue</dt><dd>${gig.venue}</dd>`);
  if (gig.instrument) dl.push(`<dt>Instrument</dt><dd>${gig.instrument}</dd>`);
  const performers = ["Ben Swift", ...(gig.artists ?? []).map((a) => `${a.name} (${a.role})`)].join(
    ", ",
  );
  dl.push(`<dt>Performers</dt><dd>${performers}</dd>`);
  if (dl.length) bits.push(`<dl>${dl.join("")}</dl>`);
  bits.push(
    `<p>This record is part of Ben Swift's body of live-coding performance work (almost two decades, 2008&ndash;present).</p>`,
  );
  return bits.join("\n");
}

function buildMetadata(gig: Gig, dateStr: string) {
  const keywords = [
    "live coding",
    "livecoding",
    "algorave",
    "performance",
    "computer music",
    ...(gig.instrument ? [gig.instrument] : []),
  ];
  return {
    upload_type: (gig.videos?.length ?? 0) > 0 ? "video" : "other",
    title: gig.title,
    creators: buildCreators(gig),
    description: buildDescription(gig),
    publication_date: dateStr,
    keywords,
    related_identifiers: buildRelated(gig),
    notes: `${gig.type ?? "performance"} live-coding performance.`,
    // Rights pass (.02): all gigs are link-only (media stays on Vimeo/YouTube,
    // linked via isVariantFormOf), and the record is licensed CC-BY-SA-4.0 to
    // match the site. A per-gig `license` frontmatter field still overrides.
    access_right: "open",
    license: gig.license ?? "cc-by-sa-4.0",
    ...(COLLECTION_COMMUNITY ? { communities: [{ identifier: COLLECTION_COMMUNITY }] } : {}),
  };
}

/** Insert or replace a frontmatter field directly after an anchor line. */
function setFrontmatterField(
  raw: string,
  anchorKey: string,
  newKey: string,
  value: string,
): string {
  const line = `${newKey}: "${value}"`;
  const existing = new RegExp(`^${newKey}:.*$`, "m");
  if (existing.test(raw)) return raw.replace(existing, line);
  const anchor = new RegExp(`^(${anchorKey}:.*)$`, "m");
  if (anchor.test(raw)) return raw.replace(anchor, `$1\n${line}`);
  // no anchor — insert as the first line after the opening ---
  return raw.replace(/^---\n/, `---\n${line}\n`);
}

async function uploadDocFile(bucket: string, slug: string, gig: Gig, dateStr: string) {
  const lines = [
    gig.title,
    "=".repeat(gig.title.length),
    "",
    `Performance: Ben Swift${(gig.artists ?? []).map((a) => `, ${a.name} (${a.role})`).join("")}`,
    `Date: ${dateStr}`,
    gig.event ? `Event: ${gig.event}` : "",
    gig.venue ? `Venue: ${gig.venue}` : "",
    gig.instrument ? `Instrument: ${gig.instrument}` : "",
    "",
    gig.description ?? "",
    "",
    ...(gig.videos ?? []).map((v) => `Recording (streaming copy): ${v.url}`),
    gig.event_url ? `Event page: ${gig.event_url}` : "",
  ].filter(Boolean);
  const content = lines.join("\n") + "\n";
  const res = await fetch(`${bucket}/${slug}.txt`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/octet-stream" },
    body: content,
  });
  if (!res.ok) throw new Error(`file upload → ${res.status}: ${await res.text()}`);
}

async function depositGig(slug: string, filePath: string, state: State) {
  const raw = fs.readFileSync(filePath, "utf8");
  const gig = matter(raw).data as Gig;
  // Skip only when truly finished: published per state, or a DOI is set with no
  // in-flight draft to resume. A reserved-but-unpublished DOI still needs publishing.
  if (state[slug]?.published || (gig.doi && !state[slug])) {
    console.log(`  – ${slug}: already deposited (DOI ${gig.doi ?? state[slug]?.doi}) — skipping`);
    return;
  }
  const dateStr = (gig.date ?? slug.slice(0, 10)).slice(0, 10);
  const metadata = buildMetadata(gig, dateStr);

  if (!WRITE) {
    console.log(`  · ${slug}: would deposit "${gig.title}" (${metadata.upload_type})`);
    console.log(`      creators: ${metadata.creators.map((c) => c.name).join("; ")}`);
    console.log(
      `      related: ${metadata.related_identifiers.map((r) => `${r.relation} ${r.identifier}`).join(" | ") || "—"}`,
    );
    return;
  }

  // 1. create (or resume) the deposition
  let dep = state[slug];
  if (!dep) {
    const created = await zenodo("POST", `${BASE}/api/deposit/depositions`, {});
    dep = {
      depositionId: created.id,
      doi: created.metadata.prereserve_doi.doi,
      bucket: created.links.bucket,
      published: false,
    };
    state[slug] = dep;
    saveState(state);
    console.log(`  + ${slug}: deposition ${dep.depositionId}, reserved DOI ${dep.doi}`);
  }

  // 2. set metadata
  await zenodo("PUT", `${BASE}/api/deposit/depositions/${dep.depositionId}`, { metadata });

  // 3. upload the documentation file (placeholder for the archival recording)
  if (!NO_FILES && dep.bucket) await uploadDocFile(dep.bucket, slug, gig, dateStr);

  // 4. write the reserved DOI into frontmatter BEFORE publishing
  const updated = setFrontmatterField(raw, "type", "doi", dep.doi);
  fs.writeFileSync(filePath, updated, "utf8");
  console.log(`  ✓ ${slug}: wrote DOI ${dep.doi} to frontmatter`);

  // 5. publish (optional). The published DOI is authoritative — on production it
  // equals the reserved one, but reconcile frontmatter in case it differs.
  if (PUBLISH && !dep.published) {
    const published = await zenodo(
      "POST",
      `${BASE}/api/deposit/depositions/${dep.depositionId}/actions/publish`,
    );
    const finalDoi: string = published?.doi ?? dep.doi;
    if (finalDoi !== dep.doi) {
      fs.writeFileSync(
        filePath,
        setFrontmatterField(fs.readFileSync(filePath, "utf8"), "type", "doi", finalDoi),
        "utf8",
      );
      dep.doi = finalDoi;
    }
    dep.published = true;
    saveState(state);
    console.log(`  ★ ${slug}: published → ${BASE}/doi/${finalDoi}`);
    // Owner-accept the community-inclusion request publishing opened, so the gig
    // actually lands in the body-of-work community (TASK-23.09).
    if (COLLECTION_COMMUNITY) {
      const n = await acceptInclusionRequests(BASE, TOKEN!, dep.depositionId);
      if (n) console.log(`  ⌂ ${slug}: filed under community ${COLLECTION_COMMUNITY}`);
    }
  }
}

async function main() {
  if (WRITE && !TOKEN)
    throw new Error(
      `missing ${PROD ? "ZENODO_ACCESS_TOKEN" : "ZENODO_SANDBOX_TOKEN"} — run via 'mise exec --'`,
    );
  console.log(
    `Zenodo deposit — target: ${TARGET} (${BASE}) — mode: ${WRITE ? "WRITE" : "dry run"}${PUBLISH ? " + publish" : ""}`,
  );

  const files = fs
    .readdirSync(LIVECODING_DIR)
    .filter((f) => f.endsWith(".md") && f !== "index.md" && (!ONLY || f.includes(ONLY)))
    .toSorted();

  const state = loadState();
  for (const file of files) {
    try {
      await depositGig(file.replace(/\.md$/, ""), path.join(LIVECODING_DIR, file), state);
    } catch (err) {
      console.error(`  ✗ ${file}: ${(err as Error).message}`);
    }
  }
  if (PROD) console.log("\nProduction DOIs are permanent. Commit the frontmatter changes.");
}

main();
