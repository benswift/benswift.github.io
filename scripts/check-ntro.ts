#!/usr/bin/env pnpm exec tsx
// Compare each src/content/ntro/*.md against the matching `ntro:` block in a
// cybernetics-website checkout (_projects/*.md), matched by `ntro.key`, and
// print any differences in title, DOI, authors, year, category, designation,
// licence or FoR codes. Read-only: it never writes to either repo. Exits 1 on
// any difference. Not part of build or CI (the other repo isn't present there).
//
//   pnpm ntro:check                                  # ~/projects/cybernetics-website
//   pnpm ntro:check ~/path/to/cybernetics-website
//   CYBERNETICS_WEBSITE=~/path pnpm ntro:check
//
// Also validates every local record against the collection schema.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ntroSchema } from "../src/utils/content-schemas";
import { parseFrontmatter } from "./lib/frontmatter";
import { compareNtro, type RemoteNtro } from "./lib/ntro-check";

const expand = (p: string) => (p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);
const siteDir = expand(
  process.argv[2] ?? process.env.CYBERNETICS_WEBSITE ?? "~/projects/cybernetics-website",
);
const projectsDir = path.join(siteDir, "_projects");
const localDir = path.join(import.meta.dirname, "..", "src", "content", "ntro");

if (!fs.existsSync(projectsDir)) {
  console.error(`no _projects directory at ${projectsDir}`);
  process.exit(2);
}

const remote = new Map<string, { file: string; ntro: RemoteNtro }>();
for (const f of fs.readdirSync(projectsDir).filter((n) => n.endsWith(".md"))) {
  const { data } = parseFrontmatter<{ ntro?: RemoteNtro }>(
    fs.readFileSync(path.join(projectsDir, f), "utf8"),
  );
  if (data.ntro) remote.set(data.ntro.key, { file: f, ntro: data.ntro });
}

let problems = 0;
const seen = new Set<string>();
const localFiles = fs
  .readdirSync(localDir)
  .filter((n) => n.endsWith(".md"))
  .toSorted();
for (const f of localFiles) {
  const { data } = parseFrontmatter(fs.readFileSync(path.join(localDir, f), "utf8"));
  const parsed = ntroSchema.safeParse(data);
  if (!parsed.success) {
    problems++;
    console.log(`${f}: fails the ntro schema: ${parsed.error.message}`);
    continue;
  }
  const local = parsed.data;
  seen.add(local.key);
  const match = remote.get(local.key);
  if (!match) {
    problems++;
    console.log(`${f}: no cybernetics-website page has ntro.key "${local.key}"`);
    continue;
  }
  const diffs = compareNtro(local, match.ntro);
  if (diffs.length === 0) {
    console.log(`${f}: ok (${match.file})`);
    continue;
  }
  problems += diffs.length;
  console.log(`${f}: differs from ${match.file}`);
  for (const d of diffs) console.log(`  ${d}`);
}
for (const [key, { file }] of remote) {
  if (seen.has(key)) continue;
  problems++;
  console.log(`${file}: ntro.key "${key}" has no src/content/ntro record`);
}

if (problems > 0) {
  console.log(`\n${problems} difference(s)`);
  process.exit(1);
}
console.log("\nall NTRO records agree");
