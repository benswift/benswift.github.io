---
id: TASK-23.07
title: Wayback backfill script for dead event/venue URLs
status: Done
assignee:
  - '@claude'
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 04:04'
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
- [x] #1 Queries the Wayback availability API for each event_url/venue_url
- [x] #2 Triggers Save Page Now where no snapshot exists
- [x] #3 Writes archived URL + capture date into the archived_* frontmatter fields
- [x] #4 Idempotent with a dry-run mode; run across all gigs
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
New script scripts/archive-event-urls.ts (npm: archive:urls). Modes: dry-run (default), --write (availability API + Save Page Now + writes archived_* fields), --no-spn (availability-only refresh), --force (re-archive). Idempotent (skips already-set). Ran across all 27 gigs: 42/45 event+venue URLs archived (21 event + 21 venue). Capture date is embedded in the Wayback snapshot URL (/web/<timestamp>/). 3 holdouts: thedoughnutdept.com/welcome (closed venue, dead) and acmc2022.com/day-one-evening-concert (404, page gone) are unarchivable; smcclab.github.io event page had its SPN accepted (200) but is pending archive.org indexing — re-run 'pnpm archive:urls --write --no-spn' to capture it. Note: anonymous SPN is rate-limited and captures index a few minutes later, so the --no-spn refresh pass is the way to collect them.
<!-- SECTION:NOTES:END -->
