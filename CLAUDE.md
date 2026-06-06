# benswift.me

Personal website and blog. Astro 6 + Svelte 5 + MDX, with Pagefind for search.

## Stack

- Astro 6, Svelte 5 (runes), TypeScript, MDX
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
`pnpm gen:hero-images` screenshots that canvas to produce the per-post AVIFs
(it does the posts missing a hero; `--force` regenerates all).

Hero SVGs use `viewBox="0 0 2844 1600"` (wide aspect ratio) with no
`width`/`height` attributes. Validate with `svg_validate.py` (a personal
utility in `~/.dotfiles/bin/`, on Ben's PATH):
`svg_validate.py --fix --palette "#be2edd,#3b82f6,#f59e0b,#1a1a1a,#e0e0e0,#9b1fb8"`.

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

Palette: #be2edd #3b82f6 #f59e0b #1a1a1a #e0e0e0
Prompt suffix: flowing Bézier curves, layered organic forms on dark background
References: existing illustrations in `src/assets/heroes/`

Illustrations should be tangentially inspired by the post content --- not
literal diagrams, but visual metaphors that reward a second look.

## Image generation style

This site uses the same astromotion theme as the llms-unplugged site, so most
of those image-gen instructions apply.

Prompt suffix: Flat 2D vector illustration on a pure black background ---
absolutely NO 3D rendering, NO perspective, NO isometric, NO faceted/low-poly
shapes, NO photographic depth, NO drop shadows, NO realistic lighting.
Strictly limited colour palette: gold/amber, black, white, and warm beige/tan
tones. Clean, consistent-weight outlines (black, white, or gold strokes) with
flat filled shapes --- no gradients, no photorealism. Subtle background
texture of interlocking circles or rounded geometric grid patterns in a very
dark grey. Geometric and slightly stylised --- people (if any) are simplified
faceless silhouettes drawn as single flat shapes (NOT low-poly polygonal or
3D-faceted figures). Occasional soft gold glow effects for emphasis. Sparse,
balanced composition with generous negative space. STRICTLY NO TEXT, NO
WORDS, NO LETTERS, NO NUMBERS, NO LABELS, NO ANNOTATIONS, NO TALLY MARKS,
NO GLYPHS, NO SYMBOLS RESEMBLING LETTERS anywhere in the image. Modern
editorial illustration style --- conceptual and symbolic rather than literal.

Reference images: pick 2--3 at random from the deck's own assets directory
(`src/decks/assets/<deck-slug>/`) as `--input-image` references --- this
keeps each deck visually self-consistent as more images get added. Don't
name specific files in this section; the pick is meant to be random each
time.

Prompting tips:

- avoid words that imply written content: "word-cards", "labels",
  "annotated", "diagram", "blueprint", "schematic", "concept-map", "tag"
- never quote target words verbatim
- describe what's drawn, not what it represents: "small blank rectangles"
  (not "tokens"), "empty speech bubbles" (not "dialogue exchange")
- for figures, say "flat silhouette drawn as a single filled shape" --- the
  model interprets bare "geometric figure" as low-poly 3D
- expect to re-roll: review every generated image before committing

## Creating new posts

Run `pnpm run post "<title>"` to create a new blog post with the correct
frontmatter and file structure. Every post must have a `description` field in
its frontmatter (it's required by the zod schema). Write a short, direct
description (1-2 sentences, under 160 characters) that tells readers what the
post is about before they click through.

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
