---
id: TASK-32
title: Fix 5 overflowing slides in three old talk decks
status: To Do
assignee: []
created_date: '2026-08-26 07:39'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
`pnpm decks:check` reports 5 slide issues, all in decks that predate the current deck conventions and none of them touched by the astromotion 0.23.0 notes port (they carry no notes or comment fences, only single-line `_class` directives):

- classics-to-colonialism slides 13, 14, 15 ("euclid(3, 8) — final", "euclid(5, 12) — final", "euclid(5, 8)") — content runs 255px, 631px and 255px past the bottom of the slide
- ltc-stem-camp slide 13 "now the high-tech version" — `pre.astro-code` hides 269px of its content to the right of the visible box
- p5-hour-of-code slide 10 "dealing with errors" — `pre.astro-code` hides 300px to the right

The euclid ones are too much content for one 1280x720 canvas; the two clipped ones are code blocks wider than the slide. Both need a content call (split the slide, or shrink/wrap the code), which is why they weren't swept up in the port.

These are delivered talks, so the fix is only worth doing if the decks are reused.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 `pnpm decks:check` exits clean for every deck in the repo
<!-- AC:END -->
