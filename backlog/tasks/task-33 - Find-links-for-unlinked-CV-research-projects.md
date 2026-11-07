---
id: TASK-33
title: Find links for unlinked CV research projects
status: Done
assignee: []
created_date: '2026-11-07T05:27:00Z'
updated_date: '2026-11-07T08:02:00Z'
labels:
  - content
dependencies: []
references:
  - src/pages/cv.mdx
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Three projects under Current research projects in src/pages/cv.mdx are bold but unlinked, while their siblings link out: VLM Perception Experiments, LLM Brainscan and Perceptron Apparatus. Find a canonical URL for each (a project site, public repo, or a post on this site such as the perceptron apparatus posts under src/content/blog/) and link the name as the others are. If a project has nowhere public to point, leave it unlinked and record that in the task notes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 VLM Perception Experiments links to a public page, or a note records why it can't
- [x] #2 LLM Brainscan links to a public page, or a note records why it can't
- [x] #3 Perceptron Apparatus links to a public page, or a note records why it can't
- [x] #4 /cv/ builds and the new links resolve
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
VLM Perception Experiments links to github.com/ANUcybernetics/vlm-perception-experiments (public); LLM Brainscan and Perceptron Apparatus link to their School of Cybernetics project pages (cybernetics.anu.edu.au/projects/...). All three return 200; build passes.
<!-- SECTION:NOTES:END -->
