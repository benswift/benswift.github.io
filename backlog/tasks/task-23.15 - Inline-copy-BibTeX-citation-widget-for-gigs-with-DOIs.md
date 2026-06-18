---
id: TASK-23.15
title: Inline 'copy BibTeX citation' widget for gigs with DOIs
status: Done
assignee: []
created_date: '2026-06-18 03:56'
updated_date: '2026-06-18 08:29'
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
- [x] #1 A copy-to-clipboard 'cite' control renders on gig pages that have a DOI
- [x] #2 Clicking copies a valid BibTeX entry (DOI, authors incl. ORCIDs where available, year, venue/event) to the clipboard
- [x] #3 BibTeX generated from gig frontmatter; entry type suits a performance/NTRO (e.g. @misc with howpublished/note, or @inproceedings for the juried conference sets)
- [x] #4 Accessible: real button semantics, keyboard-operable, visible 'copied' feedback, no layout shift
- [x] #5 Degrades gracefully for gigs without a DOI yet
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
DONE: inline "Cite this performance" BibTeX widget on gig pages. New
src/components/CiteWidget.astro — a generic <details> disclosure + Copy button;
the Astro <script> is bundled to an external module so it stays within the
site's no-unsafe-inline CSP (the post-build hash injector covers it). BibTeX is
built by gigToBibtex() in src/utils/citation.ts (5 unit tests): @misc entry,
Zenodo-style cite key swift*<year>*<recid>, authors as "Family, Given" (Ben
first + collaborators), title double-braced and special-char-escaped,
howpublished = performance context (event + venue), publisher Zenodo, doi + url,
and ORCIDs (incl. Ben's, plus collaborators' where known) in a note since BibTeX
has no ORCID field.

Wired into GigLayout, rendered only when doi + date are present, so it degrades
gracefully for not-yet-minted gigs (AC #5). Mirrors the existing CitePost.astro
pattern for consistency.

VERIFIED: build + typecheck + 110 tests all green; browser-tested (preview +
agent-browser) the expand + Copy interaction — the button shows "Copied", which
proves the script runs under CSP and the clipboard write succeeds. Native
<details>/<summary>/<button> give keyboard operability; the disclosure expands
without shifting surrounding content.

FUTURE (the task's "extends to publications + blog" note): the generic
CiteWidget could also back CitePost and PerformancesList; left as-is for now to
avoid touching the working blog cite path.
<!-- SECTION:NOTES:END -->
