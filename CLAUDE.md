# benswift.me

Personal website and blog: Astro 7, Svelte 5 (runes), TypeScript, MDX, pure CSS
with custom properties. oxlint + Stylelint for linting, oxfmt for formatting
(all file types), Vitest for tests, Pagefind for search (indexed post-build).

## Commands

- `pnpm dev` --- start dev server
- `pnpm build` --- build static site (includes Pagefind indexing)
- `pnpm test` / `pnpm test:integration` --- unit / integration tests
- `pnpm typecheck` --- astro check + svelte-check
- `pnpm lint` --- oxlint + stylelint
- `pnpm format:check` --- check formatting
- `pnpm post "<title>"` --- scaffold a new blog post

## Dev server

`astro dev` detects agent environments and runs itself as a background daemon,
so just run `pnpm dev` --- never `astro dev &` plus polling for "Local:". It
writes `.astro/dev.json` (URL, port, PID), logs JSON to `.astro/dev.log`, and
serves `/_astro/status` (returns `{"ok": true}`). Manage it with
`astro dev status`, `astro dev logs --follow` and `astro dev stop`.

## Svelte islands

Mount islands from `.mdx` with `client:visible` (or `client:load`), never
`client:only`. Astro drops a component's scoped `<style>` for `client:only`
islands imported from MDX: the `svelte-<hash>` class lands on the element but no
stylesheet ever defines a matching rule, so the component renders unstyled with
no build-time warning. Islands mounted from `.astro` files (HeroCanvas,
ForCodesTable) aren't affected.

Those islands are server-rendered, so keep browser APIs out of the component
body and out of `onDestroy` --- the one lifecycle hook Svelte also runs during
SSR. Cleanup belongs in the function returned from `onMount`, which is
client-only.

Renaming a post from `.md` to `.mdx` doesn't change its URL, but MDX parses `<`
followed by a letter or digit as JSX. Prose that Markdown passed through
untouched (`p-values from <0.001`) becomes a build error --- escape it as
`&lt;`.

## Markdown processor

The site deliberately stays on the legacy remark/rehype pipeline (the
`markdown.processor` block in `astro.config.ts`) rather than Astro 7's default
Sätteri, because the custom plugins --- container directives, oldschool-dash
smartypants, accessible autolink headings --- aren't ported. Don't "modernise"
this to Sätteri without porting them and visually diffing the output.

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

`:::tip` is for actionable guidance: advice, recommendations, how-to
instructions, cross-references where the reader should act. `:::info` is for
context: background, source attributions, status updates, corrections,
disclaimers, author bios.

## Inline HTML/SVG in markdown

Never put blank lines inside inline HTML blocks (e.g. `<svg>`, `<div>`) in
markdown files. CommonMark treats a blank line as the end of an HTML block,
causing the rest of the HTML to be parsed as markdown and silently dropped.

## Creating new posts

`pnpm post "<title>"` scaffolds the file and frontmatter. Every post needs a
`description` (required by the zod schema): 1-2 sentences, under 160 characters,
telling readers what the post is about before they click through.

## Image pipeline

Everything authored or referenced from `src/` goes through Astro's image
pipeline (`astro:assets`: content hashing, format negotiation, `width`/`height`
injection). Files in `public/` are served as-is --- don't put new images in
`public/assets/images/`.

### Hero / OG images

The blog post route auto-discovers a hero by slug from
`src/assets/heroes/<YYYY-MM-DD-slug>.avif`. To override per-post, set
`image: ./my-image.svg` in frontmatter (path relative to the post file, resolved
via the `image()` schema helper); a hand-made override needs the same wide
aspect ratio, `viewBox="0 0 2844 1600"` with no `width`/`height`. The resolved
hero is the `og:image`/`twitter:image` (emitted as WebP) and the reduced-motion
fallback for the on-page procedural WebGL hero (`HeroCanvas`).
`pnpm gen:hero-images` screenshots that canvas to produce the per-post AVIFs ---
posts missing a hero by default, all of them with `--force`.

### Inline post images

Post-specific images go next to the `.md`/`.mdx` file in
`src/content/blog/YYYY/MM/DD/`, referenced as `![alt](./image.webp)`. Images
shared across posts go in `src/assets/post-images/<subdir>/<file>`, referenced
from `.mdx` as `<Picture file="<subdir>/<file>" alt="..." />`.

## SVG illustration style

Palette: `#be2edd` `#3b82f6` `#f59e0b` `#1a1a1a` `#e0e0e0`. Flowing Bézier
curves, layered organic forms on a dark background. Illustrations should be
tangentially inspired by the post content --- not literal diagrams, but visual
metaphors that reward a second look.

Validate with `svg-validate` (a personal utility in `~/.dotfiles/bin/`, on Ben's
PATH):
`svg-validate --fix --palette "#be2edd,#3b82f6,#f59e0b,#1a1a1a,#e0e0e0,#9b1fb8"`.

## Image generation style

Model: **imagen** (text-to-image), with **no reference images** --- the house
style lives entirely in the prompt suffix below. Keep it that way: shared
references would cross-contaminate this site's decks with the llms-unplugged
house style.

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

## Publishing and the atproto state file

After any push that adds or edits a published post, the deploy workflow syncs
the post to the atproto network and pushes a follow-up
`[skip ci] update atproto state` commit, so the remote moves on its own shortly
after you push.

- Always `git pull --rebase` before doing more work once you've pushed a post;
  your local `main` will be behind by that bot commit.
- Never force-push `main`. The bot commits frequently, so even
  `--force-with-lease` can clobber its commit if your local tracking ref is
  stale. If a push is rejected, fetch and rebase rather than forcing.
- `atproto-state.json` and `atproto-syndication.json` are generated --- don't
  hand-edit them. Deleting the state file forces a full record backfill on the
  next run (safe: the separate syndication ledger stops posts being re-announced
  to Bluesky).
- `atproto-recommendations.json` IS hand-edited (the exception): it lists the
  documents this publication endorses, and removing a line retracts the
  recommendation (see `scripts/lib/recommendations.ts`).
- `src/assets/publication-icon.png` is the publication's icon blob source,
  rendered from `public/favicon.svg` at 512x512 via sharp; regenerate it if the
  favicon changes.

## Design context

Users, brand personality, anti-references and design principles live in
`PRODUCT.md`. Dark-only, content-forward with minimal decoration; the purple
`#be2edd` brand colour and the asymmetric border-radius motif (`4px 0 4px 4px`)
are established and should be preserved.
