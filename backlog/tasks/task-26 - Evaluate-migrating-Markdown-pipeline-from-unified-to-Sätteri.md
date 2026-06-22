---
id: TASK-26
title: Evaluate migrating Markdown pipeline from unified to Sätteri
status: To Do
assignee: []
created_date: '2026-06-22 23:20'
labels:
  - astro
  - markdown
  - tech-debt
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Astro 7 made Sätteri (Rust) the default Markdown processor. benswift-me and astro-theme-anu both deliberately stay on the legacy remark/rehype pipeline via markdown.processor: unified() from @astrojs/markdown-remark, because we rely on custom plugins. This task is to evaluate (not necessarily perform) a migration to Sätteri for the build-speed win, since Sätteri now natively covers GFM, smartypants, heading IDs, container directives, math and frontmatter.

Plugins/behaviours that would need porting or parity-checking: custom container directives (:::tip/:::info/... -> components: remark-container-directive + remark-containers); accessible autolink-heading anchors (per-heading aria labels via rehype-autolink-headings); remark-smartypants with dashes: oldschool; the theme's remark-callout / remark-default-layout / remark-custom-heading-id; and astromotion's deck plugin chain. Custom Shiki grammars (xtlang, armasm) and the a11y code-block transformer are processor-independent.

Note: astro-theme-anu is the bigger lift (more custom plugins); both repos must move together since the theme owns the markdown config for its consumers.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Document which current plugins Sätteri replaces natively vs which need a custom port
- [ ] #2 Assess effort and risk per repo (benswift-me and astro-theme-anu)
- [ ] #3 Produce a go/no-go recommendation with a visual-diff verification plan if 'go'
<!-- AC:END -->
