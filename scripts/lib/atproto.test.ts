import { describe, it, expect } from "vitest"
import { pathToRkey } from "./posts"

describe("atproto rkey determinism", () => {
  it("produces valid rkey characters only", () => {
    const rkey = pathToRkey("/blog/2026/02/18/my-post")
    expect(rkey).toMatch(/^[A-Za-z0-9._:~-]+$/)
  })

  it("is idempotent", () => {
    const path = "/blog/2026/02/18/my-post"
    expect(pathToRkey(path)).toBe(pathToRkey(path))
  })

  it("produces unique rkeys for different posts", () => {
    expect(pathToRkey("/blog/2026/02/18/post-a")).not.toBe(
      pathToRkey("/blog/2026/02/18/post-b"),
    )
  })

  it("produces unique rkeys for same slug on different dates", () => {
    expect(pathToRkey("/blog/2026/02/18/my-post")).not.toBe(
      pathToRkey("/blog/2026/02/19/my-post"),
    )
  })
})
