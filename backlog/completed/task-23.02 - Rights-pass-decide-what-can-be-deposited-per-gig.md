---
id: TASK-23.02
title: 'Rights pass: decide what can be deposited per gig'
status: Done
assignee: []
created_date: '2026-06-18 00:56'
updated_date: '2026-06-18 07:41'
labels:
  - 'needs:ben'
  - content
dependencies: []
parent_task_id: TASK-23
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
For each gig with media, decide deposit-the-file vs link-only, plus a licence. Resolve the known third-party cases: the ICLC'24 recording was made by the NYU Shanghai team; the ACMC'09 photos are Andrew Brown's 'all rights reserved'. Own footage is fine to deposit.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Per-gig manifest: what to upload (video/docs) vs link-only, with a licence each
- [x] #2 ICLC'24 recording cleared for deposit or set to link-only
- [x] #3 ACMC'09 photos cleared or set to link-only
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
RESOLVED 2026-06-18 by Ben: LINK-ONLY for all gigs — no media files are uploaded
to Zenodo. Recordings stay on Vimeo/YouTube and are linked via isVariantFormOf;
the only file in each Zenodo record is Ben's own placeholder documentation text.
Linking (rather than redistributing) sidesteps third-party rights entirely, so
every gig is treated the same and no rights-holder clearance is needed.

LICENCE: CC-BY-SA-4.0 for Ben's own content, matching the site licence
(creativecommons.org/licenses/by-sa/4.0). Applies to the record's own content
(metadata + placeholder doc); it does not relicense the linked third-party
recordings.

- AC #2 ICLC'24 recording (made by the NYU Shanghai team): link-only.
- AC #3 ACMC'09 photos (Andrew Brown, all rights reserved): link-only / not
  deposited.

APPLIED: zenodo-deposit.ts and zenodo-collection.ts default licence changed
cc-by-4.0 -> cc-by-sa-4.0 (verified accepted by Zenodo sandbox, 200). The
deposit script already uploads only a placeholder doc and links media, so NO
media-upload code is needed.

EFFECT: production per-gig minting is now UNBLOCKED. The collection umbrella
publish still wants the .03 research statement for its description (the
collection script deliberately refuses to publish a placeholder description to
production).
<!-- SECTION:NOTES:END -->
