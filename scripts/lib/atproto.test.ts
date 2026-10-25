import { describe, expect, it } from "vitest";
import { deterministicTid, pathToRkey, pathToSlugKey } from "./posts";
import { buildDocumentRecord, buildPublicationRecord, PUBLICATION_RKEY } from "./atproto";

// atproto TID syntax: 13 base32-sortable chars, the first limited so the top bit is 0.
const TID = /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/;

/** Decode a TID's timestamp (microseconds since the epoch) to a YYYY-MM-DD date. */
function tidDate(tid: string): string {
  let n = 0n;
  for (const c of tid) n = n * 32n + BigInt("234567abcdefghijklmnopqrstuvwxyz".indexOf(c));
  return new Date(Number(n >> 10n) / 1000).toISOString().slice(0, 10);
}

describe("atproto rkey determinism", () => {
  it("produces a valid TID, as the site.standard.document lexicon requires", () => {
    expect(pathToRkey("/blog/2026/02/18/my-post")).toMatch(TID);
  });

  it("timestamps the TID on the post's date", () => {
    expect(tidDate(pathToRkey("/blog/2026/02/18/my-post"))).toBe("2026-02-18");
  });

  it("gives the publication a fixed valid TID", () => {
    expect(PUBLICATION_RKEY).toMatch(TID);
    expect(PUBLICATION_RKEY).toBe(deterministicTid("2026-02-19", "site.standard.publication"));
  });

  it("keeps the date-slug key for hero filenames and legacy records", () => {
    expect(pathToSlugKey("/blog/2026/02/18/my-post")).toBe("2026-02-18-my-post");
  });

  it("is idempotent", () => {
    const path = "/blog/2026/02/18/my-post";
    expect(pathToRkey(path)).toBe(pathToRkey(path));
  });

  it("produces unique rkeys for different posts", () => {
    expect(pathToRkey("/blog/2026/02/18/post-a")).not.toBe(pathToRkey("/blog/2026/02/18/post-b"));
  });

  it("produces unique rkeys for same slug on different dates", () => {
    expect(pathToRkey("/blog/2026/02/18/my-post")).not.toBe(pathToRkey("/blog/2026/02/19/my-post"));
  });
});

describe("buildPublicationRecord", () => {
  const base = { url: "https://benswift.me", name: "benswift.me", description: "test" };

  it("builds a minimal record without optional fields", () => {
    const record = buildPublicationRecord(base);
    expect(record).toEqual({
      $type: "site.standard.publication",
      url: "https://benswift.me",
      name: "benswift.me",
      description: "test",
    });
  });

  it("tags theme colours with the lexicon colour type", () => {
    const record = buildPublicationRecord({
      ...base,
      basicTheme: {
        background: { r: 28, g: 26, b: 29 },
        foreground: { r: 224, g: 224, b: 224 },
        accent: { r: 190, g: 46, b: 221 },
        accentForeground: { r: 255, g: 255, b: 255 },
      },
    });
    expect(record.basicTheme).toEqual({
      background: { $type: "site.standard.theme.color#rgb", r: 28, g: 26, b: 29 },
      foreground: { $type: "site.standard.theme.color#rgb", r: 224, g: 224, b: 224 },
      accent: { $type: "site.standard.theme.color#rgb", r: 190, g: 46, b: 221 },
      accentForeground: { $type: "site.standard.theme.color#rgb", r: 255, g: 255, b: 255 },
    });
  });

  it("includes the icon blob and discover preference when provided", () => {
    const blob = { $type: "blob", ref: { $link: "bafy" }, mimeType: "image/png", size: 1 };
    const record = buildPublicationRecord({ ...base, showInDiscover: true }, blob);
    expect(record.icon).toBe(blob);
    expect(record.preferences).toEqual({ showInDiscover: true });
  });
});

describe("buildDocumentRecord", () => {
  const base = {
    title: "Test",
    site: "at://did:plc:x/site.standard.publication/self",
    path: "/blog/2026/02/18/test",
    textContent: "hello",
    publishedAt: "2026-02-18T00:00:00.000Z",
    description: "a test post",
  };

  it("omits optional fields that are unset", () => {
    const record = buildDocumentRecord(base);
    expect(record).toEqual({ $type: "site.standard.document", ...base });
    expect(record).not.toHaveProperty("tags");
    expect(record).not.toHaveProperty("coverImage");
    expect(record).not.toHaveProperty("updatedAt");
    expect(record).not.toHaveProperty("bskyPostRef");
  });

  it("includes coverImage, updatedAt, tags and bskyPostRef when set", () => {
    const blob = { $type: "blob", ref: { $link: "bafy" }, mimeType: "image/jpeg", size: 1 };
    const record = buildDocumentRecord({
      ...base,
      tags: ["testing"],
      coverImage: blob,
      updatedAt: "2026-07-11T00:00:00.000Z",
      bskyPostRef: { uri: "at://did:plc:x/app.bsky.feed.post/1", cid: "bafycid" },
    });
    expect(record.coverImage).toBe(blob);
    expect(record.updatedAt).toBe("2026-07-11T00:00:00.000Z");
    expect(record.tags).toEqual(["testing"]);
    expect(record.bskyPostRef).toEqual({
      uri: "at://did:plc:x/app.bsky.feed.post/1",
      cid: "bafycid",
    });
  });

  it("drops empty tag arrays", () => {
    const record = buildDocumentRecord({ ...base, tags: [] });
    expect(record).not.toHaveProperty("tags");
  });
});
