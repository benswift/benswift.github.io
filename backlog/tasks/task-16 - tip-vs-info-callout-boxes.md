---
id: task-16
title: tip vs info callout boxes
status: Done
assignee: []
created_date: '2025-12-05 00:16'
updated_date: '2025-12-05 00:29'
labels: []
dependencies: []
---

This site uses `::: tip` and `::: info` callout boxes kindof interchangeably...
can you do an audit of all uses and suggest a way to be more conistent about
what counts as a tip vs an info box? Note that the actual "title" can be
overridden by adding more text after the box type, e.g.
`::: tip Watch out for...`.

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Changes made

### tip → info (contextual/attribution content)
- bio.md: navigational context note
- blog/robots-job.md: source attribution
- blog/ai-in-higher-education.md: source attribution
- blog/the-other-side.md: post-presentation update

### info → tip (actionable guidance)
- blog/xinyus-tutorials.md: two instructional callouts

### Guidelines added to CLAUDE.md
- `::: tip` for actionable guidance (technical advice, how-to, recommendations)
- `::: info` for contextual information (attributions, status updates, corrections, disclaimers)
<!-- SECTION:NOTES:END -->
