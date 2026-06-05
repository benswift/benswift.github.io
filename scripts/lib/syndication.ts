import fs from "node:fs";

/**
 * Records which blog posts have already been cross-posted to Bluesky.
 *
 * This is deliberately a SEPARATE file from atproto-state.json. That file's
 * `contentHashes` are a disposable content-diff cache that gets reset to force
 * record backfills; if syndication keyed off it, a backfill would re-announce
 * every post. Syndication state is durable and must never be reset.
 *
 * Entries are either a real reference to the created Bluesky post, or a
 * `{ seeded: true }` marker for posts that predate the feature (so they are
 * treated as already-handled and never announced retroactively).
 */
export interface SyndicationRef {
  uri: string;
  cid: string;
  syndicatedAt: string;
}

export type SyndicationEntry = SyndicationRef | { seeded: true };

export interface SyndicationState {
  posts: Record<string, SyndicationEntry>;
}

export function readSyndication(statePath: string): SyndicationState {
  if (!fs.existsSync(statePath)) return { posts: {} };
  const parsed = JSON.parse(fs.readFileSync(statePath, "utf8")) as Partial<SyndicationState>;
  return { posts: parsed.posts ?? {} };
}

export function writeSyndication(statePath: string, state: SyndicationState): void {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
}

/** True if the post has already been cross-posted or seeded as handled. */
export function isSyndicated(state: SyndicationState, postPath: string): boolean {
  return postPath in state.posts;
}

/** The Bluesky post reference for a post, if one was actually created. */
export function syndicationRef(
  state: SyndicationState,
  postPath: string,
): { uri: string; cid: string } | undefined {
  const entry = state.posts[postPath];
  return entry && "uri" in entry ? { uri: entry.uri, cid: entry.cid } : undefined;
}
