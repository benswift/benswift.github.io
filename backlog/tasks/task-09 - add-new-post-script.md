---
id: task-09
title: add new post script
status: Done
assignee: []
created_date: '2025-12-02 03:56'
updated_date: '2025-12-02 04:05'
labels: []
dependencies: []
---

I'd like the new post to be put in the correct folder (creating it if necessary)
and also to set published: false by default.

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Created `scripts/new-post.ts` which:
- Creates posts in `blog/YYYY/MM/DD/slug.md` format
- Creates the directory structure if it doesn't exist
- Sets `published: false` by default
- Includes standard frontmatter (title, aside, layout, tags)
- Adds the post date and TagList component

Usage: `npm run new-post "My Post Title"`
<!-- SECTION:NOTES:END -->
