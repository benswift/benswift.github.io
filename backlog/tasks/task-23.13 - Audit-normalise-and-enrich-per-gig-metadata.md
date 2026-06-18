---
id: TASK-23.13
title: 'Audit, normalise and enrich per-gig metadata'
status: To Do
assignee: []
created_date: '2026-06-18 01:09'
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
- [ ] #1 All dates normalised to bare YYYY-MM-DD; index.astro filename fallback no longer needed
- [ ] #2 ACMC'21 date mismatch reconciled against the real event date
- [ ] #3 Migration cruft removed from all bodies; real video URLs lifted into video_url
- [ ] #4 instrument field populated for all 27 (Impromptu <=2011, Extempore 2013+)
- [ ] #5 ICLC'20 proceedings link moved from event_url to related_works; event_url corrected or removed
- [ ] #6 Missing event_urls backfilled where findable
- [ ] #7 Ben added as explicit creator with ORCID; collaborator ORCIDs added where known
- [ ] #8 related_works populated for gigs with proceedings/papers; type sharpened; thin descriptions improved
- [ ] #9 pnpm typecheck passes and all gigs still validate
<!-- AC:END -->
