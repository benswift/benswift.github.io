# Divider backgrounds

The divider slides carry house-style backgrounds in `./assets/bg/`, generated
with `styled-image-gen --model imagen` (Imagen 4 Ultra, no reference images ---
the style lives entirely in the prompt suffix). The `hero` class lays a dark
gradient scrim over the image, so the white title stays legible bottom-left.

Wired up so far:

| file                   | used by                                 | subject                                                   |
| ---------------------- | --------------------------------------- | --------------------------------------------------------- |
| `divider-title.avif`   | title slide                             | orbiting marks drifting into a loose ring                 |
| `divider-evan.avif`    | Evan Skinner                            | one continuous feedback loop, gold node where it closes   |
| `divider-jake.avif`    | Jake Blight                             | a rigid lattice, one loose stroke re-routing through it   |
| `divider-liz.avif`     | Liz Skelton                             | a tangle resolving into one steady gold thread            |
| `divider-sui.avif`     | Sui Jackson                             | four coupled needles seeking equilibrium                  |
| `divider-nadereh.avif` | Nadereh Ghelich Khani                   | a bud unfurling, gold splash at the moment of opening     |
| `divider-amy.avif`     | Amy Wardrop                             | a meandering river from above, gold splash at an oxbow    |
| `divider-skills.avif`  | skills session                          | an open folder spilling threads into neat parallel lines  |
| `divider-break.avif`   | morning tea, short break, afternoon tea | a single cup, one curl of steam (reused across all three) |
| `divider-lunch.avif`   | lunch                                   | a plate and fork, a few loose strokes                     |

## Side panels

The skills-session slides carry portrait panels in `./assets/`, same house style
but 3:4 and no scrim (the text sits in the other 60% of the slide). Same
generator, no reference images:

| file                   | used by                     | subject                                            |
| ---------------------- | --------------------------- | -------------------------------------------------- |
| `skills-lantern.avif`  | how this session works      | a lantern                                          |
| `skills-folder.avif`   | key idea (full-bleed, 3:2)  | a folder                                           |
| `skills-ripples.avif`  | step 1: keep files together | concentric ripples, gold splash off-centre         |
| `skills-cairn.avif`    | step 2: curate `CLAUDE.md`  | a small cairn, gold splash on the topmost stone    |
| `skills-keys.avif`     | step 3: skills              | a ring of three keys, one gold --- reuse elsewhere |
| `skills-seedling.avif` | closing thoughts            | a seedling breaking ground beside a gold sun       |

Panels need two extra clauses on top of the divider suffix --- the model
otherwise fills half the frame with a densely rendered subject, or resolves
paper and cards as solid white:

> The subject is small and sits low in the frame, surrounded by vast empty black
> negative space; white appears only as thin scratchy ink lines, never as a
> filled or solid white area.

Substitute those for the divider suffix's "lower-left third left open" clause,
which only matters where a hero title has to sit over the image.

## Regenerating / adding one

```bash
styled-image-gen "<subject>, $SUFFIX" --model imagen --aspect-ratio 16:9 \
  --resolution 2K --output-dir /tmp/gen --output-filename divider-<id>
# then downscale (the 2K output is bigger than the 1280x720 canvas needs):
convert /tmp/gen/divider-<id>.avif -resize 1920x /tmp/x.png
avifenc -q 58 -s 6 /tmp/x.png ./assets/bg/divider-<id>.avif
```

Reference it as the first line of the divider slide:

```mdx
{/* _class: hero seg seg-evan */}

![bg](./assets/bg/divider-evan.avif)

# Evan Skinner
```

## Prompt suffix (house style --- keep intact)

> drawn with a few confident scratchy pen strokes in white ink only, plus
> exactly one loose splash of gold-amber watercolour, on an entirely matte black
> field. The ONLY colours in the image are black, white, and gold-amber --- no
> red, no blue, no other hues. Maximal black negative space, the lower-left
> third left open and empty, spontaneous and deliberately unfinished, the hand
> of the artist visible in every stroke. Full-bleed edge-to-edge composition ---
> no border, no frame, no mat, the black field extends to every edge. No human
> figures or hands. STRICTLY NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS, NO
> NUMERALS, NO LABELS, NO SIGNATURES, NO GLYPHS OR SYMBOLS RESEMBLING LETTERS OR
> DIGITS anywhere in the image.

The "lower-left third left open" clause is this deck's addition --- hero titles
sit bottom-left, so the composition has to leave them room.

## Still to do

The twelve presenters who hadn't sent slides have text-only dividers (which look
fine on their own). Once their topics firm up, add a subject line below and
generate: Tom Chan, Bek Conroy, Matthew Heffernan, Bill McAlister, Dominika
Janus, Charlie Paulk, Joshua Castle, Thomas Griffiths, Gareth Jones, Thomas
McEvoy Zafiropulos, Zhuotao Fang.

Keep the subject tangential --- a visual metaphor, not a literal diagram of the
research. The style thrives on economy: one subject, a few strokes, one gold
splash. Expect to re-roll; the first pass at Jake's came back as an ornate,
literal pair of scales before being reworded into the lattice.
