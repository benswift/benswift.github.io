import { describe, expect, test } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

// Integration tests covering the modern-web-guidance audit fixes. They run
// against the built `dist/` output, so the audit-fix work can't silently
// regress: missing meta tags, broken og:images, lost a11y attributes, or
// CSP/tabindex omissions will fail loudly here.

const distDir = resolve(import.meta.dirname, "../dist");

function readPage(route: string): string {
  const file = resolve(distDir, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
  return readFileSync(file, "utf8");
}

function findBlogPostHtmls(): string[] {
  if (!existsSync(distDir)) return [];
  return execSync("find dist/blog -path '*/20*/index.html' -type f", { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
}

describe.skipIf(!existsSync(distDir))("color-scheme meta tag (dark-mode guide)", () => {
  test("every page declares color-scheme: dark before CSS parses", () => {
    const pages = ["/", "/blog/", "/research/", "/teaching/"];
    for (const p of pages) {
      expect(readPage(p)).toMatch(/<meta[^>]+name="color-scheme"[^>]+content="dark"/i);
    }
  });
});

describe.skipIf(!existsSync(distDir))("Content Security Policy (security guide)", () => {
  test("every page emits a script-src restricting third-party JS", () => {
    const html = readPage("/");
    const csp = html.match(
      /<meta[^>]+http-equiv="Content-Security-Policy"[^>]+content="([^"]+)"/i,
    )?.[1];
    expect(csp, "no CSP meta tag found").toBeTruthy();
    // script-src must be present and must NOT include 'unsafe-inline' (that
    // would defeat XSS protection on the highest-value directive).
    expect(csp).toMatch(/script-src[^;]*'self'/);
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    // jsDelivr must be allow-listed for the juttu script.
    expect(csp).toMatch(/script-src[^;]*https:\/\/cdn\.jsdelivr\.net/);
    // object-src must be 'none' (modern CSP hardening).
    expect(csp).toMatch(/object-src\s+'none'/);
  });
});

describe.skipIf(!existsSync(distDir))("homepage og:image (Head fix)", () => {
  test("og:image is not the missing home.svg placeholder", () => {
    const html = readPage("/");
    const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1];
    expect(og, "no og:image meta tag found").toBeTruthy();
    expect(og).not.toContain("/assets/images/posts/home.svg");
  });

  test("og:image points at a real file in dist (or absolute https URL)", () => {
    const html = readPage("/");
    const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1] ?? "";
    if (og.startsWith("http")) {
      // absolute URL — verify it's our hostname + a path under dist
      const url = new URL(og);
      expect(url.hostname).toBe("benswift.me");
      expect(existsSync(resolve(distDir, url.pathname.replace(/^\//, "")))).toBe(true);
    } else {
      expect(existsSync(resolve(distDir, og.replace(/^\//, "")))).toBe(true);
    }
  });
});

describe.skipIf(!existsSync(distDir))(
  "landmarks and skip-link target (accessibility guide)",
  () => {
    test("nav aria-label is 'Main' (not 'Main navigation')", () => {
      const html = readPage("/");
      expect(html).toMatch(/<nav[^>]+aria-label="Main"/);
      // The old "Main navigation" would be announced as "Main navigation,
      // navigation" — guard against regression.
      expect(html).not.toMatch(/<nav[^>]+aria-label="Main navigation"/);
    });

    test("<main> is programmatically focusable so the skip link works", () => {
      const html = readPage("/");
      expect(html).toMatch(
        /<main[^>]+id="main-content"[^>]+tabindex="-1"|<main[^>]+tabindex="-1"[^>]+id="main-content"/,
      );
    });

    test("hero slot wrapper appears before the nav so SSR reserves its space", () => {
      const html = readPage("/");
      const slotPos = html.indexOf('class="hero-slot"');
      const headerPos = html.indexOf("<header");
      expect(slotPos).toBeGreaterThan(-1);
      expect(headerPos).toBeGreaterThan(-1);
      expect(slotPos).toBeLessThan(headerPos);
    });
  },
);

describe.skipIf(!existsSync(distDir))("search dialog (light-dismiss guide)", () => {
  test("dialog has closedby='any' and an accessible name", () => {
    const html = readPage("/");
    const dialog = html.match(/<dialog[^>]*class="search-dialog"[^>]*>/)?.[0];
    expect(dialog).toBeTruthy();
    expect(dialog).toContain('closedby="any"');
    expect(dialog).toMatch(/aria-label="Search"/);
  });
});

describe.skipIf(!existsSync(distDir))("code blocks are keyboard-scrollable (html guide)", () => {
  test("Shiki <pre> blocks carry tabindex='0' and a role/aria-label", () => {
    const posts = findBlogPostHtmls();
    const withCode = posts
      .map((f) => readFileSync(f, "utf8"))
      .find((h) => h.includes('class="astro-code'));
    expect(withCode, "no posts with Shiki code blocks found").toBeTruthy();
    expect(withCode).toMatch(/<pre[^>]+class="astro-code[^"]*"[^>]+tabindex="0"/);
    expect(withCode).toMatch(/<pre[^>]+role="region"/);
    expect(withCode).toMatch(/<pre[^>]+aria-label="Code sample"/);
  });
});

describe.skipIf(!existsSync(distDir))(
  "blog index uses headings for post titles (accessibility guide)",
  () => {
    test("post titles are real <h2> headings, not bare anchors", () => {
      const html = readPage("/blog/");
      // Every post-item-title should be an h2 wrapping an anchor, so screen
      // reader users can jump between entries via heading navigation.
      expect(html).toMatch(/<h2\s+class="post-item-title"\s*><a\s/);
      // The old anchor-only pattern would still match a class but never an h2.
      const anchorOnlyMatches = html.match(/<a[^>]+class="post-item-title"/g) ?? [];
      expect(anchorOnlyMatches.length).toBe(0);
    });
  },
);

describe.skipIf(!existsSync(distDir))("heading anchors are decorative, not announced", () => {
  test("autolinked heading anchors are hidden from assistive tech", () => {
    const posts = findBlogPostHtmls();
    const sample = posts
      .map((f) => readFileSync(f, "utf8"))
      .find((h) => (h.match(/at-heading-anchor/g) ?? []).length >= 2);
    if (!sample) return; // no post with ≥2 anchors — nothing to assert
    const anchors = [...sample.matchAll(/<a\b[^>]*class="at-heading-anchor"[^>]*>/g)].map(
      (m) => m[0],
    );
    expect(anchors.length).toBeGreaterThanOrEqual(2);
    // The permalink "#" is a mouse affordance only: the heading text itself is
    // the accessible content, so each anchor is aria-hidden and out of the tab
    // order (astro-theme-university's headingAnchorPlugins convention). No
    // aria-label — an announced "Link to section" duplicated every heading.
    for (const a of anchors) {
      expect(a).toMatch(/aria-hidden="true"/);
      expect(a).toMatch(/tabindex="-1"/);
      expect(a).not.toMatch(/aria-label=/);
    }
  });
});
