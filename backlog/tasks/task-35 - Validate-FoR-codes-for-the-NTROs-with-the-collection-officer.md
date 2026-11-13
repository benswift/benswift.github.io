---
id: TASK-35
title: Validate FoR codes for the NTROs with the collection officer
status: To Do
assignee: []
created_date: '2026-11-13T20:55:00Z'
labels:
  - ntro
  - needs:ben
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
All NTROs in `src/content/ntro/` (plus the live-coding body of work, NTRO #1, in `src/content/livecoding/`) carry proposed Field of Research codes (`coding_status: proposed`) that need sign-off before RP+ lodgement. Set the split once across the set: creative arts plus human-centred computing for outputs 1--7, and for the APS AI Tracker, a data-and-policy output, human-centred computing or data science plus public policy. Not self-serve: route it through the School publication-collection officer (admin.cybernetics), the SOCY ERIC portfolio (Chris Danta) and the RP+ team. Background and process: doc-01.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Each NTRO has a validated primary and secondary FoR code
- [ ] #2 Category, sub-category and standard-or-major are confirmed in the same pass
- [ ] #3 src/content/ntro/*.md records are updated (`coding_status: validated`, `checklist.coding_validated: true`) and the live-coding record agrees, with the cybernetics-website ntro: blocks brought into line (`pnpm ntro:check` clean)
<!-- AC:END -->
