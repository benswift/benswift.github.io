---
id: TASK-23.13
title: 'Audit, normalise and enrich per-gig metadata'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-06-18 01:09'
updated_date: '2026-06-18 03:32'
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
- [ ] #6 Ben added as explicit creator with ORCID; collaborator ORCIDs added where known
- [ ] #7 related_works populated for gigs with proceedings/papers; type sharpened; thin descriptions improved
- [ ] #8 pnpm typecheck passes and all gigs still validate
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Done so far: (AC#1) 4 clean dates normalised + (AC#2) acmc-21 corrected to 2021-08-26 (Ben confirmed) -> all 27 dates bare/accurate; (AC#3) instrument populated for all 27 (Impromptu x3, Extempore x24); (AC#4) iclc-20 event_url fixed to the real schedule page (iclc.toplap.org/2020), the Zenodo proceedings moved to related_works; (AC#5) backfilled the one findable missing event_url (icomos-2013 -> aicomos.com/2013-canberra-centenary); transmissions, beginning-middle-end, john-hosking, ap-sessions confirmed genuinely non-public (no page). Research pass (3 subagents, verified): collaborator ORCIDs - only Charles Martin (0000-0001-5683-7529) and Kieran Browne (0000-0001-7158-1322) confidently verified and added; rest are practitioners/artists with no/unverifiable ORCID (Ben confirmed many aren't academics). related_works added for iclc-20 (zenodo.3939527 proceedings), iclc-24 (zenodo.11345213 abstract -- NOT a recording, so a gig DOI can still be minted), acmc-09 (Distributed Performance in Live Coding -- Swift/Gardner/Riddell, no DOI), ap-sessions (OzCHI'14 10.1145/2686612.2686634). REMAINING: AC#6 Ben-as-creator wiring deferred to .08 deposit (his ORCID 0000-0003-2138-5969 saved to memory); Ushini Attanayake ORCID left off (only an empty namesake profile -- addable later, records are mutable); AC#7 type-sharpening + description-as-abstract pending Ben's review of a proposal. Relation types are first-pass, refine at deposit (.08).
<!-- SECTION:NOTES:END -->
