---
id: TASK-27
title: Resolve vestigial stylelint setup
status: Done
assignee: []
created_date: '2026-06-26 23:56'
updated_date: '2026-06-27 00:08'
labels:
  - tooling
  - ci
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
stylelint + stylelint-config-standard are installed with a minimal stylelint.config.mjs, but there's no lint:css script, it isn't in CI, and it's never actually run. Run now, it reports 7 problems across the repo's only 2 plain-CSS files (notation/formatting rules), and the bulk of styling lives in .astro/.svelte scoped <style> blocks that plain stylelint can't see without customSyntax. So it's dead weight: not green, not enforced, covering almost nothing. Decide one way or the other. Context: the sibling aps-ai-tracker repo now has a project-tuned stylelint config (extends standard, disables the rules that fight BEM names, unitless oklch hues, needed -webkit- prefixes, and the oxfmt-owned formatting/keyword-case rules) that is green and wired into a lint:css script + CI step — it's the better template than this repo's current config.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A decision between dropping stylelint and wiring it up properly is made and reflected in the repo (no vestigial middle state)
- [x] #2 If kept: a lint:css script exists, passes green, and runs in CI; the config is tuned so it doesn't fight oxfmt or the design system (adopt the tracker's config as the template)
- [x] #3 If kept: scoped .astro/.svelte styles are either covered via customSyntax or that limitation is explicitly documented
- [ ] #4 If dropped: stylelint, stylelint-config-standard and stylelint.config.mjs are removed, and CLAUDE.md no longer lists stylelint in the toolchain
<!-- AC:END -->
