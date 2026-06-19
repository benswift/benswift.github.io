#!/usr/bin/env pnpm exec tsx
// Publish our own atproto lexicon schemas (TASK-23.10 follow-up).
//
// Each JSON file under lexicons/ is put into the repo as a
// com.atproto.lexicon.schema record, keyed by its NSID. Together with a DNS
// TXT record at _lexicon.<authority> pointing to this DID, that makes the NSID
// resolvable and validatable by other actors — i.e. a *published* lexicon
// rather than a self-asserted one.
//
//   me.benswift.researchOutput  ->  DNS: _lexicon.benswift.me  TXT  "did=<did>"
//
// Run via `mise exec --` so the atproto creds are in the env:
//   mise exec -- pnpm exec tsx scripts/publish-lexicon.ts            # dry run
//   mise exec -- pnpm exec tsx scripts/publish-lexicon.ts --write
//
// Idempotent: putRecord overwrites in place, so re-running with an edited
// lexicon just updates the schema record.

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { AtpAgent } from "@atproto/api";

net.setDefaultAutoSelectFamily(true);
net.setDefaultAutoSelectFamilyAttemptTimeout(500);

const WRITE = process.argv.includes("--write");
const SERVICE = process.argv.includes("--service")
  ? process.argv[process.argv.indexOf("--service") + 1]
  : "https://bsky.social";

const LEXICON_DIR = path.resolve(process.cwd(), "lexicons");
const SCHEMA_NSID = "com.atproto.lexicon.schema";

/** Every *.json under lexicons/, recursively. */
function discoverLexicons(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? discoverLexicons(path.join(dir, e.name))
        : e.name.endsWith(".json")
          ? [path.join(dir, e.name)]
          : [],
    );
}

async function main() {
  const files = discoverLexicons(LEXICON_DIR).toSorted();
  console.log(`publish-lexicon — mode: ${WRITE ? "WRITE" : "dry run"} — ${files.length} schema(s)`);

  let put: (nsid: string, record: Record<string, unknown>) => Promise<string>;
  if (WRITE) {
    const identifier = process.env.ATP_IDENTIFIER;
    const password = process.env.ATP_APP_PASSWORD;
    if (!identifier || !password)
      throw new Error("ATP_IDENTIFIER and ATP_APP_PASSWORD required — run via 'mise exec --'");
    const agent = new AtpAgent({ service: SERVICE });
    await agent.login({ identifier, password });
    const did = agent.session!.did;
    put = async (nsid, record) => {
      const res = await agent.com.atproto.repo.putRecord({
        repo: did,
        collection: SCHEMA_NSID,
        rkey: nsid,
        record,
      });
      return res.data.uri;
    };
  } else {
    put = async (nsid, record) => {
      console.log(`    ${SCHEMA_NSID}/${nsid}: ${JSON.stringify(record).slice(0, 120)}…`);
      return `at://did:plc:UNKNOWN/${SCHEMA_NSID}/${nsid}`;
    };
  }

  for (const file of files) {
    const lexicon = JSON.parse(fs.readFileSync(file, "utf8"));
    const nsid: string = lexicon.id;
    if (!nsid) throw new Error(`${file} has no "id" — not a lexicon document`);
    const record = { $type: SCHEMA_NSID, ...lexicon };
    const uri = await put(nsid, record);
    console.log(`  ${WRITE ? "✓" : "·"} ${nsid} -> ${uri}`);
  }

  if (!WRITE) console.log("\n(dry run — re-run with --write to publish the schema records)");
  console.log(
    '\nRemember the DNS half: add a TXT record at _lexicon.<authority> = "did=<your-did>"\n' +
      '  e.g.  _lexicon.benswift.me  TXT  "did=did:plc:tevykrhi4kibtsipzci76d76"',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
