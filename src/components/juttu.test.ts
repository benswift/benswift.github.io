import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");

function findPostHtmlFiles(): string[] {
  if (!existsSync(distDir)) return [];
  return execSync("find dist/blog -path '*/20*/index.html' -type f", {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);
}

describe.skipIf(!existsSync(distDir))("juttu comments integration", () => {
  let postFiles: string[];
  let htmlWithAtUri: string;
  let allHtmlContents: string[];

  beforeAll(() => {
    postFiles = findPostHtmlFiles();
    allHtmlContents = postFiles.map((f) => readFileSync(f, "utf8"));
    const withAtUri = allHtmlContents.find((html) => html.includes('rel="site.standard.document"'));
    htmlWithAtUri = withAtUri ?? "";
  });

  it("has blog posts with AT Protocol links to test against", () => {
    expect(htmlWithAtUri).toBeTruthy();
  });

  it("includes juttu embed script in head", () => {
    expect(htmlWithAtUri).toContain("juttu-embed.js");
    expect(htmlWithAtUri).toContain('data-theme="dark"');
    expect(htmlWithAtUri).toContain("cdn.jsdelivr.net/npm/juttu@latest");
  });

  it("includes juttu-comments div in body", () => {
    expect(htmlWithAtUri).toContain('id="juttu-comments"');
  });

  it("juttu script uses defer attribute", () => {
    expect(htmlWithAtUri).toMatch(/defer\s.*juttu-embed\.js|juttu-embed\.js.*defer/);
  });

  it("juttu-comments div appears before cite-post details element", () => {
    const commentsPos = htmlWithAtUri.indexOf('id="juttu-comments"');
    const citePos = htmlWithAtUri.indexOf('<details class="cite-post"');
    expect(commentsPos).toBeGreaterThan(-1);
    expect(citePos).toBeGreaterThan(-1);
    expect(commentsPos).toBeLessThan(citePos);
  });

  it("juttu script and comments div are only present when atUri exists", () => {
    for (const html of allHtmlContents) {
      const hasAtUri = html.includes('rel="site.standard.document"');
      const hasJuttuScript = html.includes("juttu-embed.js");
      const hasJuttuDiv = html.includes('id="juttu-comments"');
      expect(hasJuttuScript).toBe(hasAtUri);
      expect(hasJuttuDiv).toBe(hasAtUri);
    }
  });
});
