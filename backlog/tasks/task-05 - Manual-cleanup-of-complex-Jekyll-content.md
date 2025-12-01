---
id: task-05
title: Manual cleanup of complex Jekyll content
status: To Do
assignee: []
created_date: '2025-12-01 23:32'
labels:
  - migration
  - manual
dependencies:
  - task-04
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Items that need manual attention after the automated migration.

## Complex HTML blog posts (3 files)
Need to identify which posts were skipped by the generation script and manually clean them up.

## Custom bibliography
- File: `_posts/2021-09-13-feedback-in-livecoding-cui-bono.md`
- Uses: `{% bib_list_pubs masters-pre-reading-21.bib %}`
- Options: Convert to manual reference list, or find a VitePress/markdown bibliography solution

## Data iteration (2 files)
- `_posts/2021-03-18-anzsrc-for-codes-2020-edition.md` - iterates over FoR codes (ForCodesTable.vue exists)
- `_posts/2019-09-21-mapping-the-livecoding-landscape.md` - iterates over `page.livecoding_people` frontmatter

## Font Awesome icons (12 instances)
- Various files use `{% fa_svg fab.fa-youtube %}` etc.
- Options: Replace with emoji, inline SVG, or icon component
<!-- SECTION:DESCRIPTION:END -->
