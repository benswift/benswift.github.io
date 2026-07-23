import path from "node:path";
import fs from "node:fs";
import { discoverPosts, pathToRkey } from "./lib/posts";
import { type AtprotoState, readState, writeState } from "./lib/state";
import { isSyndicated, readSyndication, syndicationRef, writeSyndication } from "./lib/syndication";
import { diffRecommends, readRecommendations } from "./lib/recommendations";
import { type AtprotoClient, type BasicTheme, createClient } from "./lib/atproto";

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
  /** Square publication icon source; skipped when the file is missing. */
  iconPath: string;
  basicTheme: BasicTheme;
  /** Curated recommendations config; sync is skipped when the file is missing. */
  recommendationsPath: string;
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
  iconPath: path.resolve(import.meta.dirname, "..", "src/assets/publication-icon.png"),
  // Mirrors the site's global.css custom properties (--background-color,
  // --text-color, --highlight-color); accent text is white on the purple.
  basicTheme: {
    background: { r: 28, g: 26, b: 29 },
    foreground: { r: 224, g: 224, b: 224 },
    accent: { r: 190, g: 46, b: 221 },
    accentForeground: { r: 255, g: 255, b: 255 },
  },
  recommendationsPath: path.resolve(import.meta.dirname, "..", "atproto-recommendations.json"),
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Bluesky posts cap at 300 graphemes; descriptions are short, but guard anyway. */
function skeetText(text: string): string {
  return text.length <= 300 ? text : text.slice(0, 297) + "…";
}

/** Cover/thumbnail source: the post's own hero image, falling back to the default OG image. */
function resolveCoverPath(config: PublishConfig, rkey: string): string {
  const hero = path.join(config.heroesDir, `${rkey}.avif`);
  return fs.existsSync(hero) ? hero : config.defaultOgPath;
}

async function syncRecommends(client: AtprotoClient, config: PublishConfig) {
  const desired = readRecommendations(config.recommendationsPath);
  if (desired === null) return;

  const existing = await client.listRecommends();
  const { toCreate, toDelete } = diffRecommends(existing, desired);
  for (const uri of toCreate) {
    await client.createRecommend(uri);
    console.log(`  recommend: created for ${uri}`);
  }
  for (const rkey of toDelete) {
    await client.deleteRecommend(rkey);
    console.log(`  recommend: deleted ${rkey}`);
  }
  if (toCreate.length || toDelete.length) {
    console.log(`recommends: ${toCreate.length} created, ${toDelete.length} deleted`);
  }
}

export async function publish(client: AtprotoClient, config: PublishConfig = defaultConfig) {
  const state = readState(config.statePath);
  const oldHashes = state?.contentHashes ?? {};
  const syndication = readSyndication(config.syndicationPath);

  const pubRef = await client.ensurePublication({
    url: config.siteUrl,
    name: config.siteName,
    description: config.siteDescription,
    iconPath: config.iconPath,
    basicTheme: config.basicTheme,
    showInDiscover: true,
  });
  const pubAtUri = pubRef.uri;

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

    if (!contentChanged && !eligible) {
      unchanged++;
      continue;
    }

    const coverImage = await client.uploadImage(resolveCoverPath(config, rkey));
    const doc = {
      title: post.title,
      site: pubAtUri,
      path: post.path,
      textContent: post.textContent,
      publishedAt: `${post.date}T00:00:00.000Z`,
      description: post.description,
      tags: post.tags.length ? post.tags : undefined,
      coverImage,
      // Only stamp an edit time for real content changes to already-published
      // posts; state resets (record backfills) must not masquerade as edits.
      updatedAt: contentChanged && !isNew ? new Date().toISOString() : undefined,
      // Preserve any existing announcement so editing a cross-posted post keeps the link.
      bskyPostRef: syndicationRef(syndication, post.path),
    };

    // Write the document before the skeet so the announcement can carry
    // strongRefs to the records backing it (Bluesky's enhanced link cards).
    const docRef = await client.putDocument(rkey, doc);

    if (eligible) {
      try {
        const skeet = await client.createSkeet({
          // The card already carries the title; lead with the post's description
          // so the skeet text isn't just a repeat of the card headline.
          text: skeetText(post.description || post.title),
          url: `${config.siteUrl}${post.path}/`,
          title: post.title,
          description: post.description || post.title,
          thumb: coverImage,
          associatedRefs: [docRef, pubRef],
        });
        syndication.posts[post.path] = {
          uri: skeet.uri,
          cid: skeet.cid,
          syndicatedAt: new Date().toISOString(),
        };
        // Re-put with the announcement ref so the document links back to the skeet.
        await client.putDocument(rkey, { ...doc, bskyPostRef: { uri: skeet.uri, cid: skeet.cid } });
        crossPosted++;
        console.log(`  bluesky: cross-posted ${post.path} -> ${skeet.uri}`);
      } catch (error) {
        crossPostFailed++;
        console.error(
          `  bluesky: cross-post failed for ${post.path}:`,
          error instanceof Error ? error.message : error,
        );
      }
    }

    if (contentChanged) {
      if (isNew) created++;
      else updated++;
    }

    await sleep(100);
  }

  await syncRecommends(client, config);

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
