---
id: TASK-28
title: 'Blog post: well-metadata''d Zenodo records for creative-AI NTROs'
status: Done
assignee: []
created_date: '2026-06-27 00:21'
updated_date: '2026-06-27 01:29'
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
- [x] #1 Scaffolded via 'pnpm run post' with a description under 160 chars
- [x] #2 Narrative covers why/how/honest-limitations and cross-links the related
      NTRO/citability posts: the companion live-coding DOI post
      (giving-my-livecoding-gigs-a-doi), the 2021 'How to cite code? Leading by
      example' post, the AT-URIs persistent-identifiers post
      (at-uris-as-persistent-identifiers-for-scholarly-blogging), and the 2022
      'AI art installations and livecoding gigs in Nov/Dec' roundup for context
      on the works themselves --- plus any other relevant posts surfaced when
      drafting
- [x] #3 Drafted via benswift-writer then jamesian (BALANCED); Australian
      spelling; no ## headings in the narrative
- [x] #4 Hero image added per the image pipeline
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
DRAFT 2026-06-27 (published:true, Ben to review before push): src/content/blog/2026/06/27/when-the-work-is-the-output-not-the-paper.md. Companion to the livecoding-DOI post. Spine: the work (installation/tool/printed model) is the NTRO, the paper merely documents it; cite the creative-work concept DOI and link companion papers via related_identifiers/isDocumentedBy (PANIC! <-> NIME 2025 + IEEE SMC 2025; LLMs Unplugged <-> ACE 2026). How: GitHub->Zenodo defaults to Software/MIT (honest for a source-zip, a category error for an installation); fix via committed .zenodo.json (Zenodo reads it, NOT CITATION.cff); set type+licence by the actual deposited bytes; never CC-NC on code (NC clause contradicts the open-source grant), reserve CC-BY-NC-SA for genuinely creative/teaching deposits; group in a Cybernetic Studio community. Honest limits: can only point TO publisher/community DOIs (NIME/IEEE/ACM), not edit them; collaborators mostly lack ORCIDs (one claimable); Zenodo has no installation type so 'other'/'software' is the closest honest map. Pipeline: benswift-writer + jamesian BALANCED, AU spelling, no ## headings, footnotes, links verified. Hero AVIF via gen:hero-images. Source of truth: blowing-smoke ntro-register.md.
<!-- SECTION:NOTES:END -->
