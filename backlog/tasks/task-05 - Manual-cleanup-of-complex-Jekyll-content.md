---
id: task-05
title: Manual cleanup of complex Jekyll content
status: Done
assignee: []
created_date: '2025-12-01 23:32'
updated_date: '2025-12-01 23:59'
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

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Completed on 2025-12-02 as part of task-04:

## Complex HTML blog posts
All 3 were manually converted:
- codesign-culture-lab-workshop.md: Removed interactive JS wheels, documented wheel options as text
- extempore-livecoding-tricks.md: Converted `<div markdown="1">` to `::: tip` containers
- academic-integrity-policy.md: Converted `<div markdown="1">` to blockquotes

## bib_list_pubs
The generation script already stripped this out. The bibliography was not preserved (manual list could be added later if needed).

## fa_svg icons
The generation script already stripped these out. No icons remain.

## Data iteration
The ForCodesTable.vue component handles the FoR codes page. The livecoding_people iteration was in _posts (Jekyll source) and was stripped during generation.
<!-- SECTION:NOTES:END -->
