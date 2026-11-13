---
key: "swift2025apstracker"
title: "APS AI Tracker"
authors:
  - name: "Ben Swift"
    orcid: "0000-0003-2138-5969"
year: 2025
publication_date: "2025-11-11"
doi: "10.5281/zenodo.20842437"
latest_version_doi: "10.5281/zenodo.20842438"
license: "CC BY 4.0"
upload_type: dataset
kind: single
category: "Recorded/Rendered Creative Works: Website/web-based"
category_note: "a live online research tool over a self-built dataset"
category_alternates:
  - "Research software or a curated dataset (a hybrid rather than a creative work; confirm with the collection officer)"
designation: Standard
individual_contribution:
  percent: 100
  note: "sole creator"
for_codes:
  - code: "460805"
    name: "Fairness, accountability, transparency, trust and ethics of computer systems"
    weight: 50
  - code: "440708"
    name: "Public administration"
    weight: 30
  - code: "460208"
    name: "Natural language processing"
    weight: 20
for_notes: "460805 names the transparency/accountability subject; NLP for the embedding/diff text analysis; public administration for the policy domain. This breaks the creative-arts FoR pairing used for the other outputs: it is a data-and-policy output, so a different FoR pair is justified."
coding_status: proposed
rp_plus:
  subcategory: "Web-site Based Work"
  subcategory_note: "or lodge as research software / dataset"
  status: not-lodged
checklist:
  statement_finalised: false
  coding_validated: false
  evidence_filed: false
  rp_plus_record: false
verification_evidence:
  - "the live site (apsaitracker.app)"
  - "the open-source repository (github.com/ANUcybernetics/aps-ai-tracker)"
  - "the Studio project page (cybernetics.anu.edu.au/projects/aps-ai-tracker/)"
  - "the Zenodo archive"
  - "the daily-scrape git history that constitutes the dataset itself"
related_works:
  - relation: "isVariantFormOf"
    url: "https://apsaitracker.app"
    type: "website"
  - relation: "isSupplementTo"
    url: "https://github.com/ANUcybernetics/aps-ai-tracker"
    type: "software"
  - relation: "isDocumentedBy"
    url: "https://cybernetics.anu.edu.au/projects/aps-ai-tracker/"
    type: "website"
notes:
  - "The DOI resolves to the latest archived snapshot of the living tracker."
  - 'Naming settled as "APS AI Tracker" (Ben, 28 Jul 2026), matching apsaitracker.app, the aps-ai-tracker repo and the /projects/aps-ai-tracker/ page; it replaces the older "APS AI Transparency Tracker". Outstanding: the Zenodo record title still reads "Australian Government AI Tracker" and needs a metadata edit (title, plus a description line glossing APS as the Australian Public Service). It is an in-place edit, not a new version. The old anucybernetics.github.io/aps-ai-transparency-tracker URL still resolves via GitHub''s rename redirect.'
  - "Zenodo related identifiers are current: the v2026.06 record (25 Jun 2026) carries apsaitracker.app, the renamed GitHub repo and the Studio project page."
  - "Reception, as at July 2026: Digital Transformation Agency (the policy owner) wrote unsolicited to congratulate Ben on the tracker and asked a scope question about AIATSIS and APVMA (email, Slavomir Kucharski, Assistant Director, Strategic Communication & Media, 6 Jul 2026; verified), the strongest significance evidence. The Australia Institute (Richard Denniss) sent the tracker link on 20 Jul 2026, in a relationship that also produced commissioned LLMs Unplugged workshops. Clean Energy Regulator (Leigh McFarlane) circulated it within the agency on 30 Jun 2026."
---

**Research background.** In February 2025 the Australian Government's Digital
Transformation Agency mandated that every non-corporate Commonwealth entity
publish an AI transparency statement and keep it current. The result is a
live, distributed and largely un-curated public record: scores of agencies,
each maintaining its own statement and editing it over time without
announcement. This work sits at the intersection of human-centred computing,
computational text analysis and public-sector accountability. It asks a
question the policy leaves open. Once transparency is mandated but never
aggregated, how can the public read the record over time: see what changes,
what is copied, what is walked back?

**Research contribution.** The _APS AI Tracker_ is citable research
infrastructure that turns that scattered paper trail into a single versioned
dataset. It scrapes all 126 APSC-listed agencies daily and commits each
statement to git as structured markdown. Every change is captured with a
timestamp and a diff: wording softened, capabilities added, claims walked
back. Three analytical readings sit on top of the corpus. A timeline records
every change. An embedding-based map shows which statements read alike. A
propagation explorer measures how much of each statement is bespoke rather
than copied from the central template; some are 0% original. The contribution
is both the open, reproducible instrument and the longitudinal dataset it
produces, with every figure traceable to a source document and a commit.
Together they make a diffuse compliance regime legible and analysable as a
whole.

**Research significance.** The tracker is live and open-source, openly
archived with a citable DOI. It already documents hundreds of recorded changes
across the published statements of all 126 agencies. Its significance lies in
being the only continuous, public, version-controlled account of how the
Australian Government adopts and accounts for its own use of AI. It is
public-interest infrastructure, usable by researchers, journalists and the
agencies themselves. That use is now evidenced from the centre of the policy
it observes: in July 2026 the Digital Transformation Agency --- the body that
mandated the statements --- wrote unsolicited to commend the tracker and to
engage with how it classifies agencies falling outside the mandate. It has
also been taken up by policy-research and regulatory bodies, among them The
Australia Institute and the Clean Energy Regulator. As a 2025-- living work
its citation record is still accruing, but its uptake by the institutions it
documents is already on the record.
