import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { discoverPosts, pathToSlugKey } from "./lib/posts";

const execFileP = promisify(execFile);

const PREVIEW_PORT = 4399;
const PREVIEW_BASE = `http://localhost:${PREVIEW_PORT}`;
const HEROES_DIR = path.resolve(import.meta.dirname, "..", "src/assets/heroes");
const DEFAULT_HERO = path.resolve(import.meta.dirname, "..", "src/assets/og-default.avif");
const BLOG_DIR = path.resolve(import.meta.dirname, "..", "src/content/blog");
const SETTLE_MS = 400;
const CARD_SIZE = ["1280", "640"];

async function waitForServer(url: string, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await delay(250);
  }
  throw new Error(`Preview server did not start in ${timeoutMs}ms`);
}

async function ab(args: string[]) {
  await execFileP("agent-browser", args, {
    env: { ...process.env, AGENT_BROWSER_ARGS: "--no-sandbox" },
  });
}

async function main() {
  if (!fs.existsSync(path.resolve(import.meta.dirname, "..", "dist"))) {
    throw new Error("dist/ not found — run `pnpm build` before generating hero images.");
  }

  // By default generate heroes only for posts that don't have one yet, so new
  // posts get a hero without clobbering existing art on unrelated content edits.
  // Pass --force to regenerate every post (e.g. after changing the wall), or
  // --default to regenerate the site-wide fallback hero from the home page.
  const force = process.argv.includes("--force") || process.argv.includes("--all");
  const workList: { path: string; out: string }[] = [];
  if (process.argv.includes("--default")) {
    workList.push({ path: "", out: DEFAULT_HERO });
  } else {
    const posts = discoverPosts(BLOG_DIR).map((p) => ({
      path: p.path,
      out: path.join(HEROES_DIR, `${pathToSlugKey(p.path)}.avif`),
    }));
    workList.push(...(force ? posts : posts.filter((p) => !fs.existsSync(p.out))));
    console.log(
      force
        ? `Regenerating all ${workList.length} hero(es).`
        : `${workList.length} post(s) missing a hero (${posts.length - workList.length} already have one).`,
    );
  }

  if (workList.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  fs.mkdirSync(HEROES_DIR, { recursive: true });

  const preview = spawn("pnpm", ["exec", "astro", "preview", "--port", String(PREVIEW_PORT)], {
    stdio: "inherit",
    detached: true,
  });
  try {
    await waitForServer(`${PREVIEW_BASE}/`);

    for (const { path: pagePath, out } of workList) {
      // `?wall-capture` has the page show its typed wall alone, full and
      // still (see wall-typist.ts).
      const url = `${PREVIEW_BASE}${pagePath}/?wall-capture`;
      const tmpPng = out.replace(/\.avif$/, ".png");
      console.log(`→ ${url} → ${out}`);

      await ab(["open", url]);
      await ab(["set", "viewport", ...CARD_SIZE]);
      await ab(["wait", "--load", "networkidle"]);
      await ab(["wait", "[data-wall-capture] .wall"]);
      await ab(["wait", String(SETTLE_MS)]);
      await ab(["screenshot", ".wall", tmpPng]);
      await execFileP("avifenc", ["-s", "0", "-q", "90", "-y", "444", "-j", "all", tmpPng, out]);
      fs.unlinkSync(tmpPng);
    }

    console.log(`Generated ${workList.length} hero images.`);
  } finally {
    await ab(["close"]).catch(() => {});
    if (preview.pid) {
      try {
        process.kill(-preview.pid);
      } catch {
        // already dead
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
