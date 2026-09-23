---
id: TASK-23.11
title: '/livecoding hub + GigLayout: surface DOIs, archived links, related works'
status: Done
assignee: []
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 05:18'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-23
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Render the new metadata on the site. Per-gig pages show the DOI (cite/badge), archived event/venue links, related works and video; the hub frames the body of work and optionally shows a timeline of premier-venue gigs. Depends on the schema, deposit and public-intro tasks.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Per-gig page displays the DOI (citable), archived links, related works and video
- [x] #2 Hub page shows the body-of-work framing; optional timeline of premier-venue gigs
- [x] #3 Renders accessibly; pnpm build and typecheck pass
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
DONE — build + typecheck pass; rendering verified in a real browser (astro
preview + agent-browser) on the /livecoding hub and a gig page, using a
temporary DOI + collection fixture that was reverted afterwards.

GigLayout now surfaces: the DOI (citable monospace link to doi.org), instrument,
videos[] (multiple, with optional labels), archived event/venue links (inline
"(archived)"), and a Related works section (<section> + aria-labelledby <h2> +
relation-labelled links via a DataCite relationType label map).
src/pages/livecoding/[slug].astro passes the new frontmatter through.

video_url -> videos[]: switched in GigLayout + PerformancesList and DROPPED from
the content.config livecoding schema (no gig frontmatter still used it —
migrated in .14). PerformancesList (used on the research + CV pages) now shows
per-gig video link(s) and a DOI link, which suits that citation-style list.

Hub (/livecoding): added a body-of-work framing line ("these 27 performances
span 2008-2025: nearly two decades ... gathered here as a single body of work")
and a citation block (collection concept DOI + Zenodo community link) that
renders ONLY when src/data/livecoding-collection.ts is non-null. That file is a
committed null PLACEHOLDER for now; the .09 production publish (writeSiteData)
overwrites it with the real concept DOI + community URL. Also updated .09's
generator to emit the `| null` type so the UI guard stays valid.

DEFERRED (by design): the warm public intro copy is TASK-23.04 (writing track) —
this adds only a factual framing line, not the full intro. The optional
premier-venue timeline (AC #2 says optional) was skipped to keep scope tight.
Real DOIs render once production minting happens (gated on .02); verified here
via a fixture.
<!-- SECTION:NOTES:END -->
