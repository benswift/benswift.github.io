#!/usr/bin/env pnpm exec tsx
// Mint the collection-level (umbrella) DOI for Ben's live-coding body of work
// and file it — plus every per-gig record — under a Zenodo Community
// (TASK-23.09). The umbrella links to each gig via `hasPart`; each gig links
// back via `isPartOf` (added at deposit time by scripts/zenodo-deposit.ts,
// which reads the reserved umbrella DOI from this script's state file).
//
// Run via `mise exec --` so the tokens are in the env:
//   mise exec -- pnpm exec tsx scripts/zenodo-collection.ts                         # dry run, sandbox
//   mise exec -- pnpm exec tsx scripts/zenodo-collection.ts --write --create-community
//   mise exec -- pnpm exec tsx scripts/zenodo-collection.ts --write --publish
//   mise exec -- pnpm exec tsx scripts/zenodo-collection.ts --write --prod --publish # production
//
// Flags:
//   --write              actually call the API + write state (default: dry run)
//   --prod               target zenodo.org with ZENODO_ACCESS_TOKEN (default: sandbox)
//   --publish            publish the umbrella (default: leave an editable draft)
//   --create-community   create the Zenodo Community if it doesn't exist yet
//   --community-slug <s> override the community slug (default: ben-swift-livecoding)
//   --statement <path>   research-statement file for the description (default below)
//   --no-files           skip the README file upload
//
// Lifecycle / append story (AC #4): the umbrella record is edited IN PLACE as
// gigs are added — Zenodo only mints a new DOI on `newversion`, never on a
// metadata edit, so the collection DOI is stable. To append a future gig:
//   1. deposit the gig (it carries isPartOf the umbrella automatically);
//   2. re-run this script with --write --publish — it adds the new hasPart and
//      re-publishes the SAME DOI, and files the gig under the Community.

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import matter from "gray-matter";
import {
  type CollectionState,
  loadCollectionState,
  saveCollectionState,
} from "./lib/zenodo-collection-state";
import { acceptInclusionRequests } from "./lib/zenodo-community";

// Happy Eyeballs: race IPv4/IPv6 so it still works where IPv6 routing is broken.
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
const CREATE_COMMUNITY = has("--create-community");
const NO_FILES = has("--no-files");
const COMMUNITY_SLUG = argOf("--community-slug") ?? "ben-swift-livecoding";

const TARGET = PROD ? "prod" : "sandbox";
const BASE = PROD ? "https://zenodo.org" : "https://sandbox.zenodo.org";
const TOKEN = PROD ? process.env.ZENODO_ACCESS_TOKEN : process.env.ZENODO_SANDBOX_TOKEN;

const LIVECODING_DIR = path.resolve(process.cwd(), "src/content/livecoding");
const STATEMENT_PATH = path.resolve(
  process.cwd(),
  argOf("--statement") ?? "src/data/livecoding-research-statement.md",
);
const SITE_DATA_PATH = path.resolve(process.cwd(), "src/data/livecoding-collection.ts");
const BEN_ORCID = "0000-0003-2138-5969";
const ANU = "Australian National University";
const COLLECTION_TITLE = "Live-coding performances: a body of work (2008–present)";
const TODAY = new Date().toISOString().slice(0, 10);

async function api(method: string, url: string, body?: unknown): Promise<any> {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Zenodo ${method} ${url} → ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

/** GET that tolerates 404 (returns null) — for existence checks. */
async function apiGet(url: string): Promise<any | null> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Zenodo GET ${url} → ${res.status}: ${await res.text()}`);
  return res.json();
}

interface Gig {
  title: string;
  date?: string;
  doi?: string;
}

/** Every deposited gig's DOI, in date order, for the umbrella's hasPart links. */
function collectGigDois(): { slug: string; title: string; doi: string }[] {
  return fs
    .readdirSync(LIVECODING_DIR)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .toSorted()
    .map((f) => ({
      slug: f.replace(/\.md$/, ""),
      ...(matter(fs.readFileSync(path.join(LIVECODING_DIR, f), "utf8")).data as Gig),
    }))
    .filter((g): g is { slug: string; title: string; doi: string } => Boolean(g.doi))
    .map((g) => ({ slug: g.slug, title: g.title, doi: g.doi }));
}

/** Minimal markdown → HTML: blank-line-separated paragraphs, soft-wraps joined. */
function parasToHtml(md: string): string {
  return md
    .trim()
    .split(/\n\s*\n/)
    .map((p) => {
      const inline = p
        .trim()
        .replace(/\s*\n\s*/g, " ")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
      return `<p>${inline}</p>`;
    })
    .join("\n");
}

function loadStatement(): { html: string; placeholder: boolean } {
  if (fs.existsSync(STATEMENT_PATH)) {
    const body = matter(fs.readFileSync(STATEMENT_PATH, "utf8")).content.trim();
    if (body) return { html: parasToHtml(body), placeholder: false };
  }
  // Pending the finalised research statement (TASK-23.03). Clearly marked so it
  // never silently ships to production (publishing it to prod is blocked below).
  const html = parasToHtml(
    `PLACEHOLDER — pending the finalised research statement (TASK-23.03).

This record is the umbrella for Ben Swift's live-coding performance work: a body
of work spanning almost two decades (2008–present) and continuing. Ben performs
as a performer-researcher-engineer, live-coding music from scratch on stage —
with Impromptu in the early years and Extempore since 2011. Each performance in
the collection carries its own DataCite DOI and links back here via isPartOf.`,
  );
  return { html, placeholder: true };
}

function buildMetadata(statementHtml: string, gigDois: string[], communityAvailable: boolean) {
  return {
    upload_type: "other", // Zenodo has no "collection" upload_type; "other" maps to DataCite Other.
    title: COLLECTION_TITLE,
    creators: [{ name: "Swift, Ben", orcid: BEN_ORCID, affiliation: ANU }],
    description: statementHtml,
    publication_date: TODAY,
    keywords: [
      "live coding",
      "livecoding",
      "algorave",
      "performance",
      "computer music",
      "body of work",
    ],
    related_identifiers: gigDois.map((doi) => ({ relation: "hasPart", identifier: doi })),
    notes: "Body-of-work umbrella record for Ben Swift's live-coding performances.",
    access_right: "open",
    license: "cc-by-sa-4.0",
    ...(communityAvailable ? { communities: [{ identifier: COMMUNITY_SLUG }] } : {}),
  };
}

async function ensureCommunity(): Promise<boolean> {
  const url = `${BASE}/api/communities/${COMMUNITY_SLUG}`;
  const existing = await apiGet(url);
  if (existing) {
    console.log(`  ✓ community "${COMMUNITY_SLUG}" exists (${existing.id})`);
    return true;
  }
  if (!CREATE_COMMUNITY) {
    console.log(
      `  ! community "${COMMUNITY_SLUG}" not found — re-run with --create-community, or create it in the Zenodo UI with that exact slug`,
    );
    return false;
  }
  if (!WRITE) {
    console.log(`  · would create community "${COMMUNITY_SLUG}"`);
    return false;
  }
  try {
    const created = await api("POST", `${BASE}/api/communities`, {
      access: { visibility: "public", member_policy: "open", record_policy: "open" },
      slug: COMMUNITY_SLUG,
      metadata: {
        title: "Ben Swift — live-coding performances",
        description:
          "Live-coded music performances by Ben Swift (ANU), 2008–present. The open umbrella for the body of work; new gigs are appended here.",
      },
    });
    console.log(`  + created community "${COMMUNITY_SLUG}" (${created.id})`);
    return true;
  } catch (err) {
    console.log(`  ! couldn't create community via API (${(err as Error).message.split("\n")[0]})`);
    console.log(`    → create it once in the Zenodo UI with slug "${COMMUNITY_SLUG}", then re-run`);
    return false;
  }
}

async function uploadReadme(bucket: string, members: { title: string; doi: string }[]) {
  const lines = [
    COLLECTION_TITLE,
    "=".repeat(COLLECTION_TITLE.length),
    "",
    "Umbrella record for Ben Swift's live-coding performance work (2008–present).",
    "Each member performance carries its own DataCite DOI and links back here.",
    "",
    "Members:",
    ...(members.length
      ? members.map((m) => `  - ${m.title} — ${m.doi}`)
      : ["  (none linked yet — deposit the per-gig records first)"]),
    "",
  ];
  const res = await fetch(`${bucket}/README.txt`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/octet-stream" },
    body: lines.join("\n"),
  });
  if (!res.ok) throw new Error(`README upload → ${res.status}: ${await res.text()}`);
}

function writeSiteData(state: CollectionState) {
  const conceptDoi = state.conceptDoi ?? state.doi!;
  const contents = `// Generated by \`pnpm zenodo:collection --prod --publish\` (TASK-23.09).
// The umbrella DOI for Ben Swift's live-coding body of work + its Zenodo
// Community. Cite the conceptDoi — it is stable as gigs are appended.

export interface LivecodingCollection {
  doi: string;
  conceptDoi: string;
  doiUrl: string;
  community: { slug: string; url: string };
}

export const livecodingCollection: LivecodingCollection | null = {
  doi: ${JSON.stringify(state.doi)},
  conceptDoi: ${JSON.stringify(conceptDoi)},
  doiUrl: ${JSON.stringify(`https://doi.org/${conceptDoi}`)},
  community: {
    slug: ${JSON.stringify(COMMUNITY_SLUG)},
    url: ${JSON.stringify(`https://zenodo.org/communities/${COMMUNITY_SLUG}`)},
  },
};
`;
  fs.writeFileSync(SITE_DATA_PATH, contents);
  console.log(`  ✓ wrote ${path.relative(process.cwd(), SITE_DATA_PATH)}`);
}

async function main() {
  if (WRITE && !TOKEN)
    throw new Error(
      `missing ${PROD ? "ZENODO_ACCESS_TOKEN" : "ZENODO_SANDBOX_TOKEN"} — run via 'mise exec --'`,
    );
  console.log(
    `Zenodo collection — target: ${TARGET} (${BASE}) — mode: ${WRITE ? "WRITE" : "dry run"}${PUBLISH ? " + publish" : ""}`,
  );

  const members = collectGigDois();
  const gigDois = members.map((m) => m.doi);
  const { html: statementHtml, placeholder } = loadStatement();
  if (placeholder)
    console.log(
      `  ! description is a PLACEHOLDER (no ${path.relative(process.cwd(), STATEMENT_PATH)})`,
    );
  if (PROD && PUBLISH && placeholder)
    throw new Error(
      "refusing to publish a placeholder description to production — finalise TASK-23.03 first",
    );
  console.log(`  · ${members.length} gig DOI(s) to link via hasPart`);

  const communityAvailable = await ensureCommunity();
  const metadata = buildMetadata(statementHtml, gigDois, communityAvailable);

  if (!WRITE) {
    console.log(`  · would mint "${metadata.title}" (upload_type: ${metadata.upload_type})`);
    console.log(`      hasPart: ${gigDois.length ? gigDois.join(", ") : "—"}`);
    console.log(`      community: ${communityAvailable ? COMMUNITY_SLUG : "(not linked)"}`);
    console.log(`      publish: ${PUBLISH ? "yes" : "no (draft)"}`);
    return;
  }

  const state = loadCollectionState(TARGET);
  const wasPublished = state.published === true;
  state.communitySlug = COMMUNITY_SLUG;

  // 1. create (or resume) the umbrella deposition, reserving its DOI
  if (!state.depositionId) {
    const created = await api("POST", `${BASE}/api/deposit/depositions`, {});
    state.depositionId = created.id;
    state.doi = created.metadata.prereserve_doi.doi;
    state.bucket = created.links.bucket;
    state.published = false;
    saveCollectionState(TARGET, state);
    console.log(`  + deposition ${state.depositionId}, reserved DOI ${state.doi}`);
  }

  // 2. a published record must be unlocked before its metadata can change
  if (wasPublished) {
    try {
      await api("POST", `${BASE}/api/deposit/depositions/${state.depositionId}/actions/edit`);
      console.log(`  ↻ unlocked published record ${state.depositionId} for editing`);
    } catch (err) {
      // 400 = already open for editing (e.g. an interrupted earlier run); continue.
      if (!(err as Error).message.includes("→ 400")) throw err;
    }
  }

  // 3. set metadata (description, hasPart links, community)
  await api("PUT", `${BASE}/api/deposit/depositions/${state.depositionId}`, { metadata });
  console.log(`  ✓ metadata set (${gigDois.length} hasPart link(s))`);

  // 4. upload the README (a deposition needs ≥1 file to publish). Only on the
  // first publish — Zenodo locks the file bucket once a record is published, so
  // in-place metadata edits (appends) must not re-upload.
  if (!NO_FILES && state.bucket && !wasPublished) await uploadReadme(state.bucket, members);

  state.hasParts = gigDois;
  saveCollectionState(TARGET, state);

  // 5. publish (optional). Metadata edits keep the same DOI — only newversion mints a new one.
  if (PUBLISH) {
    const published = await api(
      "POST",
      `${BASE}/api/deposit/depositions/${state.depositionId}/actions/publish`,
    );
    state.doi = published?.doi ?? state.doi;
    state.conceptDoi = published?.conceptdoi ?? state.conceptDoi;
    state.published = true;
    saveCollectionState(TARGET, state);
    console.log(
      `  ★ published → ${BASE}/doi/${state.doi}${state.conceptDoi ? ` (concept ${state.conceptDoi})` : ""}`,
    );
    if (communityAvailable) {
      const n = await acceptInclusionRequests(BASE, TOKEN!, state.depositionId!);
      if (n) console.log(`  ⌂ filed umbrella under community ${COMMUNITY_SLUG}`);
    }
    if (PROD) writeSiteData(state);
  } else {
    console.log(`  · draft saved (re-run with --publish to mint/refresh the DOI)`);
  }

  if (!communityAvailable)
    console.log(`  ! not filed under a Community yet — create "${COMMUNITY_SLUG}" then re-run`);
  if (PROD)
    console.log("\nProduction DOIs are permanent. Commit src/data/livecoding-collection.ts.");
}

main();
