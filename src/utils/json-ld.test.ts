import { describe, expect, it } from "vitest";
import { blogPostingJsonLd, serialiseJsonLd, websiteJsonLd } from "./json-ld";

/** The nodes of a JSON-LD document's `@graph`, failing loudly if it has none. */
function graphOf(ld: object): Record<string, unknown>[] {
  const graph = "@graph" in ld ? ld["@graph"] : undefined;
  if (!Array.isArray(graph)) throw new Error("JSON-LD document has no @graph array");
  return graph.map((node) => {
    if (typeof node !== "object" || node === null) throw new Error("@graph node is not an object");
    return { ...node };
  });
}

describe("blogPostingJsonLd", () => {
  it("credits Ben by ORCID and names the post's AT URI", () => {
    const ld = blogPostingJsonLd({
      title: "A post",
      url: "https://benswift.me/blog/2026/01/02/a-post/",
      date: "2026-01-02",
      atUri: "at://did:plc:abc/site.standard.document/xyz",
    });
    const [person, post] = graphOf(ld);
    expect(person).toMatchObject({
      "@type": "Person",
      identifier: "https://orcid.org/0000-0003-2138-5969",
    });
    expect(post).toMatchObject({
      "@type": "BlogPosting",
      headline: "A post",
      datePublished: "2026-01-02",
      identifier: "at://did:plc:abc/site.standard.document/xyz",
      author: { "@id": person["@id"] },
    });
  });

  it("omits the identifier for a post with no AT record", () => {
    const ld = blogPostingJsonLd({
      title: "T",
      url: "https://benswift.me/x/",
      date: "2026-01-02",
    });
    expect(graphOf(ld)[1]).not.toHaveProperty("identifier");
  });
});

it("websiteJsonLd names Ben as publisher", () => {
  const ld = websiteJsonLd();
  expect(graphOf(ld)[1]).toMatchObject({
    "@type": "WebSite",
    publisher: { "@id": "https://benswift.me/#ben" },
  });
});

it("serialiseJsonLd can't close its script block early", () => {
  expect(serialiseJsonLd({ headline: "</script><b>" })).not.toContain("</script>");
});
