import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Root } from "mdast";
import { remarkHeroPhrases } from "./remark-hero-phrases";

interface VFileWithFrontmatter {
  data: { astro?: { frontmatter?: { heroPhrases?: string[] } } };
}

function runPlugin(markdown: string): string[] {
  const file: VFileWithFrontmatter = { data: {} };
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  // eslint-disable-next-line
  remarkHeroPhrases()(tree, file as never);
  return file.data.astro?.frontmatter?.heroPhrases ?? [];
}

describe("remarkHeroPhrases", () => {
  it("extracts level 2-4 headings", () => {
    const md = `
# Top heading should be skipped
## Second level
### Third level
#### Fourth level
##### Fifth level should be skipped
`;
    expect(runPlugin(md)).toEqual(["Second level", "Third level", "Fourth level"]);
  });

  it("extracts emphasis and strong text", () => {
    const md = "Some text with *emphasis* and **strong** parts.";
    expect(runPlugin(md)).toEqual(["emphasis", "strong"]);
  });

  it("filters out phrases longer than 36 chars", () => {
    const md = "## A short heading\n## " + "x".repeat(40);
    expect(runPlugin(md)).toEqual(["A short heading"]);
  });

  it("deduplicates case-insensitively but preserves first casing", () => {
    const md = "## Foo Bar\n## foo bar\n## FOO BAR";
    expect(runPlugin(md)).toEqual(["Foo Bar"]);
  });

  it("normalises internal whitespace", () => {
    const md = "## Hello   world\n##   spaced  out  ";
    expect(runPlugin(md)).toEqual(["Hello world", "spaced out"]);
  });

  it("returns an empty array when no candidate text is present", () => {
    expect(runPlugin("Just a plain paragraph.")).toEqual([]);
  });
});
