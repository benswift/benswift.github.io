// Post-build CSP hash injection.
//
// Astro's static build emits a handful of small inline scripts: the
// astro-island web-component runtime, per-client-directive loaders
// (Astro.only, Astro.load, …), and the bundled bodies of small <script>
// blocks from .astro components. Our meta-tag CSP has script-src without
// 'unsafe-inline', so each of those needs to be listed by SHA-256 hash for
// the browser to execute it.
//
// This script walks dist/, collects the unique inline-script bodies,
// computes sha256-<base64> for each, and rewrites the
// Content-Security-Policy <meta> in every HTML file to include all of them.
// Astro's own security.csp would do this automatically — but it's
// incompatible with the ClientRouter and Shiki we already use, so we do it
// ourselves.
//
// Run from package.json's build script, between `astro build` and `pagefind`.

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const DIST = resolve(import.meta.dirname, "..", "dist");

function sha256Base64(s: string): string {
  return createHash("sha256").update(s, "utf8").digest("base64");
}

// Match <script>...</script> where the opening tag has no src attribute.
const inlineScriptRe = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;

// Match the CSP meta tag's content attribute.
const cspMetaRe = /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"\s*\/?>/i;

function rewriteScriptSrc(csp: string, hashes: Set<string>): string {
  // Find the script-src directive (terminates at ; or end of string) and
  // append the hashes. Order within a directive doesn't matter for CSP.
  return csp.replace(/(script-src[^;]*)(;|$)/, (_, directive: string, sep: string) => {
    const additions = [...hashes].map((h) => `'sha256-${h}'`).join(" ");
    return `${directive.trim()} ${additions}${sep}`;
  });
}

async function main() {
  // Enumerate every html file under dist/.
  const list = execSync(`find ${DIST} -name '*.html' -type f`, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);

  // First pass: collect every distinct inline-script body across the site.
  // Using a single union keeps the CSP simple — extra unused hashes are
  // harmless.
  const allHashes = new Set<string>();
  for (const file of list) {
    const html = await readFile(file, "utf8");
    for (const m of html.matchAll(inlineScriptRe)) {
      const body = m[2];
      if (!body.trim()) continue;
      allHashes.add(sha256Base64(body));
    }
  }

  if (allHashes.size === 0) {
    console.log("[csp-hashes] no inline scripts found — nothing to inject");
    return;
  }

  console.log(`[csp-hashes] hashing ${allHashes.size} unique inline script(s)`);

  // Second pass: rewrite the CSP meta on every page that has one.
  let touched = 0;
  for (const file of list) {
    const html = await readFile(file, "utf8");
    const match = html.match(cspMetaRe);
    if (!match) continue;
    const oldCsp = match[1];
    if (!oldCsp || /script-src[^;]*'sha256-/.test(oldCsp)) continue; // already injected
    const newCsp = rewriteScriptSrc(oldCsp, allHashes);
    if (newCsp === oldCsp) continue;
    const newHtml = html.replace(
      cspMetaRe,
      `<meta http-equiv="Content-Security-Policy" content="${newCsp}">`,
    );
    await writeFile(file, newHtml);
    touched += 1;
  }
  console.log(`[csp-hashes] updated CSP on ${touched} page(s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
