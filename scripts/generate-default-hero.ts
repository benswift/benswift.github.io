import { execFile, spawn } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

const PREVIEW_PORT = 4399;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}/`;
const OUTPUT_PATH = path.resolve(import.meta.dirname, "..", "src/assets/og-default.png");
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
  const preview = spawn("pnpm", ["exec", "astro", "preview", "--port", String(PREVIEW_PORT)], {
    stdio: "inherit",
    detached: true,
  });

  try {
    await waitForServer(PREVIEW_URL);

    await ab(["open", PREVIEW_URL]);
    await ab(["wait", "--load", "networkidle"]);
    await ab(["wait", String(SETTLE_MS)]);
    await ab(["screenshot", ".hero-canvas", OUTPUT_PATH]);

    console.log(`Wrote ${OUTPUT_PATH}`);
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
