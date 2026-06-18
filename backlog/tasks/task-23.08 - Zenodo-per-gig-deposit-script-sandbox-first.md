---
id: TASK-23.08
title: Zenodo per-gig deposit script (sandbox first)
status: To Do
assignee: []
created_date: '2026-06-18 00:56'
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
- [ ] #1 Reads the livecoding collection and mints only gigs lacking a doi
- [ ] #2 Metadata: gig as Event + linked Audiovisual for the recording; creators/contributors from artists with roles + ORCIDs; ANU ROR as affiliation; relatedIdentifiers for video (IsVariantFormOf), archived event/venue URLs, AT-URI, related works
- [ ] #3 Pre-reserved DOI written back into gig frontmatter before publish
- [ ] #4 Idempotent/incremental; verified end-to-end on ICLC'24 against sandbox
- [ ] #5 DataCite-to-ORCID auto-update considered/enabled
<!-- AC:END -->
