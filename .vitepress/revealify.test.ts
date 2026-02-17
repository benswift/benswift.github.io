import { describe, expect, test } from "vitest"
import MarkdownIt from "markdown-it"
import { revealifyPlugin } from "./revealify"

function renderReveal(src: string): string {
  const md = new MarkdownIt()
  revealifyPlugin(md)
  return md.render(src, { frontmatter: { layout: "reveal" } })
}

describe("revealifyPlugin", () => {
  test("non-reveal content passes through unchanged", () => {
    const md = new MarkdownIt()
    const withPlugin = new MarkdownIt()
    revealifyPlugin(withPlugin)

    const src = "# Hello\n\nWorld"
    expect(withPlugin.render(src)).toBe(md.render(src))
  })

  test("h1 creates a section wrapper", () => {
    const result = renderReveal("# Slide One\n\nContent here.")
    expect(result).toContain("<section>")
    expect(result).toContain("<h1>Slide One</h1>")
    expect(result).toContain("</section>")
  })

  test("h2 creates a new section wrapper", () => {
    const result = renderReveal("## Slide A\n\nContent A.\n\n## Slide B\n\nContent B.")
    const sections = result.match(/<section/g)
    expect(sections).toHaveLength(2)
    expect(result).toContain("<h2>Slide A</h2>")
    expect(result).toContain("<h2>Slide B</h2>")
  })

  test("h1 then h2 creates separate sections", () => {
    const result = renderReveal("# First\n\n## Second")
    const sections = result.match(/<section/g)
    expect(sections).toHaveLength(2)
  })

  test("hr creates a section break", () => {
    const result = renderReveal("# Slide 1\n\nContent.\n\n---\n\nMore content.")
    const sections = result.match(/<section/g)
    expect(sections).toHaveLength(2)
    expect(result).not.toContain("<hr")
  })

  test("final section is closed", () => {
    const result = renderReveal("# Only Slide\n\nContent.")
    const openCount = (result.match(/<section/g) || []).length
    const closeCount = (result.match(/<\/section>/g) || []).length
    expect(openCount).toBe(closeCount)
  })

  test("data attributes on headings hoist to section", () => {
    const md = new MarkdownIt()
    revealifyPlugin(md)

    // Inject a core rule that adds data-background to the first heading_open token
    md.core.ruler.push("test_inject_attrs", (state) => {
      for (const token of state.tokens) {
        if (token.type === "heading_open" && token.tag === "h1") {
          token.attrSet("data-background", "#000")
          break
        }
      }
      return true
    })

    const result = md.render("# Slide\n\nContent.", {
      frontmatter: { layout: "reveal" },
    })
    expect(result).toContain('data-background="#000"')
    expect(result).toMatch(/<section[^>]*data-background/)
  })

  test("h3 does not create a new section", () => {
    const result = renderReveal("# Main\n\n### Subheading\n\nContent.")
    const sections = result.match(/<section/g)
    expect(sections).toHaveLength(1)
    expect(result).toContain("<h3>Subheading</h3>")
  })
})
