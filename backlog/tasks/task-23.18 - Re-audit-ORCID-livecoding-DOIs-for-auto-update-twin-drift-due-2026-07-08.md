---
id: TASK-23.18
title: Re-audit ORCID livecoding DOIs for auto-update twin drift (due 2026-07-08)
status: To Do
assignee: []
created_date: '2026-06-24 06:21'
labels:
  - admin
  - orcid
  - 'due:2026-07-08'
dependencies: []
parent_task_id: TASK-23
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Follow-up to TASK-23.17, which curated Ben's ORCID record (0000-0003-2138-5969) to exactly one work per livecoding gig (27 version DOIs + umbrella concept 614) and enabled DataCite ORCID auto-update.

DataCite auto-update is event-driven (it pushes a DOI to ORCID when that DOI is registered or its metadata updated), not a scheduled crawl, and it did NOT retroactively re-push the existing 28 DOIs when enabled. So the expectation is that the curated state stays clean. This task is the safety re-audit to confirm no concept/version twins have drifted back in (e.g. if a Zenodo record got re-published, or if DataCite ran a reconciliation), and to do the optional provenance dedup.

Due 2026-07-08 (~2 weeks after the 2026-06-24 curation). Quick API pull, no UI needed unless drift is found.

Audit one-liner: curl -s -H 'Accept: application/json' https://pub.orcid.org/v3.0/0000-0003-2138-5969/works and check, per zenodo.20743NNN DOI, that each gig has exactly one work whose SELF doi is the canonical one (version DOI, or concept 614 for the umbrella), and that none of the 28 SKIP twins appear as a SELF identifier (version-of pointers on the 6 DataCite-sourced works are fine: 632, 675, 686, 690, 707, 709).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Re-pulled the ORCID works API and confirmed all 28 canonical DOIs still present as exactly one self work each (no missing, no duplicates)
- [ ] #2 Confirmed no concept/version SKIP twin has reappeared as a self identifier (standalone claimed work); version-of pointers on the 6 DataCite-sourced works are acceptable
- [ ] #3 If auto-update added DataCite-sourced copies of the version DOIs, did the optional provenance dedup: deleted the self-asserted (Ben Swift) duplicates, kept the DataCite-sourced ones
- [ ] #4 Checked that no non-gig Zenodo items (My First Language Model, Perceptron Apparatus, Slop Salon, LLM Brainscan, Imaginative Restoration, etc.) were swept in undesirably by auto-update
<!-- AC:END -->
