---
id: TASK-23.16
title: Add Ushini Attanayake's ORCID to her co-performed gigs once it arrives
status: To Do
assignee: []
created_date: '2026-06-18 07:47'
updated_date: '2026-06-18 08:14'
labels:
  - 'needs:ben'
dependencies: []
parent_task_id: TASK-23
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ushini's ORCID is coming soon (noted 2026-06-18). Not a blocker: the deposit credits her by name when no ORCID is present, and Zenodo records are editable in place without re-issuing the DOI. She is a credited co-performer on 3 gigs: 2021-08-26-acmc-21, 2022-08-31-acmc-22, 2022-12-01-ozchi-22 (in colour-coded she is only a body mention). Drop the ORCID into each artists[] entry; re-deposit if already minted.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ORCID added to artists[].orcid in acmc-21, acmc-22 and ozchi-22 frontmatter
- [ ] #2 If those gigs are already minted, their Zenodo creator metadata is updated in place (same DOI)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
UPDATE 2026-06-18: the per-gig --update mode is now BUILT + sandbox-verified. When Ushini's ORCID arrives this is push-button:
1. add 'orcid: "<her ORCID>"' to her artists[] entry in 2021-08-26-acmc-21.md, 2022-08-31-acmc-22.md, 2022-12-01-ozchi-22.md
2. if those gigs are already minted to production, push it to the published Zenodo records in place (same DOI): mise exec -- pnpm zenodo:deposit --write --prod --update --only acmc-21 (repeat for acmc-22, ozchi-22). If not yet minted, a normal deposit run picks it up automatically.
Verified on sandbox: an added ORCID propagated to the published record with the DOI unchanged.
<!-- SECTION:NOTES:END -->
