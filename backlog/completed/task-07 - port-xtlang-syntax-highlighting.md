---
id: task-07
title: port xtlang syntax highlighting
status: Done
assignee: []
created_date: "2025-12-01 23:59"
updated_date: "2025-12-02 00:19"
labels: []
dependencies: []
---

There are several different xtlang highlighting packages online (e.g.
https://github.com/benswift/extempore-sublime).

Vitepress uses shiki, and we should add xtlang support (so that we won't get all
these warnings at build time):

    The language 'xtlang' is not loaded, falling back to 'txt' for syntax highlighting. (x39)

Note: extempore and xtlang are the same thing - we should change them all to
xtlang for consistency.

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->

Ported xtlang syntax highlighting from the extempore-sublime TextMate grammar to
a Shiki-compatible JSON grammar at `.vitepress/xtlang.tmLanguage.json`.
Configured VitePress to load the custom language with `extempore` as an alias,
so both `xtlang` and `extempore` code blocks now have proper syntax
highlighting. Build now completes without the 39 xtlang fallback warnings.

<!-- SECTION:NOTES:END -->
