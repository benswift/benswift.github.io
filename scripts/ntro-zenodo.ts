#!/usr/bin/env pnpm exec tsx
// Compare each src/content/ntro/*.md with its Zenodo record (the latest
// version its concept DOI resolves to) and, with --update, push this repo's
// values to Zenodo in place: title, creators in order (and ORCIDs the record
// gives), publication_date, license, upload_type, and every related-work DOI
// as a related identifier. Same DOI, no new version.
//
// Production only (zenodo.org): the NTRO records don't exist on the sandbox.
// Run via `mise exec --` so ZENODO_ACCESS_TOKEN is in the env:
//   mise exec -- pnpm ntro:zenodo                          # compare (read-only)
//   mise exec -- pnpm ntro:zenodo --update                 # push every difference
//   mise exec -- pnpm ntro:zenodo --update --only panic
//   mise exec -- pnpm ntro:zenodo --publish --only <slug>  # update and publish a draft
//
// Comparing published records needs no token. A DOI with no published record
// is read as a draft through the authenticated Deposit API and reported as
// "draft, unpublished". --update edits a published record (actions/edit, PUT
// the managed fields onto the deposition's own metadata, actions/publish, or
// actions/discard on failure) and updates a draft's metadata without
// publishing it. Exits 1 on any difference (compare) or failure (--update).

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import type { z } from "astro/zod";
import { ntroSchema } from "../src/utils/content-schemas";
import { parseFrontmatter } from "./lib/frontmatter";
import {
  applyNtro,
  diffNtroZenodo,
  fromDeposition,
  fromRecord,
  type ZenodoMeta,
} from "./lib/ntro-zenodo";
import { depositionIdFromDoi, setFrontmatterField, zenodoClient, ZenodoError } from "./lib/zenodo";

// Happy Eyeballs, as in zenodo-deposit.ts.
net.setDefaultAutoSelectFamily(true);
net.setDefaultAutoSelectFamilyAttemptTimeout(500);

type Ntro = z.infer<typeof ntroSchema>;

const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const onlyAt = argv.indexOf("--only");
const ONLY = onlyAt >= 0 ? argv[onlyAt + 1] : undefined;
const PUBLISH = has("--publish");
const UPDATE = has("--update") || PUBLISH;

const known = new Set(["--update", "--publish", "--only", ONLY]);
const unknown = argv.filter((a) => !known.has(a));
if (unknown.length || (onlyAt >= 0 && !ONLY)) {
  console.error(
    `usage: ntro:zenodo [--update] [--publish] [--only <slug>] (got ${argv.join(" ")})`,
  );
  process.exit(2);
}
if (PUBLISH && !ONLY) {
  console.error("--publish publishes one draft: name it with --only <slug>");
  process.exit(2);
}

const BASE = "https://zenodo.org";
const TOKEN = process.env.ZENODO_ACCESS_TOKEN;
if (UPDATE && !TOKEN) {
  console.error("--update needs ZENODO_ACCESS_TOKEN: run via 'mise exec --'");
  process.exit(2);
}
const zenodo = zenodoClient(TOKEN);
const ntroDir = path.join(import.meta.dirname, "..", "src", "content", "ntro");

interface Remote {
  meta: ZenodoMeta;
  draft: boolean;
  /** Record id of the latest version (published) or the draft's deposition id. */
  id: number;
  doi: string;
}

/** The record a concept DOI resolves to, or the draft behind a reserved DOI. */
async function fetchRemote(doi: string): Promise<Remote> {
  const id = depositionIdFromDoi(doi);
  if (!id) throw new Error(`"${doi}" is not a Zenodo DOI`);
  try {
    const record = await zenodo("GET", `${BASE}/api/records/${id}`);
    return { meta: fromRecord(record), draft: false, id: record.id, doi: record.doi };
  } catch (err) {
    if (!(err instanceof ZenodoError && err.status === 404)) throw err;
  }
  if (!TOKEN)
    throw new Error(
      `no published record for ${doi}; reading it as a draft needs ZENODO_ACCESS_TOKEN (run via 'mise exec --')`,
    );
  const dep = await zenodo("GET", `${BASE}/api/deposit/depositions/${id}`);
  return { meta: fromDeposition(dep), draft: !dep.submitted, id: dep.id, doi };
}

/** Edit a published record in place; discards the edit on any failure. */
async function updatePublished(slug: string, local: Ntro, remote: Remote) {
  const url = `${BASE}/api/deposit/depositions/${remote.id}`;
  // A 400 here usually means the record is already open for editing (e.g. in
  // the web UI): stop rather than overwrite or discard someone else's edit.
  await zenodo("POST", `${url}/actions/edit`);
  try {
    const dep = await zenodo("GET", url);
    const fields = diffNtroZenodo(local, fromDeposition(dep)).map((d) => d.field);
    if (!fields.length) {
      await zenodo("POST", `${url}/actions/discard`);
      console.log(`  ${slug}: the deposition already agrees; nothing pushed`);
      return;
    }
    await zenodo("PUT", url, { metadata: applyNtro(dep.metadata, local, fields) });
    const published = await zenodo("POST", `${url}/actions/publish`);
    console.log(
      `  ${slug}: updated in place (${fields.join(", ")}) → ${BASE}/doi/${published?.doi ?? remote.doi}`,
    );
  } catch (err) {
    await zenodo("POST", `${url}/actions/discard`).catch((e: Error) =>
      console.error(`  ${slug}: discarding the edit also failed: ${e.message}`),
    );
    throw err;
  }
}

/**
 * Update a draft's metadata and, with --publish, publish it, then point the
 * record's `doi` at the new concept DOI (the reserved DOI becomes the first
 * version's).
 */
async function updateDraft(slug: string, file: string, local: Ntro, remote: Remote) {
  const url = `${BASE}/api/deposit/depositions/${remote.id}`;
  const dep = await zenodo("GET", url);
  const fields = diffNtroZenodo(local, fromDeposition(dep)).map((d) => d.field);
  if (fields.length) {
    await zenodo("PUT", url, { metadata: applyNtro(dep.metadata, local, fields) });
    console.log(`  ${slug}: updated the draft (${fields.join(", ")})`);
  }
  if (!PUBLISH) {
    if (fields.length) console.log(`  ${slug}: left unpublished (--publish --only ${slug})`);
    return;
  }
  const published = await zenodo("POST", `${url}/actions/publish`);
  console.log(`  ${slug}: published → ${BASE}/doi/${published.doi}`);
  if (published.conceptdoi && published.conceptdoi !== local.doi) {
    let raw = fs.readFileSync(file, "utf8");
    raw = setFrontmatterField(raw, "year", "doi", published.conceptdoi);
    raw = setFrontmatterField(raw, "doi", "latest_version_doi", published.doi);
    fs.writeFileSync(file, raw, "utf8");
    console.log(
      `  ${slug}: doi is now the concept DOI ${published.conceptdoi}; commit it and update the cybernetics-website copy (pnpm ntro:check)`,
    );
  }
}

async function main() {
  console.log(
    `NTRO ↔ Zenodo, production (${BASE}): ${UPDATE ? `UPDATE${PUBLISH ? " + publish draft" : ""}` : "compare only (--update pushes differences)"}`,
  );
  const slugs = fs
    .readdirSync(ntroDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.slice(0, -3))
    .filter((s) => !ONLY || s === ONLY)
    .toSorted();
  if (!slugs.length) {
    console.error(`no ntro record "${ONLY}"`);
    process.exit(2);
  }

  let problems = 0;
  for (const slug of slugs) {
    const file = path.join(ntroDir, `${slug}.md`);
    const parsed = ntroSchema.safeParse(parseFrontmatter(fs.readFileSync(file, "utf8")).data);
    if (!parsed.success) {
      problems++;
      console.log(`${slug}: fails the ntro schema: ${parsed.error.message}`);
      continue;
    }
    const local = parsed.data;
    try {
      const remote = await fetchRemote(local.doi);
      const diffs = diffNtroZenodo(local, remote.meta);
      const where = remote.draft
        ? `draft, unpublished: deposition ${remote.id}`
        : `latest version ${remote.doi}`;
      console.log(`${slug}: ${diffs.length ? "differs" : "OK"} (${where})`);
      for (const d of diffs) console.log(`  ${d.message}`);
      if (!UPDATE) {
        if (diffs.length) problems++;
      } else if (remote.draft) {
        await updateDraft(slug, file, local, remote);
      } else if (diffs.length) {
        await updatePublished(slug, local, remote);
      } else if (PUBLISH) {
        console.log(`  ${slug}: already published`);
      }
    } catch (err) {
      problems++;
      console.log(`${slug}: ${(err as Error).message}`);
    }
  }

  if (problems) {
    console.log(`\n${problems} record(s) ${UPDATE ? "failed" : "differ or couldn't be read"}`);
    process.exit(1);
  }
  console.log(UPDATE ? "\ndone" : "\nall NTRO records agree with Zenodo");
}

await main();
