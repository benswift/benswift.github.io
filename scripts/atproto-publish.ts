import path from "node:path";
import fs from "node:fs";
import { discoverPosts, pathToRkey } from "./lib/posts";
import { readState, writeState, type AtprotoState } from "./lib/state";
import { isSyndicated, readSyndication, syndicationRef, writeSyndication } from "./lib/syndication";
import { createClient, type AtprotoClient } from "./lib/atproto";

export interface PublishConfig {
  blogDir: string;
  statePath: string;
  wellKnownDir: string;
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  /** When true, announce eligible new posts to Bluesky. */
  crossPost: boolean;
  syndicationPath: string;
  heroesDir: string;
  defaultOgPath: string;
}

const defaultConfig: PublishConfig = {
  blogDir: path.resolve(import.meta.dirname, "..", "src/content/blog"),
  statePath: path.resolve(import.meta.dirname, "..", "atproto-state.json"),
  wellKnownDir: path.resolve(import.meta.dirname, "..", "public", ".well-known"),
  siteUrl: "https://benswift.me",
  siteName: "benswift.me",
  siteDescription: "Ben Swift — researcher, educator, artist, developer",
  crossPost: process.env.BLUESKY_CROSSPOST === "1",
  syndicationPath: path.resolve(import.meta.dirname, "..", "atproto-syndication.json"),
  heroesDir: path.resolve(import.meta.dirname, "..", "src/assets/heroes"),
  defaultOgPath: path.resolve(import.meta.dirname, "..", "src/assets/og-default.avif"),
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Bluesky posts cap at 300 graphemes; descriptions are short, but guard anyway. */
function skeetText(text: string): string {
  return text.length <= 300 ? text : text.slice(0, 297) + "…";
}

/** Card thumbnail source: the post's own hero image, falling back to the default OG image. */
function resolveThumbPath(config: PublishConfig, rkey: string): string {
  const hero = path.join(config.heroesDir, `${rkey}.avif`);
  return fs.existsSync(hero) ? hero : config.defaultOgPath;
}

export async function publish(client: AtprotoClient, config: PublishConfig = defaultConfig) {
  const state = readState(config.statePath);
  const oldHashes = state?.contentHashes ?? {};
  const syndication = readSyndication(config.syndicationPath);

  const pubAtUri = await client.ensurePublication({
    url: config.siteUrl,
    name: config.siteName,
    description: config.siteDescription,
  });

  fs.mkdirSync(config.wellKnownDir, { recursive: true });
  fs.writeFileSync(path.join(config.wellKnownDir, "site.standard.publication"), pubAtUri + "\n");

  const posts = discoverPosts(config.blogDir);
  let created = 0;
  let updated = 0;
  let unchanged = 0;
  let crossPosted = 0;
  let crossPostFailed = 0;

  for (const post of posts) {
    const rkey = pathToRkey(post.path);
    const contentChanged = oldHashes[post.path] !== post.contentHash;
    const isNew = !(post.path in oldHashes);
    const eligible = config.crossPost && post.crosspost && !isSyndicated(syndication, post.path);

    // Cross-post before writing the document so it can reference the Bluesky post.
    // Preserve any existing reference so editing an announced post keeps the link.
    let ref = syndicationRef(syndication, post.path);
    let crossPostSucceeded = false;
    if (eligible) {
      try {
        const skeet = await client.createSkeet({
          // The card already carries the title; lead with the post's description
          // so the skeet text isn't just a repeat of the card headline.
          text: skeetText(post.description || post.title),
          url: `${config.siteUrl}${post.path}/`,
          title: post.title,
          thumbPath: resolveThumbPath(config, rkey),
        });
        ref = { uri: skeet.uri, cid: skeet.cid };
        syndication.posts[post.path] = {
          uri: skeet.uri,
          cid: skeet.cid,
          syndicatedAt: new Date().toISOString(),
        };
        crossPosted++;
        crossPostSucceeded = true;
        console.log(`  bluesky: cross-posted ${post.path} -> ${skeet.uri}`);
      } catch (error) {
        crossPostFailed++;
        console.error(
          `  bluesky: cross-post failed for ${post.path}:`,
          error instanceof Error ? error.message : error,
        );
      }
    }

    if (!contentChanged && !crossPostSucceeded) {
      unchanged++;
      continue;
    }

    await client.putDocument(rkey, {
      title: post.title,
      site: pubAtUri,
      path: post.path,
      textContent: post.textContent,
      publishedAt: `${post.date}T00:00:00.000Z`,
      description: post.description,
      tags: post.tags.length ? post.tags : undefined,
      bskyPostRef: ref,
    });

    if (contentChanged) {
      if (isNew) created++;
      else updated++;
    }

    await sleep(100);
  }

  const newState: AtprotoState = {
    did: client.did,
    publicationAtUri: pubAtUri,
    contentHashes: Object.fromEntries(posts.map((p) => [p.path, p.contentHash])),
  };
  writeState(config.statePath, newState);
  if (config.crossPost) writeSyndication(config.syndicationPath, syndication);

  const bluesky = config.crossPost
    ? `; bluesky: ${crossPosted} cross-posted${crossPostFailed ? `, ${crossPostFailed} failed` : ""}`
    : "";
  console.log(
    `atproto publish: ${created} new, ${updated} updated, ${unchanged} unchanged${bluesky}`,
  );
}

async function main() {
  const identifier = process.env.ATP_IDENTIFIER;
  const password = process.env.ATP_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error("ATP_IDENTIFIER and ATP_APP_PASSWORD env vars required");
  }

  const client = await createClient("https://bsky.social", identifier, password);
  await publish(client);
}

if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
