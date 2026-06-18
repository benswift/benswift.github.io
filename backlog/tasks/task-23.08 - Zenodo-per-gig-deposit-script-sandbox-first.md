---
id: TASK-23.08
title: Zenodo per-gig deposit script (sandbox first)
status: Done
assignee:
  - '@claude'
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 08:32'
labels:
  - script
  - infra
  - zenodo
dependencies: []
parent_task_id: TASK-23
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core minting script driven by the Zenodo REST API via 'mise exec --' (token ZENODO_ACCESS_TOKEN). For each gig lacking a DOI: create deposition, upload agreed files, set metadata, reserve DOI, publish, write DOI back to frontmatter. Idempotent/incremental. Develop and dry-run against sandbox.zenodo.org. Depends on the schema, tokens and rights tasks.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Reads the livecoding collection and mints only gigs lacking a doi
- [x] #2 Metadata: gig as Event + linked Audiovisual for the recording; creators/contributors from artists with roles + ORCIDs; ANU ROR as affiliation; relatedIdentifiers for video (IsVariantFormOf), archived event/venue URLs, AT-URI, related works
- [x] #3 Pre-reserved DOI written back into gig frontmatter before publish
- [x] #4 Idempotent/incremental; verified end-to-end on ICLC'24 against sandbox
- [x] #5 DataCite-to-ORCID auto-update considered/enabled
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Built scripts/zenodo-deposit.ts (npm: zenodo:deposit; run via 'mise exec --' for tokens). Legacy Zenodo Deposit API. Per gig lacking a doi: create deposition -> reserve DOI -> set metadata -> upload placeholder doc file -> write reserved DOI to frontmatter -> publish (reconciles final DOI post-publish). Metadata: creators = Ben (ORCID + ANU) + collaborators (ORCIDs where known); upload_type video|other; related_identifiers = video IsVariantFormOf, event_url references, archived_* isDocumentedBy, related_works. Flags --write/--prod/--only/--publish/--no-files; idempotent via frontmatter doi + gitignored sidecar state file. VERIFIED end-to-end on ICLC'24 against sandbox (deposition 514976, published, record live HTTP 200); sandbox DOI reverted from frontmatter (not committed). Added Happy-Eyeballs (autoSelectFamily) so it works on IPv6-broken networks. AC5: ORCIDs supplied in creators; enabling the DataCite->ORCID push is a one-time ORCID/Zenodo account setting for Ben. SANDBOX QUIRK: reserved DOI prefix 10.5281 vs published 10.5072 (prod matches both; script reconciles). OPEN for Ben's review before production: (a) upload_type video/other vs strict DataCite Event/Audiovisual (would need the InvenioRDM API); (b) collaborators as co-creators vs contributors; (c) default licence CC-BY-4.0; (d) archival video upload. PRODUCTION MINT HELD on rights pass (.02).

CLOSED 2026-06-18: ran successfully in production — minted all 27 per-gig DOIs (each isPartOf the umbrella + filed in the community). Gained the --update mode for in-place metadata edits (same DOI). Rights pass (.02) and metadata mapping both resolved; Ben authorised the prod mint.
<!-- SECTION:NOTES:END -->
