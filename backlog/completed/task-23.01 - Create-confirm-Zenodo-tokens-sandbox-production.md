---
id: TASK-23.01
title: Create/confirm Zenodo tokens (sandbox + production)
status: Done
assignee: []
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 01:05'
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
- [x] #1 A sandbox.zenodo.org token authenticates for dev/dry-run
- [x] #2 A production zenodo.org token exists for the real mint
- [x] #3 Token stays in an untracked mise env block (ZENODO_ACCESS_TOKEN); scripts run via 'mise exec --', never with the token in code
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Tokens verified 2026-06-18 (status-code probes, no values printed): ZENODO_ACCESS_TOKEN = PRODUCTION (zenodo.org 200, sandbox 403); ZENODO_SANDBOX_TOKEN = SANDBOX (sandbox 200, prod 403). Both loaded via mise; run scripts through 'mise exec --'. Use ZENODO_SANDBOX_TOKEN for dev/dry-run and publish rehearsal; ZENODO_ACCESS_TOKEN only for the real production mint. All ACs met.
<!-- SECTION:NOTES:END -->
