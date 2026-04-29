import { describe, it, expect } from "vitest";
import { extractHeroPhrases } from "./extract-hero-phrases";

describe("extractHeroPhrases", () => {
  it("extracts level 2-4 headings", () => {
    const md = `
# Top heading should be skipped
## Second level
### Third level
#### Fourth level
##### Fifth level should be skipped
`;
    expect(extractHeroPhrases(md)).toEqual(["Second level", "Third level", "Fourth level"]);
  });

  it("extracts emphasis, strong, link, and inline code text along with paragraph fragments", () => {
    const md = "Plain *em* and **strong** with [a link](http://x) and `code` parts.";
    expect(extractHeroPhrases(md)).toEqual([
      "Plain",
      "em",
      "and",
      "strong",
      "with",
      "a link",
      "code",
      "parts",
    ]);
  });

  it("splits paragraph text on punctuation", () => {
    const md = "First fragment, second part — third bit; fourth: fifth!";
    expect(extractHeroPhrases(md)).toEqual([
      "First fragment",
      "second part",
      "third bit",
      "fourth",
      "fifth",
    ]);
  });

  it("filters out phrases longer than 36 chars", () => {
    const md = "## A short heading\n## " + "x".repeat(40);
    expect(extractHeroPhrases(md)).toEqual(["A short heading"]);
  });

  it("deduplicates case-insensitively but preserves first casing", () => {
    const md = "## Foo Bar\n## foo bar\n## FOO BAR";
    expect(extractHeroPhrases(md)).toEqual(["Foo Bar"]);
  });

  it("normalises internal whitespace", () => {
    const md = "## Hello   world\n##   spaced  out  ";
    expect(extractHeroPhrases(md)).toEqual(["Hello world", "spaced out"]);
  });

  it("returns an empty array for empty markdown", () => {
    expect(extractHeroPhrases("")).toEqual([]);
  });
});
