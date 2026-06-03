---
id: TASK-22
title: Port the LLMs Unplugged (ACE 2026) talk deck to benswift.me
status: To Do
assignee: []
created_date: '2026-06-03 05:22'
labels:
  - decks
  - migration
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The ace-26.deck.mdx deck in the llms-unplugged repo is a personal conference talk (Ben presenting about the LLMs Unplugged project at ACE 2026), not reusable workshop teaching material. It sits awkwardly in a teaching-resources repo that is now being shared for other facilitators to deliver. Move it to benswift.me alongside the other talk decks, then remove it and its exclusively-used assets from llms-unplugged.

The deck is self-contained: its only component import is SocyLogo from astro-theme-anu (already a benswift.me dependency), with no llms-unplugged-specific components and no _if gating directive.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The ACE 2026 talk deck lives in benswift.me under src/decks/ and renders correctly, with all 34 referenced assets present in src/decks/assets/ (including the cards/ subdirectory).
- [ ] #2 The talk is registered in the benswift.me talks system (src/pages/talks/) so it appears under /talks and links through to its deck page.
- [ ] #3 benswift.me builds cleanly (pnpm build) and typechecks (pnpm typecheck), with the deck rendering and no missing assets.
- [ ] #4 The deck file and the 23 assets used only by ace-26 are removed from llms-unplugged.
- [ ] #5 The 11 assets shared with the workshop decks remain in llms-unplugged, and llms-unplugged still builds cleanly.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Source: ~/projects/llms-unplugged/website/src/decks/ace-26.deck.mdx and the deck assets in the sibling assets/ dir. Target: ~/projects/benswift-me/src/decks/ plus src/decks/assets/. Consider renaming the slug to something clearer than ace-26 (e.g. llms-unplugged-ace-2026) and match the talks entry to it.

Dependencies: benswift.me is on astromotion v0.5.1; llms-unplugged is on v0.5.2 (astro-theme-anu matches at v0.4.0). The deck uses only standard astromotion features (background images, _class, QR codes, split layouts) and no _if directive, so v0.5.1 may suffice, but bump astromotion to v0.5.2 or later for parity. The anu-theme-sync skill covers the sibling-repo update flow.

Assets to copy (all 34) into benswift.me src/decks/assets/:

SHARED (11), also used by the llms-unplugged workshop decks, so copy across but DO NOT delete from llms-unplugged: bg-acknowledgement, bg-core-insight, bg-div-historical, bg-div-lessons, bg-div-mechanic, bg-div-reception, bg-div-resources, bg-markov, bg-participants, bg-randomness, bg-resources (all .avif).

EXCLUSIVE (23), used only by ace-26, so copy across AND delete from llms-unplugged: bg-3up-kids, bg-3up-lecturer, bg-3up-phd, bg-brimbank, bg-design-goals, bg-div-demo, bg-div-quote, bg-div-quote-portrait, bg-fundamentals, bg-gap, bg-problem, bg-title, headshot-ben, plus the cards/ subdir: hero-in-context-memory, hero-induction-heads, hero-lora, hero-more-context, hero-pretrained-generation, hero-rlhf, hero-sampling, hero-synthetic-data, hero-tool-use, hero-word-embeddings (all .avif).

Steps:
1. Bump astromotion in benswift.me if needed, then pnpm install.
2. Copy the deck into benswift.me src/decks/ (rename slug) and all 34 assets (preserve the cards/ subdir).
3. Register the talk in src/pages/talks/ following the existing talks-index pattern (so hasDeck links to /decks/<slug>/).
4. Build and typecheck benswift.me, then spot-check the deck renders (agent-browser with --no-sandbox; astromotion hides the global Reveal object, so navigate slides via location.hash).
5. In llms-unplugged, delete src/decks/ace-26.deck.mdx and the 23 exclusive assets; keep the 11 shared ones.
6. Build llms-unplugged to confirm nothing references the removed files; commit each repo separately.

Notes: the shared/exclusive split is a static grep from 2026-06-03, so re-verify at execution time with a fresh build and an unused-asset check before deleting anything. SocyLogo resolves via astro-theme-anu, so no component porting is needed.
<!-- SECTION:PLAN:END -->
