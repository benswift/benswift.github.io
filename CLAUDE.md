# benswift.me

Personal website and blog. Astro 7 + Svelte 5 + MDX, with Pagefind for search.

## Stack

- Astro 7, Svelte 5 (runes), TypeScript, MDX
- Pure CSS with custom properties, Stylelint (stylelint-config-standard)
- oxlint for JS/TS linting, oxfmt for formatting (all file types)
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

## Dev server (AI agents)

We're on Astro 7, so use its managed background dev server rather than
`astro dev &` plus polling for "Local:". `astro dev --background` blocks until
ready, then detaches; it's auto-enabled when Astro detects it's running inside
an agent. It writes `.astro/dev.json` (URL/port/PID) and exposes
`/_astro/status` (returns `{"ok": true}`). Manage it with `astro dev status`,
`astro dev logs --follow`, and `astro dev stop`. JSON log output turns on
automatically under agent detection (or pass `astro dev --json`).

## Svelte islands

Mount islands from `.mdx` with `client:visible` (or `client:load`), never
`client:only`. Astro drops a component's scoped `<style>` for `client:only`
islands imported from MDX: the `svelte-<hash>` class lands on the element but no
stylesheet ever defines a matching rule, so the component renders unstyled with
no warning at build time. Islands mounted from `.astro` files (HeroCanvas,
ForCodesTable) aren't affected. To check, load the page and look for a matching
rule in `document.styleSheets` --- the class attribute alone proves nothing.

Because those islands are now server-rendered, keep browser APIs out of the
component body and out of `onDestroy`. `onDestroy` is the one lifecycle hook
Svelte also runs during SSR, so cleanup belongs in the function returned from
`onMount`, which is client-only. A stray `window.removeEventListener` in
`onDestroy` fails the build with `window is not defined`.

Renaming a post from `.md` to `.mdx` to take an island doesn't change its URL,
but MDX parses `<` followed by a letter or digit as JSX. Prose that Markdown
passed through untouched (`p-values from <0.001`) becomes a build error ---
escape it as `&lt;`.

## Markdown processor

Astro 7's default Markdown processor is Sätteri, but this site (and
astro-theme-anu) deliberately stay on the legacy remark/rehype pipeline via
`markdown.processor: unified(...)` from `@astrojs/markdown-remark` --- we rely
on custom plugins (container directives, oldschool-dash smartypants, accessible
autolink headings) not yet ported to Sätteri. Don't "modernise" this to Sätteri
without porting those plugins and visually diffing the output.

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

## Image pipeline

The site uses Astro's image pipeline (`astro:assets`) for everything that's
authored or referenced from `src/`. Files in `src/` go through optimization
(content hashing, format negotiation, `width`/`height` injection); files in
`public/` are served as-is.

### Hero / OG images

The blog post route auto-discovers a hero by slug from
`src/assets/heroes/<YYYY-MM-DD-slug>.avif`. To override per-post, set
`image: ./my-image.svg` in frontmatter (path is relative to the post file,
resolved via the `image()` schema helper). The resolved hero is the
`og:image`/`twitter:image` (emitted as WebP) and the reduced-motion fallback
image; the on-page hero is a procedural WebGL canvas (`HeroCanvas`), and
`pnpm gen:hero-images` screenshots that canvas to produce the per-post AVIFs (it
does the posts missing a hero; `--force` regenerates all).

Hero SVGs use `viewBox="0 0 2844 1600"` (wide aspect ratio) with no
`width`/`height` attributes. Validate with `svg-validate` (a personal utility in
`~/.dotfiles/bin/`, on Ben's PATH):
`svg-validate --fix --palette "#be2edd,#3b82f6,#f59e0b,#1a1a1a,#e0e0e0,#9b1fb8"`.

### Inline post images

Two patterns, by file location:

1. **Colocated with the post** (preferred for post-specific images): drop the
   image next to the `.md`/`.mdx` file in `src/content/blog/YYYY/MM/DD/`, then
   reference with markdown syntax `![alt](./image.webp)`. Astro processes the
   relative path through the image pipeline.
2. **Shared via `<Picture>`**: for images used across multiple posts, add to
   `src/assets/post-images/<subdir>/<file>` and reference from `.mdx` files via
   `<Picture file="<subdir>/<file>" alt="..." />`. The component does an
   `import.meta.glob` lookup and renders `<Image>` (or raw `<img>` for animated
   GIFs).

Don't put new images in `public/assets/images/` — they'll skip the pipeline.

## SVG illustration style

Palette: #be2edd #3b82f6 #f59e0b #1a1a1a #e0e0e0 Prompt suffix: flowing Bézier
curves, layered organic forms on dark background References: existing
illustrations in `src/assets/heroes/`

Illustrations should be tangentially inspired by the post content --- not
literal diagrams, but visual metaphors that reward a second look.

## Image generation style

Model: **imagen** (text-to-image), with **no reference images** --- the house
style lives entirely in the prompt suffix below. This is deliberate: it keeps
this site's decks visually distinct from the llms-unplugged decks (which use
banana with reference images), and prevents style cross-contamination via shared
references.

Prompt suffix: drawn with a few confident scratchy pen strokes in white ink
only, plus exactly one loose splash of gold-amber watercolour, on an entirely
matte black field. The ONLY colours in the image are black, white, and
gold-amber --- no red, no blue, no other hues. Maximal black negative space,
spontaneous and deliberately unfinished, the hand of the artist visible in every
stroke. Full-bleed edge-to-edge composition --- no border, no frame, no mat, the
black field extends to every edge. No human figures or hands. STRICTLY NO TEXT,
NO WORDS, NO LETTERS, NO NUMBERS, NO NUMERALS, NO LABELS, NO SIGNATURES, NO
GLYPHS OR SYMBOLS RESEMBLING LETTERS OR DIGITS anywhere in the image.

Aspect ratio: `16:9` for full-bleed `![bg](...)` slides; `3:4` for split-layout
side panels (`![bg right:45%](...)` and similar).

Prompting tips (each of these clauses earned its place --- keep them intact):

- the subject is a visual metaphor, tangentially inspired by the slide content
  --- not a literal diagram
- one subject, described concretely; the style thrives on economy (a few
  strokes, one gold splash)
- dice must be "ordinary six-sided dice with round dot pips only, never digits"
  --- the model otherwise draws numbered d20s, violating the no-text rule
- measurement and document subjects (rulers, gauges, metronomes, weathervanes,
  report pages) drag numerals and pseudo-text in through their priors, and
  document scenes drift to white paper --- reword the subject itself ("a plain
  empty disc with a single needle", "solid featureless bars", "black pages drawn
  in white outline") rather than piling on corrective clauses
- without the black-field and palette-allowlist wording the model drifts to
  white paper and primary colours
- describe what's drawn, not what it represents: "small blank rectangles" (not
  "tokens"), "empty speech bubbles" (not "dialogue exchange")
- expect to re-roll: review every generated image before committing

## Creating new posts

Run `pnpm run post "<title>"` to create a new blog post with the correct
frontmatter and file structure. Every post must have a `description` field in
its frontmatter (it's required by the zod schema). Write a short, direct
description (1-2 sentences, under 160 characters) that tells readers what the
post is about before they click through.

## Publishing and the atproto state file

After any push that adds or edits a published post, a GitHub Actions workflow
syncs the post to the atproto network and pushes a follow-up
`[skip ci] update atproto state` commit (the github-actions bot) that updates
`atproto-state.json` --- the site's DID, publication AT-URI, and per-post
content hashes. So the remote will move on its own shortly after you push.

- Always `git pull --rebase` before doing more work once you've pushed a post;
  your local `main` will be behind by that bot commit.
- Never force-push `main`. The bot commits frequently, so even
  `--force-with-lease` can clobber its commit if your local tracking ref is
  stale. If a push is rejected, fetch and rebase rather than forcing.
- Don't hand-edit `atproto-state.json`; it's generated. If it ever looks lost,
  the next CI run regenerates it from the published posts. Deleting it forces a
  full record backfill on the next run (safe: the separate syndication ledger
  stops posts being re-announced to Bluesky).
- `atproto-recommendations.json` IS hand-edited (the exception): it lists
  `site.standard.document` AT-URIs this publication endorses, and the publish
  step syncs `site.standard.graph.recommend` records to match --- removing a
  line retracts the recommendation.
- `src/assets/publication-icon.png` is the publication's icon blob source,
  rendered from `public/favicon.svg` at 512x512 via sharp; regenerate it if the
  favicon changes.

## Design context

### Users

Mixed audience: academic peers and PhD students looking for publications and
research context; current or prospective students exploring courses and
technical posts; and creative/tech generalists arriving via search or social
media. The site serves all three groups without alienating any of them.

### Brand personality

**Warm, rigorous, playful.** Accessible academic who doesn't take themselves too
seriously --- serious ideas delivered with a light touch.

### Aesthetic direction

Dark-only theme. Content-forward with minimal decoration. The existing purple
(`#be2edd`) brand colour, Atkinson Hyperlegible typography, and asymmetric
rounded corners (8px 0 8px 8px) are established and should be preserved.

**Anti-references:** slick startup landing pages (no hero animations, gradient
CTAs, marketing-speak) and corporate/institutional sites (no committee-designed
blandness, stock photos, or university template aesthetic).

### Design principles

1. **Content first** --- decoration supports, never competes
2. **Warm darkness** --- inviting, not cold; purple-tinted neutrals over pure
   greys
3. **Quiet confidence** --- intentional and considered without drawing attention
   to itself
4. **Playful details** --- small surprises that reward attention without
   demanding it
5. **Accessibility as craft** --- not a checkbox but a design value
