---
id: task-03
title: Fix remaining dead links (missing talks and livecoding pages)
status: Done
assignee: []
created_date: '2025-12-01 00:28'
updated_date: '2025-12-02 00:09'
labels:
  - vitepress
  - content
  - dead-links
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The VitePress build reports 5 dead links that reference content which doesn't exist yet. These need to be either created or the links removed.

**Missing talks:**
- `/talks/p5-hour-of-code` (linked from `blog/2017/09/06/telopea-hour-of-code.md`)
- `/talks/designing-the-ccc-studio` (linked from `blog/2020/03/11/reimagine-fellowship-uk-trip-report.md`)

**Missing livecoding entries:**
- `/livecoding/2020-01-30-smoke` (linked from `blog/2020/01/28/upcoming-gig-smoke-jan-30.md`)
- `/livecoding/2020-02-07-iclc-20` (linked from `blog/2020/03/11/reimagine-fellowship-uk-trip-report.md`)
- `/livecoding/2022-12-01-ozchi-22` (linked from `blog/2022/12/06/ai-art-installations-and-livecoding-gigs-in-nov-dec.md`)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Build passes with ignoreDeadLinks: false
- [x] #2 All 5 links either point to existing content or are removed
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
All 5 linked files now exist after the Jekyll-to-VitePress migration. Build passes with strict dead link checking (only /assets/ paths ignored for non-HTML files).
<!-- SECTION:NOTES:END -->
