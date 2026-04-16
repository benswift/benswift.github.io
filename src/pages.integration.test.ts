import { describe, expect, test } from "vitest"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const distDir = resolve(import.meta.dirname, "../dist")
const repoRoot = resolve(import.meta.dirname, "..")

function readPage(route: string): string {
  const file = resolve(distDir, route.replace(/^\//, "").replace(/\/$/, ""), "index.html")
  return readFileSync(file, "utf8")
}

function getTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/)?.[1] ?? null
}

function getFirstH1(html: string): string | null {
  // Strip heading-anchor links rehype-autolink-headings prepends inside h1s.
  return html
    .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]
    ?.replace(/<[^>]+>/g, "")
    .trim() ?? null
}

function getFooterSourcePaths(html: string): string[] {
  // Matches href on both "source" and "history" links in the footer.
  const matches = [
    ...html.matchAll(
      /href="https:\/\/github\.com\/benswift\/benswift\.github\.io\/(?:blob|commits)\/main\/([^"]+)"/g,
    ),
  ]
  return matches.map((m) => m[1])
}

describe("page titles", () => {
  // A non-exhaustive list of top-level pages that must each have a unique,
  // descriptive title. Home is special-cased (just "benswift.me").
  const titledRoutes: Array<[string, string]> = [
    ["/bio/", "Bio"],
    ["/cv/", "CV"],
    ["/research/", "Research"],
    ["/teaching/", "Teaching"],
    ["/livecoding/", "Livecoding"],
    ["/blog/", "Blog"],
  ]

  test("home has the bare site title", () => {
    const html = readPage("/")
    expect(getTitle(html)).toBe("benswift.me")
  })

  for (const [route, name] of titledRoutes) {
    test(`${route} uses "${name} | benswift.me"`, () => {
      const html = readPage(route)
      expect(getTitle(html)).toBe(`${name} | benswift.me`)
    })
  }

  test("tag pages follow the 'Posts tagged with …' pattern", () => {
    const html = readPage("/blog/tag/ai/")
    // <title> content is HTML-escaped in the built output.
    expect(getTitle(html)).toBe(`Posts tagged with &quot;ai&quot; | benswift.me`)
  })
})

describe("page h1s", () => {
  const h1Routes: Array<[string, string]> = [
    ["/bio/", "Bio"],
    ["/cv/", "CV"],
    ["/research/", "Research"],
    ["/teaching/", "Teaching"],
    ["/livecoding/", "Livecoding"],
    ["/blog/", "Blog"],
  ]

  for (const [route, expected] of h1Routes) {
    test(`${route} has <h1>${expected}</h1>`, () => {
      const html = readPage(route)
      expect(getFirstH1(html)).toBe(expected)
    })
  }
})

describe("talk pages", () => {
  test("talk pages are generated (deckSlugs regression)", () => {
    const html = readPage("/talks/")
    const talkLinks = [...html.matchAll(/href="\/talks\/([^"]+)\/"/g)].map((m) => m[1])
    expect(talkLinks.length).toBeGreaterThan(0)

    for (const slug of talkLinks) {
      const file = resolve(distDir, "talks", slug, "index.html")
      expect(existsSync(file), `talk page missing: /talks/${slug}/`).toBe(true)
    }
  })
})

describe("footer source/history links", () => {
  // Every path the footer links to must point at a file that exists in this
  // repo, so clicking "source"/"history" doesn't 404 on GitHub.
  const pages = [
    "/",
    "/bio/",
    "/cv/",
    "/research/",
    "/teaching/",
    "/livecoding/",
    "/blog/",
    "/talks/",
    "/blog/2026/04/09/one-git-heatmap-to-rule-them-all/",
  ]

  for (const page of pages) {
    test(`${page} footer targets exist on disk`, () => {
      const html = readPage(page)
      const paths = getFooterSourcePaths(html)
      expect(paths.length).toBeGreaterThan(0)
      for (const path of paths) {
        expect(existsSync(resolve(repoRoot, path)), `missing file: ${path}`).toBe(true)
      }
    })
  }
})

