---
id: TASK-23
title: Livecoding body of work as citable NTROs (DataCite DOIs + atproto)
status: To Do
assignee: []
created_date: '2026-06-18 00:54'
updated_date: '2026-06-18 01:20'
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
Refined build order: .06 schema (+videos[]) -> .14 extract in-body video embeds + strip migration cruft -> .13 metadata audit/normalise/enrich -> .07 Wayback -> .08 Zenodo deposit (sandbox) -> .09 collection+Community -> .10 atproto -> .11 UI. VERIFIED the Jekyll->VitePress->Astro migration did NOT lose video data: all Vimeo URLs are present in-body (iframe count == orphaned-comment count in every file); git-history recovery not needed.
<!-- SECTION:NOTES:END -->
