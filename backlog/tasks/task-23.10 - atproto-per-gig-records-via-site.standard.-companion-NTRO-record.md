---
id: TASK-23.10
title: atproto per-gig records via site.standard.* + companion NTRO record
status: To Do
assignee: []
created_date: '2026-06-18 00:56'
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
- [ ] #1 standard.site lexicon catalogue checked; extend-vs-companion decision recorded
- [ ] #2 A site.standard.document record emitted per gig (AT-URI + CID)
- [ ] #3 A companion NTRO record (own namespace) holds the DOI + a strongRef {uri,cid} to the document
- [ ] #4 AT-URI exposed for use as a DataCite relatedIdentifier
<!-- AC:END -->
