import path from "node:path";
import { discoverPosts } from "./lib/posts";
import { readSyndication, writeSyndication } from "./lib/syndication";

/**
 * One-time seed: mark every existing post published before a cutoff date as
 * already cross-posted, so enabling Bluesky cross-posting does not retroactively
 * announce the back catalogue. Posts dated on or after the cutoff stay eligible.
 *
 * Usage: pnpm exec tsx scripts/seed-syndication.ts [YYYY-MM-DD]
 * Default cutoff is 2026-06-06 (the first post we want to cross-post).
 */
const cutoff = process.argv[2] ?? "2026-06-06";
const blogDir = path.resolve(import.meta.dirname, "..", "src/content/blog");
const syndicationPath = path.resolve(import.meta.dirname, "..", "atproto-syndication.json");

const state = readSyndication(syndicationPath);
const posts = discoverPosts(blogDir);

let seeded = 0;
for (const post of posts) {
  if (post.date < cutoff && !(post.path in state.posts)) {
    state.posts[post.path] = { seeded: true };
    seeded++;
  }
}

writeSyndication(syndicationPath, state);

const eligible = posts.filter((p) => !(p.path in state.posts));
console.log(
  `Seeded ${seeded} post(s) as already-syndicated (date < ${cutoff}). ` +
    `${eligible.length} post(s) eligible to cross-post:`,
);
for (const p of eligible) console.log(`  - ${p.path}`);
