import { describe, expect, it } from "vitest";
import { blogPostingJsonLd, serialiseJsonLd, websiteJsonLd } from "./json-ld";

describe("blogPostingJsonLd", () => {
  it("credits Ben by ORCID and names the post's AT URI", () => {
    const ld = blogPostingJsonLd({
      title: "A post",
      url: "https://benswift.me/blog/2026/01/02/a-post/",
      date: "2026-01-02",
      atUri: "at://did:plc:abc/site.standard.document/xyz",
    }) as { "@graph": Record<string, unknown>[] };
    const [person, post] = ld["@graph"];
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
    }) as {
      "@graph": Record<string, unknown>[];
    };
    expect(ld["@graph"][1]).not.toHaveProperty("identifier");
  });
});

it("websiteJsonLd names Ben as publisher", () => {
  const ld = websiteJsonLd() as { "@graph": Record<string, unknown>[] };
  expect(ld["@graph"][1]).toMatchObject({
    "@type": "WebSite",
    publisher: { "@id": "https://benswift.me/#ben" },
  });
});

it("serialiseJsonLd can't close its script block early", () => {
  expect(serialiseJsonLd({ headline: "</script><b>" })).not.toContain("</script>");
});
