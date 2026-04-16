# benswift.me

Personal website and blog. Astro 6 + Svelte 5 + MDX, with Pagefind for search.

## Stack

- Astro 6, Svelte 5 (runes), TypeScript, MDX
- Pure CSS, lightningcss
- oxlint + oxfmt for JS/TS, Prettier for Astro/Svelte/CSS/MD
- Vitest for tests
- Pagefind for client-side search (runs post-build)

## Commands

- `pnpm dev` --- start dev server
- `pnpm build` --- build static site (includes Pagefind indexing)
- `pnpm test` --- run unit tests
- `pnpm test:integration` --- run integration tests
- `pnpm typecheck` --- astro check + svelte-check
- `pnpm lint` --- run oxlint
- `pnpm format:check` --- check formatting
- `pnpm post "<title>"` --- create a new blog post with correct frontmatter

## Blog post writing style guide

Always use ts (not js) and follow Astro conventions wherever possible. Stick to
modern best practices, e.g. es6 modules.

## Voice and tone

Write in a conversational, academic style that's accessible without being dumbed
down. Use first person ("I") freely. Use the benswift-writer skill.

## Custom containers

Use `info`, `tip`, `danger`, `warning` and `details` containers as necessary,
but ensure there are blank lines between them and the content, e.g.

```md
:::tip

Here's a tip.

:::
```

### When to use tip vs info

- **`:::tip`** --- for actionable guidance: technical advice, recommendations,
  how-to instructions, cross-references where the reader should take action
- **`:::info`** --- for contextual information: background context, source
  attributions ("This article originally appeared in..."), status updates,
  corrections, disclaimers, author bios

## Code and technical content

When discussing code or technical concepts:

- show actual code snippets
- explain the "why" not just the "what"
- acknowledge when something is a hack or workaround
- be honest about limitations and problems

## Australian spelling

Use Australian English: "colour", "centre", "realise" (not "realize")

## Inline HTML/SVG in markdown

Never put blank lines inside inline HTML blocks (e.g. `<svg>`, `<div>`) in
markdown files. CommonMark treats a blank line as the end of an HTML block,
causing the rest of the HTML to be parsed as markdown and silently dropped.

## SVG illustration style

Palette: #be2edd #3b82f6 #f59e0b #1a1a1a #e0e0e0
Prompt suffix: flowing Bézier curves, layered organic forms on dark background
References: public/assets/images/posts/

Hero SVGs use `viewBox="0 0 2844 1600"` (wide aspect ratio) with no
`width`/`height` attributes. Store in `public/assets/images/posts/` and
reference via the `image` frontmatter field (e.g.
`image: /assets/images/posts/my-illustration.svg`). The same path serves both
the rendered hero in PostLayout and the og:image metadata.

Illustrations should be tangentially inspired by the post content --- not
literal diagrams, but visual metaphors that reward a second look. Validate with
`svg_validate.py --fix --palette "#be2edd,#3b82f6,#f59e0b,#1a1a1a,#e0e0e0,#9b1fb8"`.

## Creating new posts

Run `pnpm run post "<title>"` to create a new blog post with the correct
frontmatter and file structure. Every post must have a `description` field in
its frontmatter (it's required by the zod schema). Write a short, direct
description (1-2 sentences, under 160 characters) that tells readers what the
post is about before they click through.
