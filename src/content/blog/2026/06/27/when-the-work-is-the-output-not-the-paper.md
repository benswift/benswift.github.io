---
title: "When the work is the output, not the paper"
description:
  "The second wave of making my studio's work citable: AI installations and
  tools as research outputs, and the Zenodo metadata that keeps each record
  honest."
tags: ["research", "ai"]
---

Earlier this month I
[gave my livecoding gigs DOIs](/blog/2026/06/18/giving-my-livecoding-gigs-a-doi/).
That was the easy case, in one narrow sense: a livecoding gig has no paper. The
performance is the whole of the output, so there was never much question about
what the citable thing was. The rest of the Cybernetic Studio's work is messier.
_PANIC!_ has two papers attached to it; _LLMs Unplugged_ has one. Once a paper
exists, the temptation is to let the paper be the research output and to file
the installation as the thing the paper is about.

For these works that gets it the wrong way round. The work itself is the output,
whatever physical form it takes, and the paper only documents it.

So this is the second wave: turning the Cybernetic Studio's creative-AI works
into citable research outputs the way I did the gigs. There are seven of them.
[_PANIC!_](https://doi.org/10.5281/zenodo.17410742) wires generative models into
a feedback loop and lets visitors watch the meaning drift; the _Perceptron
Apparatus_ is a hand-cranked machine that performs a small neural network's
arithmetic by hand; _LLM Brainscan_ paints every weight of a transformer onto an
8K display as it trains. [_Slop Salon_](https://slopsalon.art) is a collective
of AI agents making art in public; the _APS AI Transparency Tracker_ scrapes
every Commonwealth agency's AI statement daily and commits the diffs to git;
_Imaginative Restoration_ was built with NIDA and the National Film and Sound
Archive; and [_LLMs Unplugged_](https://doi.org/10.5281/zenodo.17403824) is a
shelf of literary language models printed and bound as books. Each now has a
concept DOI through Zenodo, the all-versions identifier that redirects to the
latest archived release, so a citation doesn't go stale as a living work keeps
shipping.[^concept]

Most of these works live in GitHub repos, and Zenodo has a tidy integration for
that: tag a release, and it archives a source-zip and mints a fresh version DOI
on its own. But this is a pretty 'software' workflow: every automatic deposit
comes out typed as _Software_ and licensed _MIT_. For a repo of code that is
exactly right, because a source-zip of the tracker honestly is software and
honestly is MIT. For an installation that's a bit of a lie. _PANIC!_ isn't
software. It is an installation that happens to have software inside it, and its
archive shouldn't introduce itself as a code library.

The fix is a `.zenodo.json` committed to each repo, setting the type, licence,
creators, keywords and related identifiers that every future release will carry.
The Zenodo-GitHub integration doesn't do this: it reads `.zenodo.json` and
ignores `CITATION.cff`. Several of my repos had `.cff` files sitting in the
root, looking authoritative and controlling precisely nothing about the
deposit.[^cff]

The licence thing is subtle, because once you've decided a thing is "creative",
the instinct is to reach for a Creative Commons licence, and for art the reflex
is CC-BY-NC-SA: no commercial use, share alike. You must never put a
non-commercial licence on code. The NC clause contradicts the open-source grant
the code already carries. MIT says do anything with the code, including sell it;
NC says you may not; one set of files cannot say both. So the rule I settled on
is to let the licence follow the bytes. If the deposit is a source-zip it is
Software and it is MIT, full stop, however creative the work it stands for.
CC-BY-NC-SA is reserved for the deposits that are themselves creative or
teaching artefacts: the _LLMs Unplugged_ books through Cybernetic Studio Press,
not the code that typesets them.

The companion papers get linked rather than cited. _PANIC!_ carries related
identifiers pointing at two things: its NIME 2025 proceedings entry, and the
[IEEE SMC 2025 paper](https://doi.org/10.1109/SMC58881.2025.11342470) that runs
a persistent-homology analysis over the same installation runs. Both are tagged
`isDocumentedBy`. _LLMs Unplugged_ points at its
[ACE 2026 paper](https://doi.org/10.1145/3786228.3786237) the same way. The
installation record points at the papers that document it (rather than a paper
record laying claim to the artwork).

A few things don't come out clean. The linking only runs one way under my
control. I can point my own Zenodo records at the NIME, IEEE and ACM DOIs, but I
can't make theirs point back, because those records belong to the publishers and
the conference communities and I'm a guest in them. The cross-reference is half
a handshake. The credit is lossy, too. The point of listing creators in
`.zenodo.json` is to attach ORCIDs, so authorship is machine-readable and
unambiguous, but most of my collaborators on these works are practitioners and
fabricators who simply aren't in the ORCID registry. A search this June turned
up exactly one claimable ORCID among them. For everyone else the record carries
a name and nothing more.

The most awkward gap is that Zenodo has no upload type for "interactive
installation". The list runs to software, dataset, publication, image, video and
a catch-all "other", and that's the lot. An 8K data-art piece and a room-sized
participatory installation both have to file as either software or "other". It's
software when a source-zip is the honest deposit, and "other" when nothing
zippable really stands in for the work. The closest honest mapping wins, but
none of them is the true thing. This is the same shape of problem the gigs had.
The umbrella I wanted to call a "collection" had to be typed "other", because
Zenodo has no such category. The vocabulary runs out before the work does.

None of this teaches Zenodo what an installation is. What the `.zenodo.json`
files gives me is records that describe themselves accurately: code filed as
code, creative work filed as creative work. The seven works are gathered into a
Cybernetic Studio community alongside the livecoding one, so the whole portfolio
sits in a single place. When the metadata is still wrong, and in a couple of
places it is, it's wrong because Zenodo ran out of words, not because I couldn't
be bothered getting it right.

[^concept]:
    Concept versus version DOIs, and the rest of the Zenodo machinery, I covered
    in the [livecoding post](/blog/2026/06/18/giving-my-livecoding-gigs-a-doi/);
    the short version is that you cite the concept DOI rather than a frozen
    version, so the citation tracks the living work instead of one snapshot of
    it.

[^cff]:
    The `.cff` isn't useless: GitHub reads it for the "Cite this repository"
    button in the sidebar. It just has no say over what Zenodo deposits, which
    is the opposite of what its prominence in the repo root would suggest.
