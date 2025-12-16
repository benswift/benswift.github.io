---
id: task-14
title: vue layout components audit
status: Done
assignee: []
created_date: '2025-12-02 22:16'
updated_date: '2025-12-02 22:30'
labels: []
dependencies: []
---

There are a few main "layout" vue components (e.g. PostLayout, GigLayout).
Obviously there's a lot of shared functionality between them.

Is this setup optimal? Or is there a way to refactor the shared bits? Although I
don't want to overcomplicate things.

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Audit findings

Three layout components exist:
- **PostLayout** - blog posts with title, date, TagList
- **GigLayout** - gig pages with title, date, metadata grid
- **RevealLayout** - reveal.js presentations (completely different architecture)

## Shared code between PostLayout and GigLayout
- DefaultTheme Layout wrapper
- Title h1 rendering and styles
- Date formatting (slight variation in year format)
- SiteFooter in doc-footer-before slot

## Recommendation: keep as-is

The duplication is minimal (~20 lines) and intentional. Extracting shared code would:
- Add indirection for minimal benefit
- Only apply to 2 of 3 components (RevealLayout is completely different)
- Make each component harder to understand in isolation

The current setup is readable, maintainable, and follows YAGNI principles.
<!-- SECTION:NOTES:END -->
