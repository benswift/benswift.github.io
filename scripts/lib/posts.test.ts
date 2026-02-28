import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { discoverPosts, computeHash, pathToRkey, extractPostPath } from "./posts"

describe("pathToRkey", () => {
  it("converts a blog post path to a valid rkey", () => {
    expect(pathToRkey("/blog/2026/02/18/my-post")).toBe("2026-02-18-my-post")
  })

  it("handles slugs with multiple hyphens", () => {
    expect(pathToRkey("/blog/2024/01/05/a-long-post-title")).toBe(
      "2024-01-05-a-long-post-title",
    )
  })

  it("throws on invalid path", () => {
    expect(() => pathToRkey("/not/a/blog/path")).toThrow("Invalid post path")
  })
})

describe("extractPostPath", () => {
  it("converts relative file path to URL path", () => {
    expect(extractPostPath("blog/2026/02/18/my-post.md")).toBe(
      "/blog/2026/02/18/my-post",
    )
  })

  it("handles paths without .md extension", () => {
    expect(extractPostPath("blog/2026/02/18/my-post")).toBe(
      "/blog/2026/02/18/my-post",
    )
  })
})

describe("computeHash", () => {
  it("returns consistent SHA-256 hex", () => {
    const hash = computeHash("hello world")
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
    expect(hash).toBe(computeHash("hello world"))
  })

  it("returns different hashes for different content", () => {
    expect(computeHash("a")).not.toBe(computeHash("b"))
  })
})

describe("discoverPosts", () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "posts-test-"))
    const blogDir = path.join(tmpDir, "blog", "2026", "02", "18")
    fs.mkdirSync(blogDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  function writePost(slug: string, frontmatter: string, body: string) {
    const dir = path.join(tmpDir, "blog", "2026", "02", "18")
    fs.writeFileSync(path.join(dir, `${slug}.md`), `---\n${frontmatter}\n---\n\n${body}`)
  }

  it("discovers published posts", () => {
    writePost("test-post", 'title: "Test Post"\ntags: [foo, bar]', "Some content here.")
    const posts = discoverPosts(path.join(tmpDir, "blog"))
    expect(posts).toHaveLength(1)
    expect(posts[0].title).toBe("Test Post")
    expect(posts[0].path).toBe("/blog/2026/02/18/test-post")
    expect(posts[0].date).toBe("2026-02-18")
    expect(posts[0].tags).toEqual(["foo", "bar"])
    expect(posts[0].contentHash).toMatch(/^[a-f0-9]{64}$/)
  })

  it("skips unpublished posts", () => {
    writePost("draft", 'title: "Draft"\npublished: false', "Not ready yet.")
    const posts = discoverPosts(path.join(tmpDir, "blog"))
    expect(posts).toHaveLength(0)
  })

  it("skips index.md files", () => {
    const dir = path.join(tmpDir, "blog")
    fs.writeFileSync(path.join(dir, "index.md"), "---\ntitle: Blog\n---\n\nIndex page.")
    const posts = discoverPosts(path.join(tmpDir, "blog"))
    expect(posts).toHaveLength(0)
  })

  it("sorts posts newest first", () => {
    const jan = path.join(tmpDir, "blog", "2026", "01", "01")
    fs.mkdirSync(jan, { recursive: true })
    fs.writeFileSync(
      path.join(jan, "earlier.md"),
      '---\ntitle: "Earlier"\n---\n\nOld post.',
    )
    writePost("later", 'title: "Later"', "New post.")

    const posts = discoverPosts(path.join(tmpDir, "blog"))
    expect(posts).toHaveLength(2)
    expect(posts[0].title).toBe("Later")
    expect(posts[1].title).toBe("Earlier")
  })
})
