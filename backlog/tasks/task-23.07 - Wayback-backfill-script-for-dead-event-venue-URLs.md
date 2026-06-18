---
id: TASK-23.07
title: Wayback backfill script for dead event/venue URLs
status: To Do
assignee: []
created_date: '2026-06-18 00:56'
labels:
  - script
  - infra
dependencies: []
parent_task_id: TASK-23
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Script over all 27 gigs that finds or creates web-archive snapshots of event_url and venue_url and records them in frontmatter. Many older conference pages already have snapshots; capture fresh ones where missing. Depends on the schema task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Queries the Wayback availability API for each event_url/venue_url
- [ ] #2 Triggers Save Page Now where no snapshot exists
- [ ] #3 Writes archived URL + capture date into the archived_* frontmatter fields
- [ ] #4 Idempotent with a dry-run mode; run across all gigs
<!-- AC:END -->
