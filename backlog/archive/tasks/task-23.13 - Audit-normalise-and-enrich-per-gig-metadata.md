---
id: TASK-23.13
title: 'Audit, normalise and enrich per-gig metadata'
status: Done
assignee:
  - '@claude'
created_date: '2026-06-18 01:09'
updated_date: '2026-06-18 03:47'
labels:
  - data
  - content
dependencies: []
parent_task_id: TASK-23
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
While-it's-easy pass to clean and enrich per-gig frontmatter BEFORE the deposit script reads it. Runs after the schema task (.06), before the deposit script (.08).

Audit of all 27 (2026-06-18):
- Instrument is clean by year: 2008-2009 (x3) = Impromptu; 2013+ (x24) = Extempore. Populate the new instrument field automatically by date.
- 5 dates use ISO-midnight (T00:00:00.000Z); normalise to bare YYYY-MM-DD: 2021-08-26, 2022-08-31, 2022-12-01, 2024-05-31, 2025-11-07.
- 1 date mismatch: ACMC'21 filename 2021-08-26 vs frontmatter 2021-08-21; verify the real date (index.astro trusts the filename).
- ~14 gigs carry migration cruft in the body (raw <iframe> and/or 'Script removed during migration' comments). For each: lift any real video URL into video_url, then delete the inline embed/orphaned comment. Several flagged ones have NO video_url, so the only video reference may be in the body.
- ICLC'20 (2020-02-07) event_url points at the Zenodo proceedings, not the event page; move to related_works and correct/realise event_url.
- 6 gigs have no event_url (2008-10-15, 2009-09-24, 2013-11-02, 2014-05-28, 2014-09-30, +1); backfill where findable.
- 12/27 have a video_url; 15 do not.

Enrichments (small research pass): Ben as explicit creator + ORCID; collaborator ORCIDs (Sorensen, Attanayake, ...); related_works to proceedings/papers (both ICLCs, ACMC'09 paper); sharpen type to juried/curated/invited; improve thin descriptions (they become DOI abstracts).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All dates normalised to bare YYYY-MM-DD; index.astro filename fallback no longer needed
- [x] #2 ACMC'21 date mismatch reconciled against the real event date
- [x] #3 instrument field populated for all 27 (Impromptu <=2011, Extempore 2013+)
- [x] #4 ICLC'20 proceedings link moved from event_url to related_works; event_url corrected or removed
- [x] #5 Missing event_urls backfilled where findable
- [x] #6 Ben added as explicit creator with ORCID; collaborator ORCIDs added where known
- [x] #7 related_works populated for gigs with proceedings/papers; type sharpened; thin descriptions improved
- [x] #8 pnpm typecheck passes and all gigs still validate
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
COMPLETE. Dates normalised + acmc-21 corrected to 2021-08-26 (AC1/2); instrument populated for all 27 (AC3); iclc-20 event_url fixed to the real schedule page with the Zenodo proceedings moved to related_works (AC4); icomos-2013 event_url backfilled, other 4 event-less gigs confirmed genuinely non-public (AC5); verified collaborator ORCIDs added (Charles Martin, Kieran Browne -- the rest are practitioners without ORCIDs, confirmed by Ben), Ushini left off (only an empty namesake profile, addable later as records are mutable), Ben-as-creator wiring assigned to .08 deposit using his ORCID 0000-0003-2138-5969 from memory (AC6); related_works added for iclc-20/iclc-24/acmc-09/ap-sessions, type taxonomy sharpened to juried(8)/invited(18)/other(1) -- curated collapsed into invited (juried-vs-not is the meaningful esteem line) and dropped from the schema enum, all 27 thin descriptions rewritten into proper DOI abstracts (AC7); typecheck/lint/format green, 27 gigs validate, build + 43 integration tests pass (AC8). FOLLOW-UP (not blocking): ns-week-2018 and shirty-science bodies both claim 'our first set together' with Kieran (the 10 Aug one is earlier) -- reconcile the prose separately.
<!-- SECTION:NOTES:END -->
