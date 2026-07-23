#!/usr/bin/env pnpm exec tsx
// Publish per-gig atproto records for the live-coding body of work (TASK-23.10):
// a site.standard.document (the page) + a companion me.benswift.researchOutput
// record holding the DataCite DOI and a strongRef to the document. The document
// AT-URI is exposed for use as a DataCite relatedIdentifier (Zenodo accepts at://).
//
// Run via `mise exec --` so the atproto creds are in the env:
//   mise exec -- pnpm exec tsx scripts/atproto-livecoding.ts                 # dry run
//   mise exec -- pnpm exec tsx scripts/atproto-livecoding.ts --write
//   mise exec -- pnpm exec tsx scripts/atproto-livecoding.ts --write --only iclc-24
//
// Flags:
//   --write       actually log in + put records (default: dry run, prints shapes)
//   --only <s>    restrict to gigs whose filename contains <s>
//   --service <u> PDS service URL (default: https://bsky.social)
//
// Idempotent: a gig is (re)published only when its content hash or its DOI has
// changed since the last run (state in scripts/.atproto-livecoding-state.json,
// gitignored). createdAt is preserved across runs so records don't churn.

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { AtpAgent } from "@atproto/api";
import {
  atUri,
  discoverGigs,
  type GigData,
  publishGig,
  type PutFn,
} from "./lib/atproto-livecoding";

// Happy Eyeballs: race IPv4/IPv6 so it works where IPv6 routing is broken.
net.setDefaultAutoSelectFamily(true);
net.setDefaultAutoSelectFamilyAttemptTimeout(500);

const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const argOf = (f: string) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const WRITE = has("--write");
const ONLY = argOf("--only");
const SERVICE = argOf("--service") ?? "https://bsky.social";

const LIVECODING_DIR = path.resolve(process.cwd(), "src/content/livecoding");
const ATPROTO_STATE_PATH = path.resolve(process.cwd(), "atproto-state.json");
const STATE_PATH = path.resolve(process.cwd(), "scripts/.atproto-livecoding-state.json");
const COLLECTION_DATA_PATH = path.resolve(process.cwd(), "src/data/livecoding-collection.ts");

interface GigState {
  documentUri: string;
  documentCid: string;
  researchOutputUri: string;
  researchOutputCid: string;
  contentHash: string;
  doi?: string;
  createdAt: string;
}
interface State {
  did?: string;
  publicationAtUri?: string;
  gigs: Record<string, GigState>;
}

const loadState = (): State =>
  fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) : { gigs: {} };
const saveState = (s: State) => fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2) + "\n");

/** did + publication AT-URI from the blog pipeline's state, with a fallback. */
function readPublication(): { did?: string; pubUri?: string } {
  if (!fs.existsSync(ATPROTO_STATE_PATH)) return {};
  const s = JSON.parse(fs.readFileSync(ATPROTO_STATE_PATH, "utf8"));
  return { did: s.did, pubUri: s.publicationAtUri };
}

/** The umbrella concept DOI (TASK-23.09), if the prod data file has been written. */
function readCollectionDoi(): string | undefined {
  if (!fs.existsSync(COLLECTION_DATA_PATH)) return undefined;
  const m = fs.readFileSync(COLLECTION_DATA_PATH, "utf8").match(/conceptDoi:\s*"([^"]+)"/);
  return m?.[1];
}

function needsPublish(gig: GigData, prev?: GigState): boolean {
  return !prev || prev.contentHash !== gig.contentHash || prev.doi !== gig.doi;
}

async function main() {
  const { did: stateDid, pubUri: statePubUri } = readPublication();
  const collectionDoi = readCollectionDoi();
  const gigs = discoverGigs(LIVECODING_DIR, ONLY);
  const state = loadState();
  const now = new Date().toISOString();

  console.log(`atproto livecoding — mode: ${WRITE ? "WRITE" : "dry run"} — ${gigs.length} gig(s)`);
  const withDoi = gigs.filter((g) => g.doi).length;
  console.log(
    `  · ${withDoi}/${gigs.length} carry a DOI${collectionDoi ? `; collection ${collectionDoi}` : ""}`,
  );

  let did = stateDid;
  let put: PutFn;

  if (WRITE) {
    const identifier = process.env.ATP_IDENTIFIER;
    const password = process.env.ATP_APP_PASSWORD;
    if (!identifier || !password)
      throw new Error("ATP_IDENTIFIER and ATP_APP_PASSWORD required — run via 'mise exec --'");
    const agent = new AtpAgent({ service: SERVICE });
    await agent.login({ identifier, password });
    did = agent.session!.did;
    put = async (collection, rkey, record) => {
      const res = await agent.com.atproto.repo.putRecord({ repo: did!, collection, rkey, record });
      return { uri: res.data.uri, cid: res.data.cid };
    };
  } else {
    if (!did) did = "did:plc:UNKNOWN"; // dry run with no prior state
    put = async (collection, rkey, record) => {
      console.log(`    ${collection}/${rkey}: ${JSON.stringify(record)}`);
      return { uri: atUri(did!, collection, rkey), cid: "<cid-after-write>" };
    };
  }

  const pubUri = statePubUri ?? atUri(did!, "site.standard.publication", "self");
  state.did = did;
  state.publicationAtUri = pubUri;

  let published = 0;
  let skipped = 0;
  const dataciteLinks: string[] = [];

  for (const gig of gigs) {
    const prev = state.gigs[gig.slug];
    if (!needsPublish(gig, prev)) {
      skipped++;
      dataciteLinks.push(`${gig.slug}\t${prev.documentUri}`);
      continue;
    }
    const createdAt = prev?.createdAt ?? now;
    if (!gig.doi)
      console.log(
        `  ! ${gig.slug}: no DOI yet — research-output record omits doi (re-run after minting)`,
      );
    const result = await publishGig(put, gig, pubUri, createdAt, collectionDoi);
    state.gigs[gig.slug] = {
      documentUri: result.document.uri,
      documentCid: result.document.cid,
      researchOutputUri: result.researchOutput.uri,
      researchOutputCid: result.researchOutput.cid,
      contentHash: gig.contentHash,
      doi: gig.doi,
      createdAt,
    };
    published++;
    dataciteLinks.push(`${gig.slug}\t${result.dataciteRelatedIdentifier}`);
    console.log(
      `  ${WRITE ? "✓" : "·"} ${gig.slug}: document + research-output${gig.doi ? ` (doi ${gig.doi})` : ""}`,
    );
  }

  if (WRITE) saveState(state);

  console.log(`\natproto livecoding: ${published} published, ${skipped} unchanged`);
  console.log("\nDataCite relatedIdentifier per gig (carry the document AT-URI):");
  for (const line of dataciteLinks) console.log(`  ${line}`);
  if (!WRITE)
    console.log("\n(dry run — CIDs are placeholders; re-run with --write to mint records)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
