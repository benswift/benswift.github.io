import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { publish, type PublishConfig } from "./atproto-publish";
import type { AtprotoClient, SkeetInput } from "./lib/atproto";

function makeMockClient(did = "did:plc:test123"): AtprotoClient & {
  publications: Array<{ url: string; name: string; description: string }>;
  documents: Array<{ rkey: string; doc: unknown }>;
  skeets: SkeetInput[];
} {
  const publications: Array<{ url: string; name: string; description: string }> = [];
  const documents: Array<{ rkey: string; doc: unknown }> = [];
  const skeets: SkeetInput[] = [];

  return {
    did,
    publications,
    documents,
    skeets,
    async ensurePublication(pub) {
      publications.push(pub);
      return `at://${did}/site.standard.publication/self`;
    },
    async putDocument(rkey, doc) {
      documents.push({ rkey, doc });
      return `at://${did}/site.standard.document/${rkey}`;
    },
    async createSkeet(input) {
      skeets.push(input);
      const n = skeets.length;
      return { uri: `at://${did}/app.bsky.feed.post/${n}`, cid: `bafycid${n}` };
    },
  };
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

    it("attaches the Bluesky post ref to the document record", async () => {
      config.crossPost = true;
      const client = makeMockClient();
      await publish(client, config);

      const entry = client.documents.find((d) => d.rkey === "2026-02-18-test-post");
      const doc = entry?.doc as { bskyPostRef?: { uri: string; cid: string } };
      expect(doc.bskyPostRef?.uri).toMatch(/app\.bsky\.feed\.post/);
      expect(doc.bskyPostRef?.cid).toBeTruthy();
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
});
