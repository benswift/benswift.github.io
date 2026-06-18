---
id: TASK-23
title: Livecoding body of work as citable NTROs (DataCite DOIs + atproto)
status: To Do
assignee: []
created_date: '2026-06-18 00:54'
updated_date: '2026-06-18 08:21'
labels:
  - epic
  - livecoding-ntro
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Goal: give Ben's ~two-decade live-coding body of work citable DataCite DOIs so the performances count as non-traditional research outputs (NTROs) for an ANU promotion, with atproto as a complementary ownership layer and benswift.me/livecoding as the human-facing hub.

Scope: the 27 gigs in src/content/livecoding/. OUT OF SCOPE: the Extempore software DOI (parked; needs Andrew, separate track).

Decided architecture (do NOT re-derive):
- Mint via the Zenodo REST API. Sandbox (sandbox.zenodo.org) first. The API pre-reserves the DOI, so write it into frontmatter before publishing. Token in an untracked mise env block, never in code.
- Body-of-work framing: a collection-level DOI (resourceType Collection) + per-gig DOIs linked IsPartOf/HasPart. A Zenodo Community is the open umbrella, so adding future gigs is an append.
- No Performance resourceType: gig = Event, recording = Audiovisual. Link video/repo/AT-URI via relatedIdentifier (AT-URIs carried as URL/URN).
- Videos uploaded to Zenodo as the archival copy (<=50 GB/record); streaming copy (Vimeo/YouTube) linked via IsVariantFormOf.
- Dead event/venue URLs: Wayback Machine (availability API + Save Page Now); store archived URL + capture date.
- atproto: per-gig site.standard.document record + a companion NTRO record (own namespace) holding the DOI and a strongRef to the document.
- 7 anchor gigs get detailed treatment: ICLC'24, ICLC'20, ISEA'13/MuMe, ACMC'09/'14/'21/'22. Program framed as 'almost two decades (2008-2026), continuing'; Ben = performer-researcher-engineer.
- Research statement: formal 3-part version is the promotion artifact (may double as the Collection DOI description); a separate WARM intro adaptation goes on /livecoding (keep the existing voice + wink).

Execution order:
A. Human-gated prerequisites (Ben, out-of-band): Zenodo tokens; rights pass on media; ANU library enquiry.
B. Writing: finalise research statement, then warm public intro + 6 anchor significance notes.
C. Build: extend schema -> Wayback backfill -> Zenodo per-gig deposit (sandbox) -> collection DOI + Community -> atproto records -> /livecoding + GigLayout UI.

A single focused session can do all of B and C against the sandbox once a sandbox token exists; production minting waits on the rights pass.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
BUILD ORDER + PROGRESS. DONE: .06 schema; .14 videos->videos[] (incl. ICLC24 YouTube recording, sourced from the program page); .13 metadata enrich (dates, instrument, abstracts, ORCIDs, related_works, type taxonomy collapsed to juried/invited/other); .07 Wayback (42/45 event+venue URLs archived; scripts/archive-event-urls.ts, npm archive:urls). .08 deposit script BUILT + sandbox-verified end-to-end on ICLC24 (scripts/zenodo-deposit.ts, npm zenodo:deposit, run via 'mise exec --'; legacy Zenodo Deposit API; idempotent; gitignored state file). All 27 gigs now carry deposit-ready frontmatter.

DECISIONS (do NOT re-derive): legacy Deposit API not InvenioRDM; upload_type video (recorded) / other (unrecorded); performers are co-creators; Ben creator constant ORCID 0000-0003-2138-5969 + ANU affiliation; related_identifiers = video IsVariantFormOf, event_url references, archived_* isDocumentedBy, related_works; default licence CC-BY-4.0 (rights pass overrides per gig). Tokens: ZENODO_SANDBOX_TOKEN / ZENODO_ACCESS_TOKEN via mise.

PENDING: Ben to sign off the .08 metadata mapping (see .08 notes); then .02 RIGHTS PASS is the ONLY blocker to production minting -> run: mise exec -- pnpm zenodo:deposit --write --prod --publish.

NEXT BUILD (no rights dependency): .09 collection DOI + Zenodo Community; .10 atproto records; .11 /livecoding hub + GigLayout to surface doi/archived_*/related_works/videos[] -- NOTE GigLayout + PerformancesList still read the deprecated singular video_url (now absent), so switch them to videos[] and drop video_url from the schema as part of .11. WRITING track (independent): .03 research statement, .04 warm intro, .05 six anchor notes. Capstone: .15 BibTeX cite widget (after DOIs exist). VERIFIED earlier: migration kept all in-body video data.

UPDATE 2026-06-18 (session 2): .09, .10, .11 all DONE + committed — the BUILD track is now complete. .09 collection DOI + Zenodo Community (sandbox-verified end-to-end incl. append-without-reissue; scripts/zenodo-collection.ts, npm zenodo:collection; .08 extended so each gig links isPartOf + joins the community + auto-accepts inclusion). .10 per-gig atproto site.standard.document + companion me.benswift.ntro records holding DOI + strongRef (scripts/atproto-livecoding.ts, npm atproto:livecoding; built, dry-run + unit-tested — live write needs ATP creds in mise, no atproto sandbox exists). .11 UI: gig pages surface doi/archived_*/related_works/videos[]; hub gains body-of-work framing + collection cite; video_url DROPPED from schema. Build/typecheck/lint/format/105 tests all green. REMAINING: writing track (.03 statement, .04 warm intro, .05 anchor notes); human-gated (.02 RIGHTS PASS = sole blocker to production minting; .12 ANU library); .15 BibTeX widget (after real DOIs). PRODUCTION CUTOVER once .02+.03 land: (1) zenodo:collection --write --create-community, (2) zenodo:deposit --write --prod --publish, (3) zenodo:collection --write --prod --publish (writes src/data/livecoding-collection.ts), (4) atproto:livecoding --write, (5) add each gig's document AT-URI to its Zenodo related_identifiers (raw at:// is accepted — verified).

PRODUCTION MINTED 2026-06-18: full Zenodo cutover run successfully. Public community ben-swift-livecoding; 27 per-gig DOIs (10.5281/zenodo.207436xx) each isPartOf the umbrella + filed in the community; umbrella concept DOI 10.5281/zenodo.20743614 (version .20743615), hasPart all 27, research statement as description, licensed CC-BY-SA-4.0. Per-gig DOIs (frontmatter) + src/data/livecoding-collection.ts committed; the /livecoding hub shows the citation block and gig pages show their DOIs. Rights resolved as link-only (.02). REMAINING: atproto records + carry each gig's document AT-URI as a DataCite relatedIdentifier (needs ATP creds: mise exec -- pnpm atproto:livecoding --write); .04 warm intro; .05 anchor notes; .12 ANU library enquiry; .15 BibTeX widget (DOIs now exist); backfill Ushini's ORCID when it arrives (.16).
<!-- SECTION:NOTES:END -->
