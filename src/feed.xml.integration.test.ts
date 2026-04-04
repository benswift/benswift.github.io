import { describe, expect, test } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(import.meta.dirname, "../dist");
const feedPath = resolve(distDir, "feed.xml");

describe("RSS feed", () => {
  test("feed.xml exists in build output", () => {
    expect(existsSync(feedPath)).toBe(true);
  });

  test("is valid XML with correct RSS structure", () => {
    const xml = readFileSync(feedPath, "utf8");

    expect(xml).toMatch(/<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(xml).toMatch(/<rss version="2.0"/);
    expect(xml).toMatch(/<channel>/);
  });

  test("has required channel metadata", () => {
    const xml = readFileSync(feedPath, "utf8");

    expect(xml).toMatch(/<title>benswift\.me<\/title>/);
    expect(xml).toMatch(/<description>Ben Swift&apos;s blog<\/description>/);
    expect(xml).toMatch(/<link>https:\/\/benswift\.me\/<\/link>/);
  });

  test("contains blog post items", () => {
    const xml = readFileSync(feedPath, "utf8");

    const itemCount = (xml.match(/<item>/g) || []).length;
    expect(itemCount).toBeGreaterThan(0);
  });

  test("items have required fields", () => {
    const xml = readFileSync(feedPath, "utf8");

    const firstItem = xml.match(/<item>([\s\S]*?)<\/item>/)?.[1];
    expect(firstItem).toBeDefined();
    expect(firstItem).toMatch(/<title>/);
    expect(firstItem).toMatch(/<link>/);
    expect(firstItem).toMatch(/<description>/);
    expect(firstItem).toMatch(/<pubDate>/);
  });

  test("items link to blog posts with correct URL structure", () => {
    const xml = readFileSync(feedPath, "utf8");

    const links = [...xml.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/g)];
    expect(links.length).toBeGreaterThan(0);

    for (const match of links) {
      expect(match[1]).toMatch(/^https:\/\/benswift\.me\/blog\/\d{4}\/\d{2}\/\d{2}\//);
    }
  });

  test("items are sorted newest first", () => {
    const xml = readFileSync(feedPath, "utf8");

    const dates = [...xml.matchAll(/<pubDate>(.*?)<\/pubDate>/g)].map((m) =>
      new Date(m[1]).getTime(),
    );

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
    }
  });

  test("does not include unpublished posts", () => {
    const xml = readFileSync(feedPath, "utf8");

    expect(xml).not.toMatch(/published:\s*false/);
  });
});
