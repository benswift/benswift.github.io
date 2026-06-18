#!/usr/bin/env pnpm exec tsx
// Backfill Wayback Machine snapshots of each gig's event_url / venue_url into
// the archived_event_url / archived_venue_url frontmatter fields (TASK-23).
//
//   pnpm exec tsx scripts/archive-event-urls.ts            # dry run (default)
//   pnpm exec tsx scripts/archive-event-urls.ts --write    # query, Save-Page-Now, write frontmatter
//   pnpm exec tsx scripts/archive-event-urls.ts --write --no-spn  # only record existing snapshots
//   pnpm exec tsx scripts/archive-event-urls.ts --write --force   # re-archive even if already set
//
// Idempotent: by default skips URLs that already have an archived_* value.
// The Wayback capture date is embedded in the snapshot URL (/web/<timestamp>/).

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const WRITE = process.argv.includes("--write");
const FORCE = process.argv.includes("--force");
const NO_SPN = process.argv.includes("--no-spn");
const LIVECODING_DIR = path.resolve(process.cwd(), "src/content/livecoding");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Snapshot {
  archivedUrl: string;
  timestamp: string;
}

/** Query the Wayback availability API for the closest existing snapshot. */
async function waybackAvailable(url: string): Promise<Snapshot | null> {
  const api = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      archived_snapshots?: { closest?: { available?: boolean; url?: string; timestamp?: string } };
    };
    const snap = json.archived_snapshots?.closest;
    if (snap?.available && snap.url && snap.timestamp) {
      return { archivedUrl: snap.url.replace(/^http:/, "https:"), timestamp: snap.timestamp };
    }
  } catch {
    /* network/timeout — treat as no snapshot */
  }
  return null;
}

/** Trigger Save Page Now, then re-query availability for the fresh snapshot. */
async function savePageNow(url: string): Promise<Snapshot | null> {
  try {
    await fetch(`https://web.archive.org/save/${url}`, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    /* SPN is slow/rate-limited; ignore and re-query below */
  }
  await sleep(5_000);
  return waybackAvailable(url);
}

/** Insert or (with --force) replace a frontmatter field directly after its anchor line. */
function setField(raw: string, anchorKey: string, newKey: string, value: string): string {
  const line = `${newKey}: "${value}"`;
  const existing = new RegExp(`^${newKey}:.*$`, "m");
  if (existing.test(raw)) return raw.replace(existing, line);
  const anchor = new RegExp(`^(${anchorKey}:.*)$`, "m");
  return raw.replace(anchor, `$1\n${line}`);
}

const TARGETS = [
  { urlKey: "event_url", archivedKey: "archived_event_url" },
  { urlKey: "venue_url", archivedKey: "archived_venue_url" },
] as const;

async function main() {
  const files = fs
    .readdirSync(LIVECODING_DIR)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .toSorted();

  let archived = 0;
  let viaSpn = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(LIVECODING_DIR, file);
    let raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw) as unknown as { data: Record<string, string | undefined> };
    let changed = false;

    for (const { urlKey, archivedKey } of TARGETS) {
      const url = data[urlKey];
      if (!url) continue;
      if (data[archivedKey] && !FORCE) {
        skipped++;
        continue;
      }

      let snap = await waybackAvailable(url);
      let source = "existing snapshot";
      if (!snap && WRITE && !NO_SPN) {
        snap = await savePageNow(url);
        source = "Save Page Now";
        if (snap) viaSpn++;
        await sleep(6_000); // be gentle with anonymous SPN rate limits
      }

      if (!snap) {
        failed++;
        console.log(
          `  ✗ ${file} ${urlKey}: no snapshot${WRITE ? " (SPN failed)" : " (would SPN)"} — ${url}`,
        );
        continue;
      }

      archived++;
      console.log(`  ✓ ${file} ${archivedKey} ← ${snap.timestamp} (${source})`);
      if (WRITE) {
        raw = setField(raw, urlKey, archivedKey, snap.archivedUrl);
        changed = true;
      }
    }

    if (changed) fs.writeFileSync(filePath, raw, "utf8");
  }

  console.log(
    `\n${WRITE ? "Wrote" : "Dry run"}: ${archived} archived (${viaSpn} via SPN), ${skipped} skipped, ${failed} without a snapshot.`,
  );
  if (!WRITE)
    console.log("Re-run with --write to Save-Page-Now missing snapshots and update frontmatter.");
}

main();
