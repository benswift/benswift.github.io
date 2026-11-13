---
id: doc-01
title: 'NTRO register: status, Zenodo hygiene and RP+ lodgement'
type: guide
created_date: '2026-11-13T20:55:00Z'
---

This document holds the process notes behind Ben's non-traditional research outputs (NTROs). The per-output data --- category, sub-category, standard vs major, FoR codes, DOIs, verification evidence, RP+ lodgement status and the research statement itself --- is the `ntro` content collection (`src/content/ntro/*.md`, schema in `src/utils/content-schemas.ts`). NTRO #1, the live-coding body of work, is the `livecoding` collection plus `src/data/livecoding-research-statement.md`. The collection is data only: no page reads it. cybernetics-website's `ntro:` blocks are copies; `pnpm ntro:check` compares them.

The fields follow the _ANU Guidelines for Research in Creative Works and other Non-Traditional Research Outputs_ (Draft V10, 29 Jan 2019) and the ARC/ERA framework, and the research statements are written to be lifted verbatim into RP+/ARIES and into promotion cases. The CV's `#ntro` plates are the compressed shop-window.

## Status, and what still needs doing

A Zenodo DOI plus a CV plate does **not** make an NTRO count institutionally ---
each must be lodged as a record in **RP+ (Research Portal Plus)**, from where,
after validation, it flows into Open Research (the ANU repository). The
lodgement itself is **self-serve**: I enter each NTRO into RP+ --- carrying its
existing DOI --- the RP+ team validates it, then the repository team assesses
open-access status and the record flows through to Open Research. (Verified 29
Jun 2026 with the ANU repository team --- Zixiao, via Izabela Hoang; the front
door for lodgement and queries is `repository.admin@anu.edu.au`.)

What is **not self-serve** is sign-off on the research _coding_ --- FoR code,
category / sub-category, standard-vs-major: the coding in each record (`coding_status: proposed`)
is my best mapping and still needs validation, routed via the School
publication-collection officer / `admin.cybernetics`, the SoCy ERIC portfolio
(Chris Danta, content) and the RP+ team (tracked in TASK-35). There is no ANU
guidance on the NTRO research statement itself --- `systems.ris@anu.edu.au`
assists, and the University of Melbourne's public
[NTRO-submission guide](https://library.unimelb.edu.au/research-outputs/home/add-research-outputs-to-find-an-expert/guide-to-preparing-your-ntro-submission)
is a usable model. One open point to confirm at lodgement: whether RP+ is
content to carry the existing Zenodo/DataCite DOIs, or would prefer a parallel
Open Research deposit.

Caveat on ERA: the national round is in abeyance (ERA 2018 was the last
completed round; ERA 2023 was cancelled in 2022, with a data-driven successor
not yet live). So the live payoff for this data is **internal** --- the RP+
profile, promotion cases, research-active status --- plus being submission-ready
for whatever replaces ERA. Worth doing; just not against a 2023 deadline.

Per-NTRO checklist (each record's `checklist` field; tick as lodged, and lodgement itself is TASK-36):

- [ ] research statement finalised (voice pass where noted)
- [ ] category / sub-category / standard-major / FoR validated with the
      collection officer
- [ ] verification evidence filed (Appendix D file types)
- [ ] record created in RP+ / ARIES

## Zenodo metadata hygiene

A June 2026 audit of the live Zenodo records behind these outputs settled the
following conventions; the records and their source repos still need bringing
into line with them (tracked in backlog).

- **Cite concept DOIs, not version DOIs.** Every NTRO and every performance now
  cites the concept (all-versions) DOI, which redirects to the latest archived
  version. Four NTROs and the five live-coding performances were previously
  citing fixed version DOIs and have been switched.
- **Resource type / licence are set by the GitHub--Zenodo release integration**,
  which mints a fresh version on every repo release but defaults to type
  _Software_ and licence _MIT_. That is correct for the code archive but
  undersells records framed here as creative works, and an MIT licence on an art
  installation is a category error. Fix: keep the integration (automatic
  versioned archival is worth having) but commit a `.zenodo.json` to each repo
  so future releases carry the right type, licence (a Creative Commons licence
  for the creative work; keep MIT for pure code/tools), creators-with-ORCIDs,
  keywords, related identifiers and community. Existing published records can be
  metadata-edited in place via the Zenodo API without minting a new DOI.
  Zenodo's GitHub integration reads `.zenodo.json`, **not** `CITATION.cff`, so
  the existing `.cff` files do not control deposit metadata.
- **Companion-paper links** belong in each record's related identifiers
  (`isSupplementTo` / `isDocumentedBy`): _PANIC!_ <-> the SMC 2025 _Semantic
  Topologies_ paper (doi:10.1109/SMC58881.2025.11342470) and the NIME 2025
  proceedings entry (10.5281/zenodo.17800975); _LLMs Unplugged_ <-> the ACE 2026
  paper (doi:10.1145/3786228.3786237). The live-coding records already model
  this well.
- **Canonical-site links.** Where a work has a living home on the web (e.g.
  `slopsalon.art`, the tracker site, or a `benswift.me` project page), add that
  URL to the record's related identifiers --- the field takes a plain URL, not
  just a DOI --- with a relation such as `isVariantFormOf` (the living version)
  or `isDocumentedBy` (a write-up). The DOI still resolves to Zenodo, but the
  Zenodo page then routes readers to the canonical site; this is the practical
  middle ground short of minting DOIs that resolve to my own site (the someday
  item). Set it in each repo's `.zenodo.json` (`related_identifiers`) for future
  releases, or edit a published record in place via the Zenodo API (no new DOI).
- **Co-creator ORCIDs.** A registry search (June 2026) found a claimable ORCID
  only for Sungyeon Hong (0000-0002-9897-1205, co-author of the SMC paper).
  Andrew Sorensen, Giovanni Muzio (only an empty namesake record), Leon Volbers,
  Beverly Edwards, Adrian Schmidt and the seven NIDA collaborators on
  _Imaginative Restoration_ have no verifiable ORCID --- most are practitioners
  not in the registry. Ben, Kieran Browne, Charles Martin and Jessica Herrington
  already carry ORCIDs on their records.
- **Grouping community.** Only the live-coding records sit in a community
  (`ben-swift-livecoding`). Consider a Cybernetic Studio community to group the
  standalone art works as a portfolio.

## RP+ lodgement categories

RP+ (the live system) classifies these differently from the ERA /
2019-guidelines names used elsewhere in this register. Its taxonomy is
form-based: a top-level output type **Non-textual form** with subcategories ---
Physical Non-textual work, Design/Architectural Work, Live Music, Live Play,
Live Dance Performance, Audio/Visual Format, Recorded/Rendered Performance,
Digital Inter-arts, Digital work, Web-site Based Work, Hosted Exhibition or
Event, Hosted Festival, Web-based Exhibition, Other Non-textual Work Form,
Portfolio. Two rules from the collection officer (Isabella Dimon, Data Quality
Team; `publications.collection@anu.edu.au`, 7 Jul 2026):

- **Lodge under "Non-textual form", never "Other contribution".** The latter
  "could exclude them from future reporting (particularly in whatever succeeds
  ERA)."
- **Evidence goes in the "Electronic version(s), and related files and links"
  field** --- that is where validators look. A self-minted DOI _alone_ is not
  sufficient, but the DOI **plus** the institutional project page
  (`cybernetics.anu.edu.au/projects/...`) **plus** supporting links (video,
  event pages, companion papers) clears the bar --- the evidence triangle now in
  place for every output. RP+ ingests **BibTeX**, so
  `cybernetics-website:ntros.bib` can be imported rather than hand-entering each
  record.

The per-NTRO RP+ subcategory proposals are in each record's `rp_plus` field (live coding, NTRO #1, is lodged as a Portfolio, with its individual gigs as Live Music --- confirmed with Bella, 7 Jul 2026).

## FoR coding approach

Every DOI in the collection is a **concept (all-versions) DOI** --- each
resolves to the latest archived version, so the citation never goes stale as a
living work gains new releases. (_PANIC!_ cites the installation/software
concept record, not the NIME-proceedings paper record `10.5281/zenodo.17800975`,
which is a companion publication.)

FoR codes are proposed per output (in each record) and need collection-officer sign-off.
The scheme is deliberately **CS-primary and consolidated**: a computing code
(usually 4608 Human-centred computing) leads every output, with a creative /
design code as the secondary that signals the NTRO character and an AI/ML code
where the subject demands. Consolidating matters --- ERA apportions each output
across at most three codes (each >=20%), and a four-digit FoR is only evaluated
for a unit once it clears a volume threshold, so leaning the portfolio on a few
codes (4608 as the backbone; 460208/460307/461103 as recurring AI secondaries;
360503 as the creative signal) builds a coherent, assessable profile rather than
a scatter. Note the 2020 classification predates the generative-AI boom, so
there is no dedicated LLM/generative code --- language tasks land in 460208 NLP,
multimodal/generative work in 460307, the model/method itself in 461103. Each
output carries a **first-pass percentage split** (6-digit 2020 codes, from
`benswift-me:_data/FoR-Codes-2020-processed.csv`) --- a starting point for that
conversation, not a settled allocation.

## Provenance

- Output content, contributions, DOIs and exhibition records: `benswift-cv.typ`
  (the `#ntro` plates, section _Exhibitions, performances and compositions_).
- Live-coding research statement (final):
  `src/data/livecoding-research-statement.md`.
- Research statements for the other outputs: the body of each
  `src/content/ntro/*.md`.
- Requirements: _ANU Guidelines for Research in Creative Works and other NTROs_,
  Draft V10 (29 Jan 2019) --- research contribution / significance (pp. 5--6),
  standard vs major output (p. 6), category table (p. 7), research-statement
  outline (Appendix C, p. 63). The 2019 PDF is no longer web-hosted; current ANU
  lodgement is via Research Portal Plus / ARIES.
