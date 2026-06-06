import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { discoverPosts, pathToRkey } from "./lib/posts";

const execFileP = promisify(execFile);

const PREVIEW_PORT = 4399;
const PREVIEW_BASE = `http://localhost:${PREVIEW_PORT}`;
const HEROES_DIR = path.resolve(import.meta.dirname, "..", "src/assets/heroes");
const BLOG_DIR = path.resolve(import.meta.dirname, "..", "src/content/blog");
const SETTLE_MS = 4000;

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
  // Pass --force to regenerate every post (e.g. after changing the canvas).
  const force = process.argv.includes("--force") || process.argv.includes("--all");
  const posts = discoverPosts(BLOG_DIR);

  const workList = force
    ? posts
    : posts.filter((p) => !fs.existsSync(path.join(HEROES_DIR, `${pathToRkey(p.path)}.avif`)));

  console.log(
    force
      ? `Regenerating all ${workList.length} hero(es).`
      : `${workList.length} post(s) missing a hero (${posts.length - workList.length} already have one).`,
  );

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

    // The first WebGL hero in a fresh browser captures blank — the GL context
    // isn't presented in time for the screenshot. Prime it with one throwaway
    // load so every capture below is warm.
    await ab(["open", `${PREVIEW_BASE}${workList[0]!.path}/`]);
    await ab(["wait", "--load", "networkidle"]);
    await ab(["wait", ".hero-canvas"]);
    await ab(["wait", String(SETTLE_MS)]);

    for (const post of workList) {
      const slug = pathToRkey(post.path);
      const url = `${PREVIEW_BASE}${post.path}/`;
      const tmpPng = path.join(HEROES_DIR, `${slug}.png`);
      const out = path.join(HEROES_DIR, `${slug}.avif`);
      console.log(`→ ${url} → ${out}`);

      await ab(["open", url]);
      await ab(["wait", "--load", "networkidle"]);
      await ab(["wait", ".hero-canvas"]);
      await ab(["wait", String(SETTLE_MS)]);
      await ab(["screenshot", ".hero-canvas", tmpPng]);
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
