---
id: TASK-21
title: Add hero SVG support to blog posts
status: To Do
assignee: []
created_date: "2026-04-16 04:07"
labels:
  - frontend
  - design
dependencies: []
references:
  - svg_gen_output/20260416T034856Z/pledges-not-questions.svg
  - src/layouts/PostLayout.astro
  - src/content.config.ts
  - blog/2026/04/16/comp4020-pledges-not-questions.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->

Add support for displaying hero SVG illustrations at the top of blog posts. A WIP SVG for the "pledges, not questions" post has been generated and committed to svg_gen_output/20260416T034856Z/pledges-not-questions.svg.

## Current state

- The blog post schema (src/content.config.ts) already has an optional `image` field, but it's only used for og:image social metadata in Head.astro --- not rendered visually on the page.
- PostLayout.astro receives the `image` prop but doesn't display it.
- The generated SVG uses the site's palette (#be2edd purple, #3b82f6 blue, #f59e0b amber, #1a1a1a dark bg) and validates clean.

## Remaining work

1. **Review the SVG** --- open svg_gen_output/20260416T034856Z/pledges-not-questions.svg locally and iterate on the illustration if needed.
2. **Move the SVG to its permanent home** --- e.g. src/assets/illustrations/ or alongside the post. Decide on a convention for where hero SVGs live.
3. **Update PostLayout.astro** --- render the image as a hero when the frontmatter `image` field is set. Place it between the h1 title and the post date (or above the title). Should handle both SVG paths and raster image paths gracefully.
4. **Add the image field** to the pledges-not-questions post frontmatter pointing to the SVG.
5. **Consider adding an SVG illustration style section** to CLAUDE.md to guide future SVG generation (palette, prompt suffix, references directory).
6. **Test** --- run the dev server and verify the hero renders correctly, doesn't break mobile layout, and the og:image metadata still works.
7. **Clean up** --- remove the svg_gen_output/ directory once the SVG is in its permanent location. Add svg_gen_output/ to .gitignore if it isn't already.
<!-- SECTION:DESCRIPTION:END -->
