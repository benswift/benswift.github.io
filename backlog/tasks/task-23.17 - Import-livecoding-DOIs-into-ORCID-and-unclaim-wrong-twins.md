---
id: TASK-23.17
title: Import livecoding DOIs into ORCID and unclaim wrong twins
status: To Do
assignee: []
created_date: '2026-06-24 01:05'
updated_date: '2026-06-24 01:05'
labels:
  - admin
  - orcid
  - 'needs:ben'
dependencies: []
parent_task_id: TASK-23
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Get the livecoding DataCite DOIs onto Ben's ORCID record (0000-0003-2138-5969) via the ORCID 'Add works > Search & link > DataCite' wizard, ideally driven by a logged-in agent-browser session. Each Zenodo record has two DOIs (a concept DOI and a version DOI), both registered under Ben's ORCID, so the wizard lists every gig twice. We want exactly ONE per gig: the version DOI for each gig (matches the site frontmatter, the umbrella HasPart graph, atproto records and BibTeX), plus the concept DOI for the umbrella. Ben may have already claimed some of the wrong (twin) DOIs in an earlier pass before realising there were two of each, so those need unclaiming. This is the ORCID leg of the DataCite -> ORCID -> ResearchPortalPlus(Pure) chain; see TASK-23.12 for the ANU/Pure side.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All 28 canonical livecoding DOIs (27 gigs + umbrella) are present on Ben's ORCID record
- [ ] #2 None of the 28 concept/version twins are claimed on the ORCID record
- [ ] #3 Any previously-claimed wrong twins from the earlier pass have been unclaimed/removed
- [ ] #4 DataCite ORCID auto-update is enabled so future gigs flow automatically (account.datacite.org Profiles)
- [ ] #5 Non-gig works under the same ORCID (LLMs Unplugged book, My First Language Model, Perceptron Apparatus, Slop Salon, LLM Brainscan, Imaginative Restoration) were handled deliberately, not swept in by accident
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Concept vs version DOIs

Each Zenodo record mints two DataCite DOIs: a CONCEPT DOI (lower number,
represents all versions) and a VERSION DOI (higher number, the specific
deposit). Both carry Ben's ORCID, so the DataCite Search & Link wizard lists
each gig twice. The wizard UI does NOT label which is which (title/type/DOI are
identical across a pair). Heuristic: within a consecutive pair the version DOI
is the HIGHER number — EXCEPT the umbrella, where we want the concept (lower,
...614). Use the explicit list below rather than the heuristic.

Derived from the umbrella's HasPart graph via the DataCite REST API
(api.datacite.org, query creators.nameIdentifiers.nameIdentifier:0000-0003-2138-5969),
not guessed.

## IMPORT these 28 (27 gigs + umbrella)

10.5281/zenodo.20743614  Live-coding performances: a body of work (UMBRELLA — concept DOI)
10.5281/zenodo.20743627  Transmissions in Sound
10.5281/zenodo.20743629  ACMC '09
10.5281/zenodo.20743633  Beginning-Middle-End Festival
10.5281/zenodo.20743637  MuMe Algorave at ISEA 2013
10.5281/zenodo.20743642  Revenant Media: Theremin '75 Exhibition
10.5281/zenodo.20743646  ICOMOS 2013
10.5281/zenodo.20743648  "Art, Not Apart" Festival
10.5281/zenodo.20743650  "You Are Here" Festival
10.5281/zenodo.20743652  John Hosking Farewell Reception
10.5281/zenodo.20743656  ACMC '14
10.5281/zenodo.20743660  The AP Sessions
10.5281/zenodo.20743664  Innovation ACT 2015 Launch
10.5281/zenodo.20743666  Collected Resonances: Session 2
10.5281/zenodo.20743668  National Science Week '17 ACT Launch
10.5281/zenodo.20743670  National Invention Convention '18 Closing
10.5281/zenodo.20743672  Soundscapes Concert Series #21
10.5281/zenodo.20743676  National Science Week '18 ACT Launch
10.5281/zenodo.20743684  Shirty Science Season 3 launch party
10.5281/zenodo.20743687  CECS Welcome Party 2019
10.5281/zenodo.20743689  Colour Coded
10.5281/zenodo.20743691  smoke
10.5281/zenodo.20743698  ICLC'20 Algorave
10.5281/zenodo.20743700  ACMC'21 Evening Concert #1
10.5281/zenodo.20743702  ACMC'22 Evening Concert #1
10.5281/zenodo.20743704  OzCHI '22 Connected Creativity Algorave
10.5281/zenodo.20743708  Coloring Code - Live Drawing and Coding
10.5281/zenodo.20743710  SMCClab live #1

## SKIP these 28 twins (unclaim if already on the record)

614->skip 615; and skip the OTHER number of each gig pair:
626, 628, 632, 636, 641, 645, 647, 649, 651, 655, 659, 663, 665, 667, 669,
671, 675, 683, 686, 688, 690, 697, 699, 701, 703, 707, 709  (all 10.5281/zenodo.<n>)
plus 20743615 (umbrella version twin)
<!-- SECTION:NOTES:END -->
