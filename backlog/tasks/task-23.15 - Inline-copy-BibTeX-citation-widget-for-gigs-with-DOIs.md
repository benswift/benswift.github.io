---
id: TASK-23.15
title: Inline 'copy BibTeX citation' widget for gigs with DOIs
status: To Do
assignee: []
created_date: '2026-06-18 03:56'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-23
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a small, accessible inline widget on each gig page that copies a well-formed BibTeX citation (including the DataCite DOI) to the clipboard, so a performance can be cited straight from its page. Generate the entry from frontmatter (title, Ben + collaborators as authors with ORCIDs where known, year, venue/event, DOI, event/archived URL). Naturally extends to the publications list and blog posts too. Slot in near the END of the epic: depends on per-gig DOIs (TASK-23.08/.09) and the GigLayout UI work (TASK-23.11).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A copy-to-clipboard 'cite' control renders on gig pages that have a DOI
- [ ] #2 Clicking copies a valid BibTeX entry (DOI, authors incl. ORCIDs where available, year, venue/event) to the clipboard
- [ ] #3 BibTeX generated from gig frontmatter; entry type suits a performance/NTRO (e.g. @misc with howpublished/note, or @inproceedings for the juried conference sets)
- [ ] #4 Accessible: real button semantics, keyboard-operable, visible 'copied' feedback, no layout shift
- [ ] #5 Degrades gracefully for gigs without a DOI yet
<!-- AC:END -->
