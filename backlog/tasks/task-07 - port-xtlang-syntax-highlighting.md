---
id: task-07
title: port xtlang syntax highlighting
status: To Do
assignee: []
created_date: "2025-12-01 23:59"
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
