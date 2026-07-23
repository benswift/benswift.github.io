import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { publish, type PublishConfig } from "./atproto-publish";
import type {
  AtprotoClient,
  DocumentRecord,
  PublicationRecord,
  RecommendEntry,
  SkeetInput,
} from "./lib/atproto";

interface MockClient extends AtprotoClient {
  publications: PublicationRecord[];
  documents: Array<{ rkey: string; doc: DocumentRecord }>;
  skeets: SkeetInput[];
  recommends: RecommendEntry[];
  deletedRecommends: string[];
  uploads: string[];
  listRecommendCalls: number;
}

function makeMockClient(did = "did:plc:test123"): MockClient {
  const client: MockClient = {
    did,
    publications: [],
    documents: [],
    skeets: [],
    recommends: [],
    deletedRecommends: [],
    uploads: [],
    listRecommendCalls: 0,

    async uploadImage(sourcePath) {
      client.uploads.push(sourcePath);
      if (!fs.existsSync(sourcePath)) return undefined;
      return { $type: "blob", source: sourcePath };
    },
    async ensurePublication(pub) {
      client.publications.push(pub);
      return { uri: `at://${did}/site.standard.publication/self`, cid: "pubcid" };
    },
    async putDocument(rkey, doc) {
      client.documents.push({ rkey, doc });
      return {
        uri: `at://${did}/site.standard.document/${rkey}`,
        cid: `doccid${client.documents.length}`,
      };
    },
    async createSkeet(input) {
      client.skeets.push(input);
      const n = client.skeets.length;
      return { uri: `at://${did}/app.bsky.feed.post/${n}`, cid: `bafycid${n}` };
    },
    async listRecommends() {
      client.listRecommendCalls++;
      return [...client.recommends];
    },
    async createRecommend(documentUri) {
      client.recommends.push({ rkey: `rec${client.recommends.length + 1}`, document: documentUri });
    },
    async deleteRecommend(rkey) {
      client.deletedRecommends.push(rkey);
      client.recommends = client.recommends.filter((r) => r.rkey !== rkey);
    },
  };
  return client;
}

/** The most recent document record written for a given rkey. */
function lastDoc(client: MockClient, rkey: string): DocumentRecord | undefined {
  return client.documents.findLast((d) => d.rkey === rkey)?.doc;
}

describe("atproto-publish", () => {
  let tmpDir: string;
  let config: PublishConfig;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "publish-test-"));

    const blogDir = path.join(tmpDir, "blog", "2026", "02", "18");
    fs.mkdirSync(blogDir, { recursive: true });

    fs.writeFileSync(
      path.join(blogDir, "test-post.md"),
      '---\ntitle: "Test Post"\ntags: [testing]\n---\n\nHello world.',
    );
    fs.writeFileSync(
      path.join(blogDir, "another-post.md"),
      '---\ntitle: "Another Post"\n---\n\nMore content here.',
    );

    config = {
      blogDir: path.join(tmpDir, "blog"),
      statePath: path.join(tmpDir, "atproto-state.json"),
      wellKnownDir: path.join(tmpDir, "public", ".well-known"),
      siteUrl: "https://benswift.me",
      siteName: "benswift.me",
      siteDescription: "test",
      crossPost: false,
      syndicationPath: path.join(tmpDir, "atproto-syndication.json"),
      heroesDir: path.join(tmpDir, "heroes"),
      defaultOgPath: path.join(tmpDir, "og-default.avif"),
      iconPath: path.join(tmpDir, "publication-icon.png"),
      basicTheme: {
        background: { r: 28, g: 26, b: 29 },
        foreground: { r: 224, g: 224, b: 224 },
        accent: { r: 190, g: 46, b: 221 },
        accentForeground: { r: 255, g: 255, b: 255 },
      },
      recommendationsPath: path.join(tmpDir, "atproto-recommendations.json"),
    };
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates all posts on empty state", async () => {
    const client = makeMockClient();
    await publish(client, config);

    expect(client.publications).toHaveLength(1);
    expect(client.documents).toHaveLength(2);

    const state = JSON.parse(fs.readFileSync(config.statePath, "utf8"));
    expect(state.did).toBe("did:plc:test123");
    expect(Object.keys(state.contentHashes)).toHaveLength(2);
  });

  it("passes icon, theme and discover opt-in through to the publication record", async () => {
    const client = makeMockClient();
    await publish(client, config);

    const pub = client.publications[0];
    expect(pub.iconPath).toBe(config.iconPath);
    expect(pub.basicTheme).toEqual(config.basicTheme);
    expect(pub.showInDiscover).toBe(true);
  });

  it("skips unchanged posts on subsequent run", async () => {
    const client1 = makeMockClient();
    await publish(client1, config);

    const client2 = makeMockClient();
    await publish(client2, config);

    expect(client2.documents).toHaveLength(0);
  });

  it("updates only changed posts", async () => {
    const client1 = makeMockClient();
    await publish(client1, config);

    fs.writeFileSync(
      path.join(tmpDir, "blog", "2026", "02", "18", "test-post.md"),
      '---\ntitle: "Test Post Updated"\ntags: [testing]\n---\n\nUpdated content.',
    );

    const client2 = makeMockClient();
    await publish(client2, config);

    expect(client2.documents).toHaveLength(1);
    expect(client2.documents[0].rkey).toBe("2026-02-18-test-post");
  });

  it("omits updatedAt on first publish and stamps it on later edits", async () => {
    const client1 = makeMockClient();
    await publish(client1, config);
    for (const { doc } of client1.documents) {
      expect(doc.updatedAt).toBeUndefined();
    }

    fs.writeFileSync(
      path.join(tmpDir, "blog", "2026", "02", "18", "test-post.md"),
      '---\ntitle: "Test Post"\ntags: [testing]\n---\n\nEdited content.',
    );

    const client2 = makeMockClient();
    await publish(client2, config);
    const doc = lastDoc(client2, "2026-02-18-test-post");
    expect(doc?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("attaches the uploaded cover image to the document record", async () => {
    // Post-specific hero for one post; the other falls back to the default OG
    // image, which doesn't exist in this config, so it gets no cover.
    fs.mkdirSync(config.heroesDir, { recursive: true });
    fs.writeFileSync(path.join(config.heroesDir, "2026-02-18-test-post.avif"), "fake-avif");

    const client = makeMockClient();
    await publish(client, config);

    const withHero = lastDoc(client, "2026-02-18-test-post");
    expect(withHero?.coverImage).toEqual({
      $type: "blob",
      source: path.join(config.heroesDir, "2026-02-18-test-post.avif"),
    });
    const withoutHero = lastDoc(client, "2026-02-18-another-post");
    expect(withoutHero?.coverImage).toBeUndefined();
  });

  it("writes .well-known publication file", async () => {
    const client = makeMockClient();
    await publish(client, config);

    const wellKnown = fs.readFileSync(
      path.join(config.wellKnownDir, "site.standard.publication"),
      "utf8",
    );
    expect(wellKnown.trim()).toBe("at://did:plc:test123/site.standard.publication/self");
  });

  it("writes state file with correct structure", async () => {
    const client = makeMockClient();
    await publish(client, config);

    const state = JSON.parse(fs.readFileSync(config.statePath, "utf8"));
    expect(state).toHaveProperty("did");
    expect(state).toHaveProperty("publicationAtUri");
    expect(state).toHaveProperty("contentHashes");
    expect(state.publicationAtUri).toBe("at://did:plc:test123/site.standard.publication/self");
  });

  describe("bluesky cross-posting", () => {
    it("cross-posts eligible posts and records syndication state when enabled", async () => {
      config.crossPost = true;
      const client = makeMockClient();
      await publish(client, config);

      expect(client.skeets).toHaveLength(2);
      // app.bsky.embed.external requires a non-empty description on every card.
      for (const skeet of client.skeets) {
        expect(skeet.title).toBeTruthy();
        expect(skeet.description).toBeTruthy();
      }
      const synd = JSON.parse(fs.readFileSync(config.syndicationPath, "utf8"));
      expect(Object.keys(synd.posts)).toHaveLength(2);
    });

    it("does not cross-post or touch syndication state when disabled", async () => {
      config.crossPost = false;
      const client = makeMockClient();
      await publish(client, config);

      expect(client.skeets).toHaveLength(0);
      expect(fs.existsSync(config.syndicationPath)).toBe(false);
    });

    it("skips posts already in the syndication state (seeded back catalogue)", async () => {
      config.crossPost = true;
      fs.writeFileSync(
        config.syndicationPath,
        JSON.stringify({ posts: { "/blog/2026/02/18/test-post": { seeded: true } } }),
      );
      const client = makeMockClient();
      await publish(client, config);

      expect(client.skeets).toHaveLength(1);
      expect(client.skeets[0].url).toContain("another-post");
    });

    it("respects the crosspost: false frontmatter opt-out", async () => {
      config.crossPost = true;
      fs.writeFileSync(
        path.join(tmpDir, "blog", "2026", "02", "18", "test-post.md"),
        '---\ntitle: "Test Post"\ncrosspost: false\n---\n\nHello world.',
      );
      const client = makeMockClient();
      await publish(client, config);

      expect(client.skeets).toHaveLength(1);
      expect(client.skeets[0].url).toContain("another-post");
    });

    it("writes the document before the skeet and sends associatedRefs", async () => {
      config.crossPost = true;
      const client = makeMockClient();
      const rkey = "2026-02-18-test-post";
      await publish(client, config);

      // First write has no announcement ref (the skeet doesn't exist yet)...
      const writes = client.documents.filter((d) => d.rkey === rkey);
      expect(writes).toHaveLength(2);
      expect(writes[0].doc.bskyPostRef).toBeUndefined();

      // ...but the skeet's embed carries strongRefs to the document and publication.
      const skeet = client.skeets.find((s) => s.url.includes("test-post"));
      expect(skeet?.associatedRefs).toHaveLength(2);
      expect(skeet?.associatedRefs?.[0].uri).toBe(
        `at://${client.did}/site.standard.document/${rkey}`,
      );
      expect(skeet?.associatedRefs?.[1].uri).toBe(
        `at://${client.did}/site.standard.publication/self`,
      );
      for (const ref of skeet?.associatedRefs ?? []) {
        expect(ref.cid).toBeTruthy();
      }
    });

    it("re-puts the document with the Bluesky post ref after cross-posting", async () => {
      config.crossPost = true;
      const client = makeMockClient();
      await publish(client, config);

      const doc = lastDoc(client, "2026-02-18-test-post");
      expect(doc?.bskyPostRef?.uri).toMatch(/app\.bsky\.feed\.post/);
      expect(doc?.bskyPostRef?.cid).toBeTruthy();
    });

    it("reuses the uploaded cover image as the skeet thumbnail", async () => {
      config.crossPost = true;
      fs.mkdirSync(config.heroesDir, { recursive: true });
      fs.writeFileSync(path.join(config.heroesDir, "2026-02-18-test-post.avif"), "fake-avif");

      const client = makeMockClient();
      await publish(client, config);

      const skeet = client.skeets.find((s) => s.url.includes("test-post"));
      const doc = lastDoc(client, "2026-02-18-test-post");
      expect(skeet?.thumb).toEqual(doc?.coverImage);
      // One upload per post: the blob is shared between document and skeet.
      expect(client.uploads).toHaveLength(2);
    });

    it("preserves an existing announcement ref when editing a cross-posted post", async () => {
      config.crossPost = true;
      const client1 = makeMockClient();
      await publish(client1, config);
      const originalRef = lastDoc(client1, "2026-02-18-test-post")?.bskyPostRef;
      expect(originalRef).toBeDefined();

      fs.writeFileSync(
        path.join(tmpDir, "blog", "2026", "02", "18", "test-post.md"),
        '---\ntitle: "Test Post"\ntags: [testing]\n---\n\nEdited content.',
      );
      // Carry the syndication ledger forward as CI does (it's committed).
      const client2 = makeMockClient();
      await publish(client2, config);

      expect(client2.skeets).toHaveLength(0);
      expect(lastDoc(client2, "2026-02-18-test-post")?.bskyPostRef).toEqual(originalRef);
    });

    it("does not re-cross-post on a subsequent run", async () => {
      config.crossPost = true;
      const client1 = makeMockClient();
      await publish(client1, config);
      expect(client1.skeets).toHaveLength(2);

      const client2 = makeMockClient();
      await publish(client2, config);
      expect(client2.skeets).toHaveLength(0);
    });
  });

  describe("recommendations sync", () => {
    it("skips the sync entirely when no config file exists", async () => {
      const client = makeMockClient();
      await publish(client, config);
      expect(client.listRecommendCalls).toBe(0);
    });

    it("creates records for newly recommended documents", async () => {
      fs.writeFileSync(
        config.recommendationsPath,
        JSON.stringify({ documents: ["at://did:plc:other/site.standard.document/2026-01-01-x"] }),
      );
      const client = makeMockClient();
      await publish(client, config);

      expect(client.recommends).toEqual([
        { rkey: "rec1", document: "at://did:plc:other/site.standard.document/2026-01-01-x" },
      ]);
    });

    it("deletes records for retracted recommendations and is otherwise idempotent", async () => {
      fs.writeFileSync(
        config.recommendationsPath,
        JSON.stringify({ documents: ["at://did:plc:other/site.standard.document/keep"] }),
      );
      const client = makeMockClient();
      client.recommends.push(
        { rkey: "old1", document: "at://did:plc:other/site.standard.document/keep" },
        { rkey: "old2", document: "at://did:plc:other/site.standard.document/retracted" },
      );
      await publish(client, config);

      expect(client.deletedRecommends).toEqual(["old2"]);
      expect(client.recommends).toEqual([
        { rkey: "old1", document: "at://did:plc:other/site.standard.document/keep" },
      ]);
    });
  });
});
