---
title: "Giving my livecoding gigs a DOI"
description:
  "Turning nearly two decades of ephemeral livecoding gigs into citable research
  outputs, with DataCite DOIs through Zenodo and a self-owned atproto layer."
published: true
tags: ["livecoding", "research", "music"]
---

The awkward thing about livecoding is that the gig is the output. You write code
on stage, live, and that code-writing (in
[Extempore](https://github.com/digego/extempore), these days) _is_ the music.
When the set ends, the work is over. A recording is a useful trace, but it isn't
the thing. So when I decided I wanted my livecoding performances to count as
research outputs, I walked straight into an awkward question: how do you make
something permanent and citable out of an act that, by definition, only happened
once?

I have nearly two decades of these gigs, going back to 2008.[^count] Most
academics measure their research output in papers, but a performance can count
too, as a non-traditional research output, an NTRO in the jargon. For that to
mean anything, each gig needs the apparatus a paper takes for granted: a
permanent identifier, and a landing page you can point at and say "that
happened, and here's where it lives".

So I gave them DOIs.

Each gig now has a DataCite DOI, minted through [Zenodo](https://zenodo.org).
The nice thing about Zenodo's API is that it pre-reserves the DOI, so I can
write it into the page's own frontmatter before the record goes live, rather
than chasing it afterwards. A script does the whole thing, and it is carefully
idempotent, because a DOI is permanent and the last thing I want is to
accidentally mint a second one for a gig that already has one.[^sandbox]

The body of work also gets a DOI of its own. An umbrella record sits above the
twenty-seven gigs, each of them linked to it, all gathered into a
[Zenodo community](https://zenodo.org/communities/ben-swift-livecoding) so the
collection can grow as I play more. You can cite a single performance, or cite
the [whole two decades at once](https://doi.org/10.5281/zenodo.20743614).

This is roughly where the abstractions started to leak. I wanted the umbrella to
be a "collection", but Zenodo has no such type, so underneath it is really an
upload of type "other" with a list of "has part" links doing the collecting. The
thing I wanted to name didn't exist, so the links became the collection. The
media is link-only too: the videos stay on Vimeo and YouTube, referenced rather
than uploaded, partly for rights reasons and partly because Zenodo isn't where
my video should live. Each record's only actual file is a placeholder.

DOIs buy me the institutional kind of permanence, the sort DataCite and Zenodo
underwrite. I also wanted these records to be _mine_, though, not just entries
in someone else's repository. So each gig gets a second home on
[atproto](https://atproto.com): a `site.standard.document` record for the page,
plus a companion record in a namespace I invented (`me.benswift.ntro`) that
carries the DOI and a cryptographic pointer back to the document. The two
systems cross-reference each other. The atproto record holds the Zenodo DOI, and
the Zenodo record carries the atproto `at://` URI as a related identifier.
Zenodo cheerfully accepted a raw `at://` URI, which I had rather expected it to
reject.

There was one small re-learning along the way. My blog already publishes its
atproto records from CI, with the credentials living in GitHub Actions secrets,
so I went to read those secrets back out and run the livecoding version locally.
You cannot, of course. Actions secrets are write-only by design, which is
obvious the moment you say it aloud. I ran the script locally with the
credentials from somewhere I _could_ read.

All of this is plumbing, and plumbing needs a tap. The human-facing version is
at [benswift.me/livecoding](/livecoding/): every gig, with its DOI and whatever
documentation survived. There is also a more formal
[research statement](/livecoding/research-statement/) with a note on each of the
anchor performances, for anyone who wants the version written for a promotion
committee rather than a curious reader.

Does any of this solve the problem I started with? Not really. A DOI doesn't
bring back a 2009 set whose recording never survived.[^crash] The performance is
still gone. What the DOI gives me is somewhere permanent for the _claim_ to
live: that the gig happened, and that you can cite it the same way you would
cite a paper. The work was always ephemeral. The record of it no longer has to
be.

[^count]:
    Twenty-seven, anyway: the ones I can document. A few are genuinely lost to
    time, and I've made my peace with that by assuming they were the highlights.

[^sandbox]: Everything ran against Zenodo's sandbox first, for the same reason.

[^crash]:
    The recording is no great loss. I had a leak in my networking code that
    froze the whole system about ten minutes in, and I spent the rest of the set
    trying to debug it on stage while the music kept playing and nothing
    responded to my edits. A good learning experience, as they say.
