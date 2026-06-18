---
id: TASK-23.06
title: Extend the livecoding collection schema (content.config.ts)
status: Done
assignee:
  - '@claude'
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 01:32'
labels:
  - data
  - schema
dependencies: []
parent_task_id: TASK-23
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add the metadata fields the NTRO build needs to the livecoding zod schema. All optional, so existing gigs keep validating. Foundational for the scripts and pages.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Optional fields added: doi, for_codes (ANZSRC), related_works (type + identifier/url + relation), archived_event_url, archived_venue_url, license
- [x] #2 artists objects gain an optional orcid; Ben's own ORCID recorded where relevant
- [x] #3 pnpm typecheck passes and all 27 existing gigs still validate
- [x] #4 videos[] array (each {url, label?}) added, superseding singular video_url, to support multi-video gigs (revenant x2, ap-sessions x4)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added to livecoding schema (src/content.config.ts): doi, for_codes (ANZSRC), related_works ({relation, identifier?, url?, type?}), archived_event_url, archived_venue_url, license, videos[] ({url, label?}), and artists[].orcid. video_url kept (deprecated) until .14 migrates bodies and .11 updates the UI. Pulled forward two schema changes that .13 needs so all schema edits land in one commit: instrument enum (Impromptu/Extempore) and a 'juried' value on the type enum. related_works.relation/type left as free strings keyed to the DataCite relationType/resourceTypeGeneral vocabularies — the deposit script (.08) does strict validation. typecheck/lint/format/97 unit tests all green; all 27 gigs validate. OPEN: actual ORCID values (incl. Ben's own) not yet recorded — deferred to .13 enrichment, needs Ben's ORCID.
<!-- SECTION:NOTES:END -->
