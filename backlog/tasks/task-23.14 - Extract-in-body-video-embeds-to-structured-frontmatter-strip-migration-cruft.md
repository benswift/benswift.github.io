---
id: TASK-23.14
title: Extract in-body video embeds to structured frontmatter; strip migration cruft
status: To Do
assignee: []
created_date: '2026-06-18 01:20'
labels:
  - data
  - content
dependencies: []
parent_task_id: TASK-23
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Jekyll->VitePress->Astro migrations left raw <iframe> embeds in gig bodies plus 1:1 orphaned 'Script removed during migration' comments. VERIFIED 2026-06-18: nothing was lost (iframe count == comment count in every file), so every video URL is present in-body and git-history recovery is NOT needed. Work = destructure these into the new videos[] field and delete the cruft. Runs after the schema task (.06, which adds videos[]) and before the deposit script.

In-body Vimeo embeds in 14 gigs: beginning-middle-end, mume-isea-2013, revenant-media-theremin-75 (x2), art-not-apart-2014, john-hosking, ap-sessions (x4), innovation-act-2015, collected-resonances, soundscapes-21, cecs-welcome-party, colour-coded, acmc-21, ozchi-22, smcclab-live-1. Also consolidate any singular video_url frontmatter (e.g. iclc-20 YouTube, iclc-24).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All in-body Vimeo iframe URLs moved into the videos[] frontmatter field (14 gigs)
- [ ] #2 Multi-video gigs handled: revenant-media-theremin-75 (2), ap-sessions (4)
- [ ] #3 Any existing singular video_url consolidated into videos[]
- [ ] #4 All raw embed divs and 'Script removed during migration' comments removed from bodies
- [ ] #5 typecheck passes and gigs validate; Vimeo URLs preserved verbatim (links confirmed live)
<!-- AC:END -->
