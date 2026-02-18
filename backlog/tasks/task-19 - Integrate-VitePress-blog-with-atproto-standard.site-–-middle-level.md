---
id: TASK-19
title: Integrate VitePress blog with atproto (standard.site – middle level)
status: To Do
assignee: []
created_date: '2026-02-18 22:08'
labels:
  - atproto
  - vitepress
  - github-actions
  - automation
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Automate publication of `site.standard.*` records to AT Protocol (atproto) during GitHub Actions deploy, and inject required verification metadata into the static VitePress build.

This enables:

- AT Protocol discovery of long-form posts
- Stable AT-URIs per blog post
- Domain verification via `.well-known`
- Fully automated publish-on-deploy workflow
- Continued use of Bluesky-hosted PDS (no self-hosting required)
- Static-site architecture (no runtime server required)

Content remains static HTML (VitePress). atproto stores structured metadata only.

## In scope

- Create/update:
  - `site.standard.publication` (idempotent)
  - `site.standard.document` (per post, per deploy)
- Deterministic rkey strategy (no duplicate records)
- GitHub Actions automation
- Inject `<link rel="site.standard.document">` into blog posts
- Publish:
  - `/.well-known/site.standard.publication`
  - `.nojekyll`
- Authenticate using Bluesky App Password
- Use `@atproto/api` JavaScript client

## Out of scope

- Running a custom PDS
- Social features (comments, likes, replies)
- Historical backfill beyond current posts (optional future work)
- Blob/media uploads (optional future work)
<!-- SECTION:DESCRIPTION:END -->
