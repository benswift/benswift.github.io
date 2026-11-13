---
id: TASK-36
title: Lodge the NTROs in RP+
status: To Do
assignee: []
created_date: '2026-11-13T20:55:00Z'
updated_date: '2026-11-13T20:55:00Z'
labels:
  - ntro
  - needs:ben
dependencies:
  - TASK-35
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
NTROs only count institutionally once lodged as RP+ records, from where they flow into Open Research after validation (the ANU repository team, via Izabela Hoang, 29 June 2026). Lodgement is self-serve: enter each NTRO from `src/content/ntro/*.md` (and the live-coding portfolio) with its concept DOI and the Appendix C research statement already in the file body. Queries go to repository.admin@anu.edu.au; systems.ris@anu.edu.au helps with research statements, and the University of Melbourne's public NTRO-submission guide is a usable model. Do it after the FoR codes are validated. Lodgement categories and the collection officer's rules are in doc-01.

This task is the single home for the RP+ conversation; it absorbs the former TASK-23.12 (ANU library / ResearchPortalPlus enquiry, archived). That enquiry's email to Izabela Hoang (18 Jun 2026, subject "a DOI / NTRO question (no rush)") asked: does Pure/RP+ have the DataCite minting connector or only store DOIs; what is the current ANU promotion guidance on NTRO research statements; and, as a someday aside, will ANU/ARDC mint DataCite DOIs resolving to an external domain (benswift.me). Record her answers (and the 29 June lodgement advice) in the implementation notes here.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All NTROs are RP+ records (`rp_plus.status` and `checklist.rp_plus_record` updated in each src/content/ntro file)
- [ ] #2 repository.admin has said whether the existing Zenodo/DataCite DOIs are accepted or a parallel Open Research deposit is wanted
- [ ] #3 Answers to the three TASK-23.12 questions (DataCite connector, NTRO statement guidance, external-domain DOIs) recorded in the notes
<!-- AC:END -->
