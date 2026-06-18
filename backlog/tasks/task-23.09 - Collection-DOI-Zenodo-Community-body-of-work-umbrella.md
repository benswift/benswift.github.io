---
id: TASK-23.09
title: Collection DOI + Zenodo Community (body-of-work umbrella)
status: To Do
assignee: []
created_date: '2026-06-18 00:56'
labels:
  - script
  - infra
  - zenodo
dependencies: []
parent_task_id: TASK-23
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the open umbrella for the body of work and wire the part/whole links. The formal research statement becomes the Collection description. Depends on the per-gig deposit script and the research statement.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Zenodo Community created for the body of work
- [ ] #2 Collection-level record/DOI minted (sandbox) with the research statement as its description
- [ ] #3 Per-gig records linked HasPart; gigs link back IsPartOf
- [ ] #4 Adding a future gig is a documented append (no re-issue of the collection DOI)
<!-- AC:END -->
