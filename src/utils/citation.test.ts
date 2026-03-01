import { describe, it, expect } from "vitest"
import { generateBibtex, generateCiteKey } from "./citation"

describe("generateCiteKey", () => {
  it("creates camelCase key from year and full slug", () => {
    expect(generateCiteKey("2026", "my-post")).toBe("swift2026myPost")
  })

  it("handles single-word slugs", () => {
    expect(generateCiteKey("2026", "post")).toBe("swift2026post")
  })

  it("handles multi-word slugs", () => {
    expect(generateCiteKey("2025", "agentic-ai-llms-with-stones")).toBe(
      "swift2025agenticAiLlmsWithStones",
    )
  })

  it("produces unique keys for previously-colliding posts", () => {
    expect(generateCiteKey("2025", "agentic-ai-llms-with-stones")).not.toBe(
      generateCiteKey("2025", "agentic-elixir-superpowers-zed-tidewave-ashai"),
    )
  })
})

describe("generateBibtex", () => {
  it("generates valid BibTeX entry", () => {
    const bibtex = generateBibtex({
      citeKey: "swift2026my",
      author: "Ben Swift",
      title: "My Post",
      url: "https://benswift.me/blog/2026/02/18/my-post",
      year: "2026",
      month: "02",
    })

    expect(bibtex).toContain("@online{swift2026my,")
    expect(bibtex).toContain("author = {Ben Swift}")
    expect(bibtex).toContain("title = {My Post}")
    expect(bibtex).toContain("url = {https://benswift.me/blog/2026/02/18/my-post}")
    expect(bibtex).toContain("year = {2026}")
    expect(bibtex).toContain("month = {02}")
    expect(bibtex).not.toContain("note")
    expect(bibtex).toContain("}")
  })

  it("includes AT-URI in note field when provided", () => {
    const bibtex = generateBibtex({
      citeKey: "swift2026my",
      author: "Ben Swift",
      title: "My Post",
      url: "https://benswift.me/blog/2026/02/18/my-post",
      year: "2026",
      month: "02",
      atUri: "at://did:plc:abc/site.standard.document/2026-02-18-my-post",
    })

    expect(bibtex).toContain(
      "note = {AT-URI: at://did:plc:abc/site.standard.document/2026-02-18-my-post}",
    )
  })

  it("omits note field when no AT-URI", () => {
    const bibtex = generateBibtex({
      citeKey: "swift2026test",
      author: "Ben Swift",
      title: "Test",
      url: "https://example.com",
      year: "2026",
      month: "01",
    })

    expect(bibtex).not.toContain("note")
  })
})
