// schema.org JSON-LD for the page head: the machine-readable half of the
// citation story beside the Highwire citation_* meta (Scholar, Zotero) and the
// site.standard links (atproto). All three are built from the same props, so
// they can't disagree on title, date or URL.

const SITE = "https://benswift.me";
const LICENCE = "https://creativecommons.org/licenses/by-sa/4.0/";

/** Ben, identified by ORCID, with the profiles that also identify him. */
export const person = {
  "@type": "Person",
  "@id": `${SITE}/#ben`,
  name: "Ben Swift",
  url: `${SITE}/`,
  identifier: "https://orcid.org/0000-0003-2138-5969",
  affiliation: { "@type": "Organization", name: "ANU School of Cybernetics" },
  sameAs: [
    "https://orcid.org/0000-0003-2138-5969",
    "https://scholar.google.com/citations?user=OQdYgLEAAAAJ",
    "https://github.com/benswift",
    "https://bsky.app/profile/benswift.me",
    "https://www.linkedin.com/in/benjswift",
  ],
};

/** The site itself, published by Ben. */
export function websiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${SITE}/#site`,
        name: "benswift.me",
        url: `${SITE}/`,
        publisher: { "@id": person["@id"] },
        license: LICENCE,
      },
    ],
  };
}

/** One blog post: its own work, authored by Ben. The AT URI goes in
 *  `identifier` so the atproto record and the web page name each other. */
export function blogPostingJsonLd(post: {
  title: string;
  url: string;
  date: string;
  description?: string;
  image?: string;
  atUri?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "BlogPosting",
        "@id": post.url,
        headline: post.title,
        url: post.url,
        mainEntityOfPage: post.url,
        datePublished: post.date,
        ...(post.description && { description: post.description }),
        ...(post.image && { image: post.image }),
        ...(post.atUri && { identifier: post.atUri }),
        author: { "@id": person["@id"] },
        publisher: { "@id": person["@id"] },
        isPartOf: { "@type": "Blog", "@id": `${SITE}/blog/`, name: "benswift.me" },
        license: LICENCE,
        inLanguage: "en",
      },
    ],
  };
}

/** Serialise for a `<script type="application/ld+json">`: escaping `<` keeps a
 *  title containing `</script>` from closing the block early. */
export function serialiseJsonLd(data: object): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
