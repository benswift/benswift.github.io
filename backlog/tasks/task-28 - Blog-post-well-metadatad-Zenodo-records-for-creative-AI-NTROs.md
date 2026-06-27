---
id: TASK-28
title: "Blog post: well-metadata'd Zenodo records for creative-AI NTROs"
status: To Do
assignee: []
created_date: "2026-06-27 00:21"
labels:
  - writing
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->

Companion to the live-coding DOI post (TASK-24): write up the second wave of
this work --- turning the studio's creative-AI works (interactive installations,
data-art, live research tools: PANIC!, Perceptron Apparatus, LLM Brainscan, Slop
Salon, APS AI Transparency Tracker, Imaginative Restoration, LLMs Unplugged)
into properly-described, citable research outputs for the ANU promotion case.
The why: these are NTROs --- the installation/tool IS the output. The how: cite
concept (all-versions) DOIs, never version DOIs; control the GitHub->Zenodo
release integration with a committed .zenodo.json (it reads .zenodo.json, NOT
CITATION.cff); set type and licence by what the deposited files actually are (a
repo source-zip is honestly Software/MIT) --- and CC must never go on code,
because the NC clause contradicts the open-source grant; reserve CC-BY-NC-SA for
genuinely creative/teaching deposits; cross-link companion papers via
related_identifiers/isDocumentedBy (PANIC!<->SMC 2025, LLMs Unplugged<->ACE
2026); and group the set in a curated Zenodo community (Cybernetic Studio). The
honest bits: you can only point TO publisher-/community-owned DOIs (NIME, IEEE,
ACM), not edit them; few of the artist collaborators have ORCIDs; Zenodo has no
installation/creative-work type, so 'other' or 'software' is the closest honest
mapping. Source of truth for the conventions: blowing-smoke's ntro-register.md.

<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

<!-- AC:BEGIN -->

- [ ] #1 Scaffolded via 'pnpm run post' with a description under 160 chars
- [ ] #2 Narrative covers why/how/honest-limitations and cross-links the related
      NTRO/citability posts: the companion live-coding DOI post
      (giving-my-livecoding-gigs-a-doi), the 2021 'How to cite code? Leading by
      example' post, the AT-URIs persistent-identifiers post
      (at-uris-as-persistent-identifiers-for-scholarly-blogging), and the 2022
      'AI art installations and livecoding gigs in Nov/Dec' roundup for context
      on the works themselves --- plus any other relevant posts surfaced when
      drafting
- [ ] #3 Drafted via benswift-writer then jamesian (BALANCED); Australian
      spelling; no ## headings in the narrative
- [ ] #4 Hero image added per the image pipeline
<!-- AC:END -->
