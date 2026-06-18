---
id: TASK-23.10
title: atproto per-gig records via site.standard.* + companion NTRO record
status: Done
assignee: []
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 05:08'
labels:
  - script
  - atproto
dependencies: []
parent_task_id: TASK-23
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Extend the atproto publish pipeline to cover the livecoding collection and carry the DOI. Check the standard.site lexicon catalogue first to decide whether to extend the document lexicon or use a companion record. Depends on the schema and deposit tasks.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 standard.site lexicon catalogue checked; extend-vs-companion decision recorded
- [x] #2 A site.standard.document record emitted per gig (AT-URI + CID)
- [x] #3 A companion NTRO record (own namespace) holds the DOI + a strongRef {uri,cid} to the document
- [x] #4 AT-URI exposed for use as a DataCite relatedIdentifier
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
BUILT + dry-run + unit-tested (8 tests). No LIVE write this session: ATP creds
are absent from the env and writing to the real repo is outward-facing, and
atproto has no sandbox — so the bar here is build + dry-run + unit tests, with
the live emission gated on creds (analogous to the Zenodo prod run). New:
scripts/atproto-livecoding.ts (npm atproto:livecoding);
scripts/lib/atproto-livecoding.ts (pure builders + publishGig orchestrator);
scripts/lib/atproto-livecoding.test.ts. State in gitignored
scripts/.atproto-livecoding-state.json. The blog pipeline (atproto-publish.ts,
lib/atproto.ts) is UNTOUCHED — gig publishing uses the raw AtpAgent + its own
builders so the verified blog flow + its tests don't move.

AC #1 DECISION — COMPANION, not extend: checked the standard.site catalogue —
site.standard.document is third-party longform-publishing metadata (title / path
/ contents / publication link) with NO field for DOIs or research-output
metadata, and it isn't ours to fork. So each gig gets a standard
site.standard.document (the page) PLUS a companion me.benswift.ntro record (our
own namespace; authority = benswift.me reversed) holding the DOI + a strongRef
{uri,cid} to the document (reusing the existing bskyPostRef strongRef pattern).

AC #2/#3: publishGig() puts the document first (captures {uri,cid} from
putRecord), then the NTRO that strongRefs it. Idempotent on contentHash + doi;
createdAt preserved across runs so records don't churn. DOI read from gig
frontmatter (none yet -> the NTRO omits doi and warns; re-run after minting).
partOf carries the collection concept DOI from src/data/livecoding-collection.ts
when that prod file exists (.09 tie-in).

AC #4: the document AT-URI is deterministic
(at://<did>/site.standard.document/<slug>) and is surfaced in the run output +
state as the DataCite relatedIdentifier. VERIFIED on the Zenodo sandbox that a
raw at:// value is ACCEPTED (200) as a related_identifier — no resolver or URN
wrapping needed.

DECISIONS (do NOT re-derive): NSID me.benswift.ntro; rkey = gig filename stem
(e.g. 2024-05-31-iclc-24) for both collections; document path
/livecoding/<slug>; textContent via lib/posts toPlainText. Publishing the formal
me.benswift.ntro lexicon document (DNS \_lexicon.benswift.me) is optional future
polish — not needed to write self-owned records.

PENDING: live emission needs ATP_IDENTIFIER / ATP_APP_PASSWORD in the mise env —
run: mise exec -- pnpm atproto:livecoding --write. Best run AFTER the production
DOIs exist (.02 rights pass) so the NTRO records carry real DOIs. Then add each
document AT-URI to its gig's Zenodo related_identifiers (raw at://, already
verified-accepted).
<!-- SECTION:NOTES:END -->
