import { describe, it, expect } from "vitest";
import { pathToRkey } from "./posts";
import { buildDocumentRecord, buildPublicationRecord } from "./atproto";

describe("atproto rkey determinism", () => {
  it("produces valid rkey characters only", () => {
    const rkey = pathToRkey("/blog/2026/02/18/my-post");
    expect(rkey).toMatch(/^[A-Za-z0-9._:~-]+$/);
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
