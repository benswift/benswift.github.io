---
id: TASK-29
title: Delete 14 duplicate 'Curated Livecoding Performance' entries from ORCID
status: Done
assignee: []
created_date: '2026-07-23 00:05'
updated_date: '2026-07-23 00:23'
labels:
  - orcid
  - admin
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ben's ORCID record (0000-0003-2138-5969) has 14 manually-added works all titled "Curated Livecoding Performance" (source: Ben Swift, no external identifiers, years 2008-2018). They predate the Zenodo/DataCite gig deposits (TASK-23.x) and are now redundant third copies of gigs properly represented by DOI-bearing DataCite records (2008 Transmissions in Sound; 2009 x2; 2013 x2; 2014 x3; 2015; 2017; 2018 x4). ORCID has no manual merge and these carry no identifiers, so the fix is deletion via the orcid.org UI while logged in as Ben.

Needs a GUI machine (login + 2FA) with agent-browser driving orcid.org. Verify each entry against the year list before deleting: only remove works titled exactly "Curated Livecoding Performance" with no DOI.

Related but out of scope: the 9 Pure-vs-DOI gig duplicates (fix is adding Zenodo DOIs in Pure, not ORCID edits) and 5 old manual paper entries that duplicate Pure records (Impish Grooves, Distributed Performance in Live Coding, Music of 18 Performances, Greek Mythology 2020, PhD thesis).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The 14 no-identifier works titled 'Curated Livecoding Performance' are no longer on the public ORCID record
- [x] #2 All DOI-bearing gig records (DataCite/manual Zenodo entries) remain untouched, confirmed via https://pub.orcid.org/v3.0/0000-0003-2138-5969/works
<!-- AC:END -->
