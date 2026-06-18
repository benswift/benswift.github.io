import { describe, it, expect } from "vitest";
import { generateBibtex, generateCiteKey, gigToBibtex } from "./citation";

describe("generateCiteKey", () => {
  it("creates camelCase key from year and full slug", () => {
    expect(generateCiteKey("2026", "my-post")).toBe("swift2026myPost");
  });

  it("handles single-word slugs", () => {
    expect(generateCiteKey("2026", "post")).toBe("swift2026post");
  });

  it("handles multi-word slugs", () => {
    expect(generateCiteKey("2025", "agentic-ai-llms-with-stones")).toBe(
      "swift2025agenticAiLlmsWithStones",
    );
  });

  it("produces unique keys for previously-colliding posts", () => {
    expect(generateCiteKey("2025", "agentic-ai-llms-with-stones")).not.toBe(
      generateCiteKey("2025", "agentic-elixir-superpowers-zed-tidewave-ashai"),
    );
  });
});

describe("generateBibtex", () => {
  it("generates valid BibTeX entry", () => {
    const bibtex = generateBibtex({
      citeKey: "swift2026my",
      author: "Ben Swift",
      title: "My Post",
      url: "https://benswift.me/blog/2026/02/18/my-post",
      year: "2026",
      month: "02",
    });

    expect(bibtex).toContain("@online{swift2026my,");
    expect(bibtex).toContain("author = {Ben Swift}");
    expect(bibtex).toContain("title = {My Post}");
    expect(bibtex).toContain("url = {https://benswift.me/blog/2026/02/18/my-post}");
    expect(bibtex).toContain("year = {2026}");
    expect(bibtex).toContain("month = {02}");
    expect(bibtex).not.toContain("note");
    expect(bibtex).toContain("}");
  });

  it("includes AT-URI in note field when provided", () => {
    const bibtex = generateBibtex({
      citeKey: "swift2026my",
      author: "Ben Swift",
      title: "My Post",
      url: "https://benswift.me/blog/2026/02/18/my-post",
      year: "2026",
      month: "02",
      atUri: "at://did:plc:abc/site.standard.document/2026-02-18-my-post",
    });

    expect(bibtex).toContain(
      "note = {AT-URI: at://did:plc:abc/site.standard.document/2026-02-18-my-post}",
    );
  });

  it("omits note field when no AT-URI", () => {
    const bibtex = generateBibtex({
      citeKey: "swift2026test",
      author: "Ben Swift",
      title: "Test",
      url: "https://example.com",
      year: "2026",
      month: "01",
    });

    expect(bibtex).not.toContain("note");
  });
});

describe("gigToBibtex", () => {
  const gig = {
    title: "Coloring Code - Live Drawing and Coding",
    doi: "10.5281/zenodo.20743708",
    date: "2024-05-31",
    event: "International Conference on Live Coding (ICLC) 2024",
    venue: "Shanghai Concert Hall, China",
    artists: [{ name: "Leon Volbers" }, { name: "Beverly Edwards", orcid: "0000-0001-2345-6789" }],
  };

  it("emits an @misc entry with a Zenodo-style cite key and DOI", () => {
    const bibtex = gigToBibtex(gig);
    expect(bibtex).toContain("@misc{swift_2024_20743708,");
    expect(bibtex).toContain("doi          = {10.5281/zenodo.20743708}");
    expect(bibtex).toContain("url          = {https://doi.org/10.5281/zenodo.20743708}");
    expect(bibtex).toContain("publisher    = {Zenodo}");
  });

  it("lists Ben first, then collaborators, in family-comma-given form", () => {
    expect(gigToBibtex(gig)).toContain(
      "author       = {Swift, Ben and Volbers, Leon and Edwards, Beverly}",
    );
  });

  it("double-braces the title and carries the performance context", () => {
    const bibtex = gigToBibtex(gig);
    expect(bibtex).toContain("title        = {{Coloring Code - Live Drawing and Coding}}");
    expect(bibtex).toContain("howpublished = {Live-coding performance,");
    expect(bibtex).toContain("month        = {may}");
  });

  it("puts known ORCIDs (incl. Ben's) in a note", () => {
    const bibtex = gigToBibtex(gig);
    expect(bibtex).toContain("Swift, Ben (0000-0003-2138-5969)");
    expect(bibtex).toContain("Edwards, Beverly (0000-0001-2345-6789)");
    // The collaborator without an ORCID isn't listed in the note.
    expect(bibtex).not.toContain("Volbers, Leon (");
  });

  it("escapes BibTeX special characters in the title", () => {
    const bibtex = gigToBibtex({ ...gig, title: "ACMC'22 Evening Concert #1", artists: [] });
    expect(bibtex).toContain("{{ACMC'22 Evening Concert \\#1}}");
  });
});
