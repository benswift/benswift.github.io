---
id: TASK-19
title: Integrate VitePress blog with atproto (standard.site – middle level)
status: To Do
assignee: []
created_date: '2026-02-18 22:08'
updated_date: '2026-02-19 00:22'
labels:
  - atproto
  - vitepress
  - github-actions
  - automation
  - standard.site
dependencies: []
references:
  - 'https://sequoia.pub/llms-full.txt'
  - 'https://stevedylan.dev/posts/introducing-sequoia/'
  - 'https://stevedylan.dev/posts/standard-site-the-publishing-gateway/'
  - 'https://www.npmjs.com/package/@atproto/api'
  - 'https://atproto.com/specs/record-key'
documentation:
  - 'https://standard.site/'
  - 'https://tangled.org/standard.site/lexicons'
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Automate publication of `site.standard.*` records to AT Protocol during GitHub Actions deploy, and inject verification metadata into the static VitePress build.

## Context

- Handle: `@benswift.me`, standard Bluesky PDS (`bsky.social`)
- Blog: VitePress static site, posts at `blog/YYYY/MM/DD/slug.md`
- Dates derived from directory path, not frontmatter
- Posts use minimal frontmatter: `title`, `tags`, optional `published`

## Approach: custom script (not Sequoia)

Sequoia CLI doesn't fit cleanly because:
- slug/path computation doesn't handle nested date directories (`blog/YYYY/MM/DD/slug`)
- it writes `atUri` back into source frontmatter (undesirable)
- its custom frontmatter parser is a risk with non-standard setups

Instead, build two lightweight TypeScript scripts (~150 lines total) using `@atproto/api` directly, with a committed JSON state file for rkey tracking.

## In scope

- `scripts/atproto-publish.ts`: authenticate, create/update `site.standard.publication` and `site.standard.document` records via `putRecord`
- `scripts/atproto-inject.ts`: inject `<link rel="site.standard.document">` into built HTML
- `atproto-state.json`: committed state file mapping post paths to rkeys and content hashes
- Content hash tracking so only changed posts are pushed on each deploy
- `.well-known/site.standard.publication` generated into `public/`
- GitHub Actions workflow steps (publish → build → inject → deploy)
- `ATP_IDENTIFIER` and `ATP_APP_PASSWORD` as GitHub secrets
- Comprehensive test suite with mocked PDS (no real PDS calls in tests)

## Frontmatter changes (acceptable)

- Add `description` to post frontmatter (replace auto-extraction)
- Possibly add `date` explicitly (currently derived from path)

## Out of scope

- Sequoia CLI
- Running a custom PDS
- Social features (comments, likes, replies)
- Historical backfill (optional future work)
- Blob/media uploads (optional future work)
- Self-hosted PDS
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 `site.standard.publication` record created/updated idempotently on deploy
- [ ] #2 `site.standard.document` records created/updated per post with correct `path` field matching existing blog URLs
- [ ] #3 Only changed posts (by content hash) are pushed to PDS on each deploy
- [ ] #4 Post edits/typo fixes update the existing record (stable AT-URI via stored rkey)
- [ ] #5 Posts with `published: false` are skipped
- [ ] #6 `<link rel="site.standard.document">` injected into built HTML for each published post
- [ ] #7 `/.well-known/site.standard.publication` serves the correct AT-URI
- [ ] #8 All core logic (frontmatter parsing, path computation, state management, HTML injection) tested without real PDS calls
- [ ] #9 GitHub Actions deploy workflow updated with publish and inject steps
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Phase 1: Core library and state management

1. Add dependencies: `@atproto/api`, `@atproto/common`, `gray-matter`
2. Create `scripts/lib/atproto.ts` — thin wrapper around `AtpAgent` (easy to mock)
3. Create `scripts/lib/posts.ts` — post discovery, frontmatter parsing, date extraction from path, content hashing
4. Create `scripts/lib/state.ts` — read/write `atproto-state.json`, track rkeys and content hashes
5. Write tests for posts and state modules using fixtures (no PDS)

## Phase 2: Publish script

6. Create `scripts/atproto-publish.ts` — main publish pipeline:
   - Auth with env vars
   - Ensure publication record exists (putRecord, idempotent)
   - Discover posts, diff against state hashes, publish changed ones
   - Generate `.well-known/site.standard.publication` into `public/`
   - Save updated state
7. Write tests with mocked AtpAgent

## Phase 3: Inject script

8. Create `scripts/atproto-inject.ts` — post-build HTML injection:
   - Read state for path → atUri mapping
   - Scan `.vitepress/dist/**/*.html`
   - Match HTML files to posts by path
   - Inject `<link>` tag before `</head>`
9. Write tests against fixture HTML files

## Phase 4: Frontmatter migration

10. Script to add `description` field to existing posts (extract from first paragraph)
11. Optionally add `date` to frontmatter

## Phase 5: CI integration

12. Add `ATP_IDENTIFIER` and `ATP_APP_PASSWORD` secrets to GitHub repo
13. Update `.github/workflows/deploy.yml` with publish and inject steps
14. End-to-end dry run test
<!-- SECTION:PLAN:END -->
