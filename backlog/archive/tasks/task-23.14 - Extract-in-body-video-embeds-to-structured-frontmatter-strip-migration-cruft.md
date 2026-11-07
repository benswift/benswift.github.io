---
id: TASK-23.14
title: Extract in-body video embeds to structured frontmatter; strip migration cruft
status: Done
assignee:
  - '@claude'
created_date: '2026-06-18 01:20'
updated_date: '2026-06-18 02:00'
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
- [x] #1 All in-body Vimeo iframe URLs moved into the videos[] frontmatter field (14 gigs)
- [x] #2 Multi-video gigs handled: revenant-media-theremin-75 (2), ap-sessions (4)
- [x] #3 Any existing singular video_url consolidated into videos[]
- [x] #4 All raw embed divs and 'Script removed during migration' comments removed from bodies
- [x] #5 typecheck passes and gigs validate; Vimeo URLs preserved verbatim (links confirmed live)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Per Ben's call (full strip + prose edits): moved every in-body embed into videos[] across 17 gigs (21 video entries = 15 single + revenant x2 + ap-sessions x4), deleted all embed divs + 'Script removed during migration' comments, and surgically de-deicticised the coupled prose ('the above video', 'this crowd video', 'here's the video', etc.). Restructured ap-sessions (kept the narrative, folded the 4 inline videos into labelled frontmatter, preserved the {#aesthetic-visuals} anchor that innovation-act-2015 links to, fixed the 'techiniques' typo). Tidied orphaned photo-gallery sentences in beginning-middle-end, mume, colour-coded, national-science-week-2018; mume's body was only embed+lost-photos, so replaced with a one-line factual note. URLs normalised to canonical form (vimeo.com/ID, youtube watch); ozchi-22 is an UNLISTED video so its privacy hash is preserved as vimeo.com/779496006/3f9d885e44. All 21 video URLs network-checked HTTP 200 (incl. the ozchi hash URL). NOTE: task mentioned consolidating iclc-24's video_url, but iclc-24 has none (only a Zenodo footnote) - nothing to do. UI REGRESSION (accepted, deferred to .11): GigLayout 'Watch' + PerformancesList 'video' links read the now-absent video_url and render nothing until the UI is switched to videos[]. video_url kept in schema (unused) until then. Green: typecheck/lint/format, 97 unit + 43 integration tests, full build (236 pages).
<!-- SECTION:NOTES:END -->
