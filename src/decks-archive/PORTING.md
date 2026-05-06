# Porting old decks to the ANU theme

These decks were authored against an earlier astromotion (`.deck.md` files) and
a custom purple-themed `theme.css`. They've been moved here to disable their
build until each one is ported individually to the latest astromotion plus the
ANU theme defined in `astro-theme-anu/styles/deck.css`.

## Per-deck porting checklist

For each `<slug>.deck.md` in this directory:

1. Move it to `src/decks/<slug>.deck.mdx` (note the `.mdx` extension)
2. Convert any HTML comments (`<!-- ... -->`) to MDX expression comments
   (`{/* ... */}`)
3. Verify slide separators are blank-line `---` (the Marp/astromotion
   convention)
4. Migrate background images to the `![bg](./assets/...)` syntax if they
   weren't already
5. Drop any deck-specific colour/font CSS that the old purple theme provided
   --- or vendor it into a deck-scoped `<slug>.deck.css` imported at the top of
   the file
6. Re-test render via `pnpm dev` and visit `/decks/<slug>/`
7. If the deck previously had a `/talks/<slug>` redirect, uncomment the
   matching line in `astro.config.ts`

## Redirects pending re-enablement

These were commented out in `astro.config.ts`:

- `/talks/p5-hour-of-code` --- `/decks/p5-hour-of-code/`
- `/talks/designing-the-ccc-studio` --- `/decks/designing-the-ccc-studio/`

## Old theme

`theme.css` in this directory is the previous reveal.js theme (purple
`#be2edd`, Atkinson Hyperlegible). Kept here for reference if any per-deck
overrides need to be salvaged during porting.
