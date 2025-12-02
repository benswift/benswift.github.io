---
id: task-13
title: footnotes not working
status: Done
assignee: []
created_date: "2025-12-02 20:59"
updated_date: "2025-12-02 21:05"
labels: []
dependencies: []
---

The md files use footnotes (see e.g. the `[^branding]` one in the
`blog/2025/11/12/seeing-ai-tasks-through-a-tam-lens.md` post).

However, they don't get rendered in the output. Do we need to enable a plugin or
something?

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->

Fixed by adding the `markdown-it-footnote` plugin to VitePress.

Changes made:

1. Installed `markdown-it-footnote` and `@types/markdown-it-footnote` packages
2. Added the plugin to `.vitepress/config.ts` in the markdown config section

The footnotes now render correctly with:

- Superscript reference numbers linking to footnotes
- Footnotes section at the bottom of posts
- Backlinks from footnotes to their references
<!-- SECTION:NOTES:END -->
