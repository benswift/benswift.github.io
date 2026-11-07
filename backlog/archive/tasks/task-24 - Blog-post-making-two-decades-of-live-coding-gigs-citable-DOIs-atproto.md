---
id: TASK-24
title: 'Blog post: making two decades of live-coding gigs citable (DOIs + atproto)'
status: Done
assignee: []
created_date: '2026-06-18 10:25'
updated_date: '2026-06-18 10:37'
labels:
  - writing
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Write up the TASK-23 work as a blog post. The why: live-coding gigs as non-traditional research outputs (the performance IS the output), made citable for an ANU promotion case. The how: per-gig DataCite DOIs via Zenodo, a collection-level umbrella concept DOI + a Zenodo community, and a self-owned atproto layer (site.standard.document + companion me.benswift.ntro records) cross-linked to the DOIs both ways. The honest bits: Zenodo has no Collection type so the umbrella is upload_type 'other'; media is link-only; GitHub Actions secrets are write-only so creds ran locally; the significance-note 'done example' that never existed. Link the /livecoding hub, the research-statement page, and the concept DOI 10.5281/zenodo.20743614.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Scaffolded via 'pnpm run post' with a description under 160 chars
- [x] #2 Narrative covers why/how/honest-limitations and links the hub, research-statement page, and concept DOI
- [x] #3 Drafted via benswift-writer then jamesian (BALANCED); Australian spelling; no ## headings in the narrative
- [x] #4 Hero image added per the image pipeline
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
DONE 2026-06-18: src/content/blog/2026/06/18/giving-my-livecoding-gigs-a-doi.md. Narrative (no ## headings, footnotes, AU spelling) covers why (ephemeral gigs as NTROs) / how (per-gig Zenodo DataCite DOIs + umbrella concept DOI + community; atproto document+ntro cross-linked to the DOI) / honest limits (no Zenodo Collection type, link-only media, write-only Actions secrets). Links the hub, research-statement page, concept DOI. benswift-writer + jamesian BALANCED. Hero AVIF via gen:hero-images, og:image wired. published:true (Ben to review before pushing).
<!-- SECTION:NOTES:END -->
