---
id: TASK-23.06
title: Extend the livecoding collection schema (content.config.ts)
status: To Do
assignee: []
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 01:20'
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
- [ ] #1 Optional fields added: doi, for_codes (ANZSRC), related_works (type + identifier/url + relation), archived_event_url, archived_venue_url, license
- [ ] #2 artists objects gain an optional orcid; Ben's own ORCID recorded where relevant
- [ ] #3 pnpm typecheck passes and all 27 existing gigs still validate
- [ ] #4 videos[] array (each {url, label?}) added, superseding singular video_url, to support multi-video gigs (revenant x2, ap-sessions x4)
<!-- AC:END -->
