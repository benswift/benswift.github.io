---
title: "Becoming a better atproto citizen"
description:
  "The blog's standard.site records now carry cover images, a publication icon
  and theme, and the strongRefs Bluesky uses for enhanced link cards."
published: true
tags:
  - atproto
  - web
  - dev
---

Back in February I
[gave every post on this blog a persistent AT-URI](/blog/2026/02/19/at-uris-as-persistent-identifiers-for-scholarly-blogging/)
via the [standard.site](https://standard.site) lexicons. In June I
[fixed the verification file that had been 404ing in production the entire time](/blog/2026/06/06/the-verification-i-never-verified/).
Since then the records have been syncing quietly on every push, and the spec has
grown up around them. Standard.site started as an agreement between three
publishing platforms; now even the AT Protocol team's own blog publishes these
records. And as of May,
[Bluesky is rolling out enhanced link cards](https://github.com/bluesky-social/atproto/discussions/4978)
built from them. The publication's avatar, an estimated reading time, theme
colours: all pulled from records in your repo rather than scraped from your
`og:` meta tags.

This week I brought the blog's records up to date with all of that. The
publication record now carries an icon (the favicon, rasterised at 512px), a
`basicTheme` with the site's colours, and the `showInDiscover` preference. Those
are the fields [readers like Leaflet's](https://lab.leaflet.pub/3md4qsktbms24)
draw on for rendering and discovery. Every document record now carries a
`coverImage` blob (the post's hero image) plus an `updatedAt` stamp whenever I
edit a published post. And when a new post gets announced on Bluesky, the
announcement's link embed now carries `associatedRefs`, strongRefs to the
document and publication records. That's the signal for Bluesky to build an
enhanced card rather than recrawl the page.[^ordering]

[^ordering]:
    This required a small ordering dance in the publish pipeline. The document
    record has to exist before the Bluesky post so the post can reference it,
    but the document also wants a `bskyPostRef` pointing back at the post. So:
    write the document, create the post with `associatedRefs`, then re-put the
    document with the back-link. Two writes to close one reference cycle.

There are two smaller additions. Post pages now emit a
`<link rel="site.standard.publication">` tag alongside the existing document
one, because Bluesky verifies articles against both records before rendering a
card. There's also a new hand-curated
[`atproto-recommendations.json`](https://github.com/benswift/benswift.github.io/blob/main/atproto-recommendations.json),
which the publish pipeline syncs to `site.standard.graph.recommend` records.
It's an atproto-native way of vouching for individual posts, mine or anyone
else's.[^blogroll]

[^blogroll]:
    It's currently empty, which makes it the protocol equivalent of a blogroll
    page that says "coming soon". Recommendations to follow.

With all that in place I re-published the back catalogue, so all 162 documents
now carry cover images. If you want the details, the whole pipeline is
[`scripts/atproto-publish.ts`](https://github.com/benswift/benswift.github.io/blob/main/scripts/atproto-publish.ts)
and
[`scripts/lib/atproto.ts`](https://github.com/benswift/benswift.github.io/blob/main/scripts/lib/atproto.ts):
plain `putRecord` calls via `@atproto/api`, nothing clever. That plainness is
still the appeal of the whole arrangement. The records live in a repo I control;
the sync is a few hundred lines of TypeScript. Publish once, and the blog shows
up properly in Leaflet, pckt and Bluesky with no per-platform integration
required.
