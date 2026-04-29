import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { discoverPosts, pathToRkey } from "./lib/posts";
import { readState } from "./lib/state";

const execFileP = promisify(execFile);

const PREVIEW_PORT = 4399;
const PREVIEW_BASE = `http://localhost:${PREVIEW_PORT}`;
const HEROES_DIR = path.resolve(import.meta.dirname, "..", "src/assets/heroes");
const STATE_PATH = path.resolve(import.meta.dirname, "..", "atproto-state.json");
const BLOG_DIR = path.resolve(import.meta.dirname, "..", "blog");
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

  const state = readState(STATE_PATH);
  const oldHashes = state?.contentHashes ?? {};
  const posts = discoverPosts(BLOG_DIR);

  const workList = posts.filter((p) => oldHashes[p.path] !== p.contentHash);

  console.log(
    `${workList.length} posts to regenerate (${posts.length - workList.length} unchanged).`,
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

    for (const post of workList) {
      const slug = pathToRkey(post.path);
      const url = `${PREVIEW_BASE}${post.path}/`;
      const out = path.join(HEROES_DIR, `${slug}.png`);
      console.log(`→ ${url} → ${out}`);

      await ab(["open", url]);
      await ab(["wait", "--load", "networkidle"]);
      await ab(["wait", String(SETTLE_MS)]);
      await ab(["screenshot", ".hero-canvas", out]);
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
