---
title: "AT-URIs as persistent identifiers for scholarly blogging"
tags:
  - atproto
  - research
  - web
---

Every post on this blog now has a persistent identifier on the
[AT Protocol](https://atproto.com/). If you scroll to the bottom of any post,
you'll find a "Cite this post" section with a BibTeX entry that includes an
AT-URI alongside the regular URL. I did this because I wanted a citation
identifier for my blog posts that's more durable than a bare URL but doesn't
require the institutional overhead of a DOI---and because the
[standard.site](https://standard.site) spec gave me a clean way to do it.

## The identifier dilemma[^dilemma]

[^dilemma]: Technically it's a trilemma I guess, but who's that pedantic?

If you write something on the web and want people to be able to cite it
reliably, you've got three options with varying trade-offs.

**Bare URLs** are free and immediate. `https://benswift.me/blog/2026/02/19/...`
works right now and will keep working for as long as I keep this domain pointed
at this content. The problem, of course, is that "as long as I keep this domain"
is doing a lot of work in that sentence. Domains lapse, hosting providers go
away, site redesigns break paths. Tim Berners-Lee
[argued in 1998](https://www.w3.org/Provider/Style/URI) that cool URIs don't
change---but on the real web, they change all the time.

**DOIs** solve the persistence problem through institutional infrastructure.
CrossRef and DataCite maintain resolver services, and the academic citation
ecosystem understands DOIs natively. I'm an academic working at a university, so
this is very much the water I swim in. But getting a DOI means going through a
registrar, and that typically means either publishing through a journal or
paying for one yourself. For a rambling personal blog post about yak-shaving
your email setup, that's a bit much[^zenodo].

[^zenodo]:
    You _can_ get free DOIs through [Zenodo](https://zenodo.org/) by uploading
    your work there, and that's a reasonable option for some things---I've
    [done it myself via the GitHub integration](https://github.com/ANUcybernetics/llms-unplugged).
    But it still means your canonical content lives in two places, and you need
    to manually deposit each post.

**AT-URIs** sit somewhere in the middle.
[AT Protocol](https://atproto.com/specs/record-key) defines a URI scheme
(`at://did:plc:abc123/collection/rkey`) where the authority is a
cryptographically verifiable DID rather than a domain name. Your content lives
in a [Personal Data Server](https://atproto.com/guides/glossary#pds) that you
control, and the DID follows you even if you move between PDS providers. The
resolution doesn't depend on any single company keeping the lights on---it's
federated infrastructure, not a domain registrar's renewal cycle.

None of these are perfect. But for the specific case of "I write a blog and I
want a persistent, self-issued, machine-readable identifier for each post," the
AT-URI approach hits a sweet spot.

## How this site does it

The integration uses [standard.site](https://standard.site)---a shared set of
[AT Protocol lexicons](https://atproto.com/guides/lexicon) for long-form
publishing. There are two record types that matter:

`site.standard.publication` describes the blog itself (name, URL, description).
There's one of these, stored with the rkey `self`:

```
at://did:plc:tevykrhi4kibtsipzci76d76/site.standard.publication/self
```

`site.standard.document` stores each blog post's content and metadata. Each post
gets its own record with a deterministic rkey derived from the post's URL path:

```
/blog/2026/02/18/ben-s-dev-setup-2026-edition
→ rkey: 2026-02-18-ben-s-dev-setup-2026-edition
→ at://did:plc:tevykrhi4kibtsipzci76d76/site.standard.document/2026-02-18-ben-s-dev-setup-2026-edition
```

The whole pipeline runs as part of the
[GitHub Actions deploy workflow](https://github.com/benswift/benswift.github.io/blob/main/.github/workflows/deploy.yml).
After tests pass, a publish script authenticates with the PDS, diffs content
hashes against a state file to find new or changed posts, and calls `putRecord`
for each one. The state file gets committed back to main[^skipci], and VitePress
picks up the AT-URIs at build time to inject
`<link rel="site.standard.document">` tags and citation metadata into the HTML.

[^skipci]:
    With `[skip ci]` in the commit message, naturally, to avoid an infinite
    deploy loop.

Verification works in both directions: the site serves a
`/.well-known/site.standard.publication` file pointing to the publication's
AT-URI, and each built page includes the document AT-URI in its `<head>`. Any
indexer can match the web content to the protocol records and confirm they
belong together.

## Why not Sequoia?

[Sequoia](https://sequoia.pub) is a perfectly good CLI for publishing
standard.site records---it handles authentication, record creation, and the
well-known file out of the box. I hand-rolled the integration anyway, for one
specific reason: deterministic record keys.

The core idea comes straight from Berners-Lee's
[cool URIs](https://www.w3.org/Provider/Style/URI) principle. If you're creating
persistent identifiers, the mapping from content to identifier should be
_computable_, not stored. My post at `/blog/2026/02/18/my-post` will always get
the rkey `2026-02-18-my-post`, which means its AT-URI is computable from the URL
alone:

```ts
export function pathToRkey(postPath: string): string {
  const match = postPath.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)/);
  if (!match) throw new Error(`Invalid post path: ${postPath}`);
  const [, year, month, day, slug] = match;
  return `${year}-${month}-${day}-${slug}`;
}
```

This matters because it means the identifiers survive state file loss. If my
`atproto-state.json` vanishes tomorrow, I can reconstruct every AT-URI from the
post paths alone. The state file is just an optimisation cache for skipping
unchanged posts---it's not the source of truth for identifiers.

Sequoia, like most atproto tooling, generates
[TID-based](https://atproto.com/specs/record-key) rkeys---opaque
timestamp-derived strings like `3jzfcijpj2z2a`. They're unique, but they're not
deterministic. If you ever needed to republish your records (new PDS, corrupted
repo, whatever), you'd get different rkeys and different AT-URIs. Any citations
pointing to the old URIs would break. The whole point of persistent identifiers
is that they don't do that.

Anyway, I've had this blog online for over a decade now and I _think_ it's got
at least some Google-juice (whether that stuff even matters anymore). Changing
all the URLs just seems like a bad idea to throw all those direct links away.

## Citation metadata

The other half of this is making the identifiers useful for citation tools.
Every blog post now includes
[Google Scholar / Zotero compatible](https://scholar.google.com/intl/en/scholar/inclusion.html#indexing)
meta tags:

```html
<meta name="citation_title" content="Ben's dev setup 2026 edition" />
<meta name="citation_author" content="Ben Swift" />
<meta name="citation_date" content="2026-02-18" />
<meta
  name="citation_public_url"
  content="https://benswift.me/blog/2026/02/18/ben-s-dev-setup-2026-edition"
/>
```

And the "Cite this post" component at the bottom of each post generates BibTeX
with the AT-URI in the `note` field:

```bibtex
@online{swift2026benSDevSetup2026Edition,
  author = {Ben Swift},
  title = {Ben's dev setup 2026 edition},
  url = {https://benswift.me/blog/2026/02/18/ben-s-dev-setup-2026-edition},
  year = {2026},
  month = {02},
  note = {AT-URI: at://did:plc:tevykrhi4kibtsipzci76d76/site.standard.document/2026-02-18-ben-s-dev-setup-2026-edition},
}
```

It's not a DOI, and no reference manager will resolve it automatically (yet).
Maybe I should try and land a PR in Zotero or something. But it _is_ a
verifiable, persistent, self-issued identifier that lives on federated
infrastructure. If someone cites a blog post of mine in a paper and includes the
AT-URI, that identifier will resolve as long as the AT Protocol network
exists--- independent of whether `benswift.me` is still pointing at the right
server.

AT-URIs don't have the institutional weight of DOIs. No journal, funder, or
university recognises them as "proper" persistent identifiers. And who even
knows if my next promotion case is going to get any benefit from links to my
stupid blog. The resolution infrastructure is young---there's no equivalent of
`doi.org` that an AT-URI cleanly resolves through. And the `standard.site`
lexicons are still finding their shape; the spec could evolve in ways that
require migration.

There's also a philosophical tension: I'm relying on the AT Protocol network
being around long-term, which is a bet on a specific federation protocol
surviving. That said, it's a more distributed bet than trusting a single domain
registrar. And because the DID layer is separable from any particular PDS, the
identifiers have a plausible path to outliving any individual service provider.

For now, this is an experiment in treating blog posts as first-class scholarly
artefacts---with real identifiers, real metadata, and a real citation workflow.
If the AT Protocol ecosystem grows the way its proponents hope, these
identifiers might actually matter. And if it doesn't, well, the citation meta
tags and BibTeX still work without them. Cite me and prove me right!
