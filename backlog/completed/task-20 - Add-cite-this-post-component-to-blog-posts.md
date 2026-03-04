---
id: TASK-20
title: Add "cite this post" component to blog posts
status: Done
assignee: []
created_date: '2026-02-19 00:38'
updated_date: '2026-03-04 01:55'
labels:
  - vitepress
  - scholarly
  - citations
dependencies:
  - TASK-19
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a citation component to `PostLayout.vue` that lets readers easily cite blog posts in academic contexts.

## Features

- "Cite this post" expandable section on each blog post
- Generate BibTeX (`@online` or `@misc`) from post metadata (title, author, date, canonical URL, AT-URI)
- Include AT-URI as a supplementary persistent identifier
- Expose Zotero/Google Scholar-compatible `<meta>` tags in `<head>` (`citation_title`, `citation_author`, `citation_date`, `citation_public_url`)
- Copy-to-clipboard for the BibTeX entry

## Dependencies

Requires TASK-19 (atproto integration) to be complete so AT-URIs are available for each post.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fully implemented. `CitePost.astro` component renders a collapsible "Cite this post" section with BibTeX generation (via `src/utils/citation.ts`) and copy-to-clipboard. Scholarly meta tags (`citation_title`, `citation_author`, `citation_date`, `citation_public_url`) injected in `Head.astro`. AT-URIs included in the BibTeX `note` field when available. All 7 citation tests pass.
<!-- SECTION:FINAL_SUMMARY:END -->
