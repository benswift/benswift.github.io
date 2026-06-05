---
title: "The verification I never verified"
description: "I wrote a whole post about two-way standard.site verification. One of the two directions had been returning a 404 in production the entire time."
published: true
tags:
  - atproto
  - web
  - dev
---

Back in February I [wrote that every post on this blog has a persistent AT-URI](/blog/2026/02/19/at-uris-as-persistent-identifiers-for-scholarly-blogging/)
via the [standard.site](https://standard.site) lexicons. I was rather pleased
with the verification, which runs both ways. The site serves a
`/.well-known/site.standard.publication` file pointing at the publication
record, and every page carries its document AT-URI in a `<link>` tag. "Any
indexer can match the web content to the protocol records and confirm they
belong together," I wrote, with the confidence of a man who had not actually
checked.

The document half worked. The publication half had been returning a 404 in
production since the day I shipped it.

I only went looking because
[Andy Bell posted that he'd done the standard.site thing](https://bell.bz/i-did-the-standard-site-thing/)[^wave].
That prompted me to curl my own well-known endpoint for the first time since
setting it up. 404. The file was right there in `public/.well-known/`, and it
served fine when I built and previewed locally. In production it had vanished.

[^wave]:
    There's a small wave of these at the moment, on the back of Bluesky's
    recent treatment of standard.site records. Apparently I did mine early
    enough to also do it wrong early.

My first theory was Jekyll. GitHub Pages runs your output through Jekyll unless
you tell it not to. Jekyll ignores files and directories whose names start with
a dot. I dropped an empty `.nojekyll` at the site root, deployed, and curled
again. Still 404.

That turned out to be the useful data point, because it killed my tidy
explanation. I hit the Pages origin directly, bypassing Cloudflare[^cf], with a
cache-buster query for good measure. Still 404. That ruled out a stale cache,
and Jekyll with it. The file genuinely wasn't being served, which meant it
genuinely wasn't there.

[^cf]:
    The domain sits behind Cloudflare, which I'd briefly hoped was the culprit.
    It wasn't, and was faithfully passing through GitHub's own 404.

The culprit was the step that uploads the build:
[`actions/upload-pages-artifact`](https://github.com/actions/upload-pages-artifact/blob/main/action.yml).
It takes an `include-hidden-files` input that defaults to `false`. When it's
false, the action adds `--exclude=.[^/]*` to its `tar` invocation, and that
pattern matches anything starting with a dot. So `.well-known/` was being
stripped from the tarball before it ever left the runner. It took the
`.nojekyll` file with it, the very file I'd just added to fix a problem it was
itself being excluded from fixing.

One line in [the workflow](https://github.com/benswift/benswift.github.io/blob/main/.github/workflows/deploy.yml)
sorted it:

```yaml
- uses: actions/upload-pages-artifact@v5
  with:
    path: dist
    include-hidden-files: true
```

Now `/.well-known/site.standard.publication` returns the AT-URI it's supposed
to, at the origin and through the CDN alike. The verification finally goes both
ways.

While I had the bonnet up, I checked my records against the
[published lexicons](https://standard.site). I'd been sloppy in three separate
ways[^sloppy]. I was stuffing each post's raw markdown into a `content` field
that the lexicon defines as a typed union. My `textContent` held the one-line
description instead of the post's actual prose. And the `createdAt` I was
writing isn't in the schema at all. All three are now fixed and backfilled
across the full set of 155 document records.

[^sloppy]:
    The records validated and stored fine regardless, because my PDS doesn't
    know the standard.site lexicons and so never checked them. That kind of
    validation only bites when a real indexer reads the records, which is the
    one case I actually care about.

A verification step you never verify is just a hopeful comment in your config
file. The loop is closed now. Properly, this time.
