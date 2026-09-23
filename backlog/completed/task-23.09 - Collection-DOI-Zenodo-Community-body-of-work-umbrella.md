---
id: TASK-23.09
title: Collection DOI + Zenodo Community (body-of-work umbrella)
status: Done
assignee: []
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 04:58'
labels:
  - script
  - infra
  - zenodo
dependencies: []
parent_task_id: TASK-23
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the open umbrella for the body of work and wire the part/whole links. The formal research statement becomes the Collection description. Depends on the per-gig deposit script and the research statement.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Zenodo Community created for the body of work
- [x] #2 Collection-level record/DOI minted (sandbox) with the research statement as its description
- [x] #3 Per-gig records linked HasPart; gigs link back IsPartOf
- [x] #4 Adding a future gig is a documented append (no re-issue of the collection DOI)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
BUILT + sandbox-verified end-to-end. New: scripts/zenodo-collection.ts (npm
zenodo:collection); scripts/lib/zenodo-collection-state.ts (per-target umbrella
state in gitignored scripts/.zenodo-state-collection-<target>.json);
scripts/lib/zenodo-community.ts (owner-accepts community-inclusion requests).
The .08 deposit script was extended (all guarded — only fire when the collection
state exists): every gig now carries isPartOf the reserved umbrella DOI, sets
communities[slug], and auto-accepts its inclusion request on publish.

PRODUCTION FLOW (after .02 rights pass + .03 statement):

1. mise exec -- pnpm zenodo:collection --write --create-community (ensure
   community, reserve umbrella DOI)
2. mise exec -- pnpm zenodo:deposit --write --prod --publish (gigs carry
   isPartOf + join community)
3. mise exec -- pnpm zenodo:collection --write --prod --publish (umbrella
   hasPart all gig DOIs, publishes, writes src/data/livecoding-collection.ts for
   the .11 UI) APPEND a future gig: deposit it (step 2) then re-run step 3 —
   edits the umbrella IN PLACE, SAME DOI (concept + version).

DECISIONS (do NOT re-derive): umbrella upload_type "other" — Zenodo has NO
"collection" upload_type (maps to DataCite Other; resourceType=Collection is not
achievable on Zenodo, so the umbrella is an "other" record + a Community, linked
by hasPart). Community slug "ben-swift-livecoding", record_policy open; the
deposit-scoped token CAN create communities and accept requests (verified on
sandbox). On InvenioRDM-backed Zenodo the legacy `communities` metadata field
opens a community-inclusion REQUEST on publish rather than adding directly — the
owner must accept it (zenodo-community.ts does this). Editing a published
record's metadata keeps the same version + concept DOI; only `newversion` mints
a new one (this is what makes the append safe). README uploaded only on the
FIRST publish (Zenodo locks the file bucket after publish). Description =
research statement from src/data/livecoding-research-statement.md (.03); until
that exists it is a clearly-marked PLACEHOLDER and `--prod --publish` REFUSES to
ship the placeholder.

SANDBOX VERIFICATION (2026-06-18): community ben-swift-livecoding created;
umbrella deposition 514980 (concept 514979) published with 5 hasPart links; 5
gigs deposited, each isPartOf 514980; append re-publish kept the umbrella DOI
514980 UNCHANGED while hasPart grew 4->5; gigs deposited after community setup
auto-joined the community. All sandbox artefacts discarded afterwards (gig
frontmatter DOI writes reverted; gitignored sandbox state files deleted).
Sandbox quirk noted: published DOIs use the 10.5072 prefix vs reserved 10.5281 —
on production these coincide, so isPartOf/hasPart match exactly.

PENDING (gated, same blockers as .08): .02 rights pass + .03 finalised statement
before the production run. The committed src/data/livecoding-collection.ts is
written only by the prod publish (sandbox never touches it).
<!-- SECTION:NOTES:END -->
