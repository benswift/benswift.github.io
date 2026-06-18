---
id: TASK-23.16
title: Add Ushini Attanayake's ORCID to her co-performed gigs once it arrives
status: To Do
assignee: []
created_date: '2026-06-18 07:47'
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
