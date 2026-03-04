---
id: TASK-18
title: 'switch to https://oxc.rs/ toolchain'
status: Done
assignee: []
created_date: '2026-02-17 01:12'
updated_date: '2026-02-17 01:27'
labels: []
dependencies: []
---

It might not be possible, but for all cases where this project is using a
different tool (e.g. eslint) for which there's a version in the oxc "suite", we
should switch over.

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added oxlint as a dev dependency with `lint` and `lint:fix` npm scripts. Fixed 6 lint warnings in our code (unused function, unused parameter, regex→startsWith, new Array→Array.from). Excluded vendored Winwheel.js via --ignore-pattern. Deleted stale .prettierignore from the Jekyll era. Lint runs clean (0 warnings, 0 errors), all tests pass, build succeeds.
<!-- SECTION:FINAL_SUMMARY:END -->
