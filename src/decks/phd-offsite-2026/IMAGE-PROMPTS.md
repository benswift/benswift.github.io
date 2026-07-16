# Optional decorative backgrounds

The divider slides (title, per-student, section breaks) are intentionally
text-only: white title bottom-left with a purple underline on the dark theme, no
image needed. They look clean as-is.

If you want to dress them up in the house style, generate a background per
divider with **imagen** (no reference images --- the style lives in the prompt
suffix) and drop it onto the divider slide as the first line of that section:

```mdx
{/* _class: hero seg seg-evan */}

![bg](./assets/bg/divider-evan.avif)

# Evan Skinner
```

Save as `./assets/bg/divider-<id>.avif`, `16:9`. The `hero` class already lays a
dark gradient scrim over the image, so the white title stays legible.

## Prompt suffix (house style --- keep intact)

> drawn with a few confident scratchy pen strokes in white ink only, plus
> exactly one loose splash of gold-amber watercolour, on an entirely matte black
> field. The ONLY colours in the image are black, white, and gold-amber --- no
> red, no blue, no other hues. Maximal black negative space, spontaneous and
> deliberately unfinished, the hand of the artist visible in every stroke.
> Full-bleed edge-to-edge composition --- no border, no frame, no mat. No human
> figures or hands. STRICTLY NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS, NO
> GLYPHS anywhere in the image.

## Per-divider subjects (a visual metaphor, not a literal diagram)

Only the students who've sent slides have a confirmed topic; the rest are
guesses from their field --- reword freely, or skip.

- **title** --- a loose cluster of small orbiting marks settling into a loose
  ring, one gold splash off-centre (a cohort coming together)
- **evan** (cybernetic governance) --- a single feedback loop drawn as one
  continuous confident stroke, a gold node where it closes
- **jake** (cybernetic approaches to law reform) --- a pair of scales redrawn as
  a balance of two looping curves, one gold pan
- **liz** (systemic leadership in polycrises) --- many tangled strokes
  converging toward one steady gold thread pulling through
- **sui** (homeostat) --- four coupled needles seeking equilibrium, one gold
- **nadereh** (transformative learning in creativity) --- a plain form unfolding
  into a more open one, a gold splash at the moment of change
- **section breaks** (morning tea / lunch / wrap) --- a single empty vessel or a
  low horizon line, one small gold mark; keep these especially sparse

For the twelve students still to send slides, add a subject line here as their
topic firms up, then regenerate.
