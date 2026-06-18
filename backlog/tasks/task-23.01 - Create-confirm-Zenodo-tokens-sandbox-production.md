---
id: TASK-23.01
title: Create/confirm Zenodo tokens (sandbox + production)
status: To Do
assignee: []
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 00:58'
labels:
  - 'needs:ben'
  - infra
  - zenodo
dependencies: []
parent_task_id: TASK-23
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Prerequisite for minting. A token is now set in mise as ZENODO_ACCESS_TOKEN (run scripts via 'mise exec -- ...' so it is picked up). Confirm whether it targets sandbox or production: sandbox.zenodo.org and zenodo.org are separate sites with separate tokens, and dev/dry-runs must use a sandbox token.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A sandbox.zenodo.org token authenticates for dev/dry-run
- [x] #2 A production zenodo.org token exists for the real mint
- [x] #3 Token stays in an untracked mise env block (ZENODO_ACCESS_TOKEN); scripts run via 'mise exec --', never with the token in code
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Probed 2026-06-18: ZENODO_ACCESS_TOKEN authenticates on zenodo.org (HTTP 200) but is rejected by sandbox.zenodo.org (403), so it is a PRODUCTION token (in mise, used via 'mise exec --'). OUTSTANDING: no sandbox token. Decide before the build: (a) create a sandbox token for safe iteration, or (b) develop against production using draft-only depositions with a hard publish-guard -- unpublished drafts register no DOI and can be DELETEd, so never call the publish action until ready.
<!-- SECTION:NOTES:END -->
