---
id: TASK-30
title: >-
  Add Zenodo DOIs to the 9 DOI-less performance records in Pure
  (ResearchPortal+)
status: To Do
assignee: []
created_date: '2026-07-23 00:06'
labels:
  - orcid
  - pure
  - admin
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Nine performance records in ANU Pure carry no DOI, which is why they duplicate rather than group with their DOI-bearing counterparts on ORCID (see TASK-29 context). Once each Pure record carries its Zenodo DOI, the next Pure->ORCID sync should auto-group the pairs.

DOI mapping (authoritative source: src/content/livecoding/*.md frontmatter, so this table can be regenerated):

| Pure record | Zenodo DOI |
|---|---|
| SMCClab live #1 (2025) | 10.5281/zenodo.20743710 |
| Coloring Code - Live Drawing and Coding (2024) | 10.5281/zenodo.20743708 |
| OzCHI '22 Connected Creativity Algorave (2022) | 10.5281/zenodo.20743704 |
| ICLC'20 Algorave (2020) | 10.5281/zenodo.20743698 |
| CECS Welcome Party 2019 | 10.5281/zenodo.20743687 |
| Soundscapes Concert Series #21 (2018) | 10.5281/zenodo.20743672 |
| National Science Week '17 ACT Launch Event | 10.5281/zenodo.20743668 |
| Collected Resonances: Session 2 (2015) | 10.5281/zenodo.20743666 |
| Revenant Media: Theremin '75 Exhibition (2013) | 10.5281/zenodo.20743642 |

Preferred route: bulk. Pure's import-from-file (BibTeX/RIS) creates NEW records rather than updating existing ones, though its duplicate detection may offer a match/merge flow -- test on one record first. If import can't update in place, fall back to (a) editing the 9 records in the Pure UI (add DOI / electronic version), or (b) generating a bib/CSV from the livecoding frontmatter and asking the research portal data team to patch the existing records. Generate the bib file from src/content/livecoding frontmatter either way so the artefact exists.

Use the version DOI (as above), not the concept DOI. Verify afterwards via a fresh Pure bib export (compare script: scratchpad compare.py pattern from 2026-07-23 session) and the public ORCID API (https://pub.orcid.org/v3.0/0000-0003-2138-5969/works) once Pure re-syncs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All 9 Pure performance records carry their Zenodo version DOI (verified via a fresh Pure bib export)
- [ ] #2 No new duplicate records created in Pure by the import route
- [ ] #3 After the next Pure->ORCID sync, the 9 duplicate pairs on ORCID have auto-grouped (single work per gig in the public API)
<!-- AC:END -->
