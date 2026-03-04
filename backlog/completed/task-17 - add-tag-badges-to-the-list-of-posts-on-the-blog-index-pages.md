---
id: task-17
title: add tag badges to the list of posts on the blog index pages
status: Done
assignee: []
created_date: '2025-12-16 22:50'
updated_date: '2025-12-16 22:52'
labels: []
dependencies: []
---

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added `<TagList>` component to post list items in both `/blog/index.md` and `/blog/tag/[tag].md`. The component reuses the existing globally-registered TagList component, which displays tags as styled badges with hover effects. Added `.post-item-tags` CSS class to custom.css to control spacing within the post list layout.
<!-- SECTION:NOTES:END -->
