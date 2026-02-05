import { describe, expect, test } from "vitest"
import { extractExcerpt, extractDescription } from "./excerpt"

describe("extractExcerpt", () => {
  test("extracts plain paragraph", () => {
    expect(extractExcerpt("Hello world.")).toBe("Hello world.")
  })

  test("removes frontmatter", () => {
    const md = `---
title: Test
---

First paragraph here.`
    expect(extractExcerpt(md)).toBe("First paragraph here.")
  })

  test("skips code blocks", () => {
    const md = `\`\`\`ts
const x = 1
\`\`\`

Actual content.`
    expect(extractExcerpt(md)).toBe("Actual content.")
  })

  test("skips custom container content", () => {
    const md = `Real paragraph before container.

::: tip

This is a tip.

:::`
    expect(extractExcerpt(md)).toBe("Real paragraph before container.")
  })

  test("skips headings", () => {
    const md = `# Heading

Paragraph after heading.`
    expect(extractExcerpt(md)).toBe("Paragraph after heading.")
  })

  test("skips images", () => {
    const md = `![alt text](image.png)

Text after image.`
    expect(extractExcerpt(md)).toBe("Text after image.")
  })

  test("skips blockquotes", () => {
    const md = `> A quote

Text after quote.`
    expect(extractExcerpt(md)).toBe("Text after quote.")
  })

  test("skips list items", () => {
    const md = `- item one
- item two

Text after list.`
    expect(extractExcerpt(md)).toBe("Text after list.")
  })

  test("strips markdown links", () => {
    expect(extractExcerpt("Check [this link](https://example.com) out.")).toBe(
      "Check this link out.",
    )
  })

  test("strips bold and italic", () => {
    expect(extractExcerpt("Some **bold** and *italic* text.")).toBe(
      "Some bold and italic text.",
    )
  })

  test("strips inline code", () => {
    expect(extractExcerpt("Use `console.log` for debugging.")).toBe(
      "Use console.log for debugging.",
    )
  })

  test("removes footnote references", () => {
    expect(extractExcerpt("Some text[^1] with footnotes[^note].")).toBe(
      "Some text with footnotes.",
    )
  })

  test("truncates to max length", () => {
    const long = "a".repeat(500)
    expect(extractExcerpt(long)).toHaveLength(450)
  })

  test("uses custom max length", () => {
    const long = "a".repeat(100)
    expect(extractExcerpt(long, 50)).toHaveLength(50)
  })

  test("returns first paragraph only", () => {
    const md = `First paragraph.

Second paragraph.`
    expect(extractExcerpt(md)).toBe("First paragraph.")
  })
})

describe("extractDescription", () => {
  test("extracts basic text", () => {
    expect(extractDescription("Hello world.")).toBe("Hello world.")
  })

  test("removes HTML/Vue components", () => {
    expect(extractDescription("<MyComponent /> Some text.")).toBe("Some text.")
  })

  test("removes frontmatter", () => {
    const md = `---
title: Test
---

Description text.`
    expect(extractDescription(md)).toBe("Description text.")
  })

  test("truncates with ellipsis at word boundary", () => {
    const long = "This is a fairly long sentence that exceeds the limit. ".repeat(10)
    const result = extractDescription(long, 50)
    expect(result.length).toBeLessThanOrEqual(51)
    expect(result).toMatch(/…$/)
    expect(result).not.toMatch(/\s…$/)
  })

  test("returns short content as-is", () => {
    expect(extractDescription("Short.", 160)).toBe("Short.")
  })

  test("removes markdown images", () => {
    expect(extractDescription("![alt](img.png) Text here.")).toBe("Text here.")
  })

  test("removes code blocks", () => {
    const md = `\`\`\`ts
code
\`\`\`

Description.`
    expect(extractDescription(md)).toBe("Description.")
  })

  test("strips bold/italic markers", () => {
    expect(extractDescription("**bold** and *italic*")).toBe("bold and italic")
  })
})
