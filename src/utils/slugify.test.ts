import { describe, expect, test } from "vitest"
import { slugify } from "./slugify"

describe("slugify", () => {
  test("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world")
  })

  test("replaces special characters with hyphens", () => {
    expect(slugify("foo@bar!baz")).toBe("foo-bar-baz")
  })

  test("trims leading and trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello")
  })

  test("collapses multiple special chars to single hyphen", () => {
    expect(slugify("foo---bar___baz")).toBe("foo-bar-baz")
  })

  test("handles spaces", () => {
    expect(slugify("My New Blog Post")).toBe("my-new-blog-post")
  })

  test("preserves numbers", () => {
    expect(slugify("Post 42 Title")).toBe("post-42-title")
  })

  test("handles empty string", () => {
    expect(slugify("")).toBe("")
  })

  test("handles string with only special characters", () => {
    expect(slugify("@#$%")).toBe("")
  })
})
