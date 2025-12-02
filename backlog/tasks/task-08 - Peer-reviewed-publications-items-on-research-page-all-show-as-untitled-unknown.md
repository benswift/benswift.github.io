---
id: task-08
title: Peer-reviewed publications items on research page all show as untitled/unknown
status: Done
assignee: []
created_date: '2025-12-02 03:55'
updated_date: '2025-12-02 04:03'
labels: []
dependencies: []
---

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Root cause

The `bibtex-parse` library returns BibTeX field names in UPPERCASE (e.g., `TITLE`, `AUTHOR`, `DATE`) but the code in `bibliography.data.ts` was looking for lowercase field names (`title`, `author`, `date`). This caused all publications to fall back to the default values of "Untitled" and "Unknown".

## Fix

Updated `.vitepress/theme/bibliography.data.ts` to check for both uppercase and lowercase field names, preferring uppercase (which is what the library actually returns).
<!-- SECTION:NOTES:END -->
