---
id: TASK-001
title: "Blog post: perceptron apparatus animated SVG inference walkthrough"
status: In Progress
assignee: []
created_date: "2026-03-19"
updated_date: "2026-03-18 23:33"
labels:
  - blog
  - perceptron-apparatus
  - svelte
  - svg
dependencies: []
references:
  - ~/projects/perceptron_apparatus/js/src/index.ts
  - ~/projects/perceptron_apparatus/js/src/widgets/animator.ts
  - ~/projects/perceptron_apparatus/js/src/widgets/weights.ts
  - ~/projects/perceptron_apparatus/js/src/training/model.ts
  - ~/projects/perceptron_apparatus/js/src/board.ts
  - ~/projects/perceptron_apparatus/docs/mnist-mlp.md
  - ~/projects/benswift-me/blog/2025/12/11/neon-perceptron-digital-twin.mdx
  - ~/projects/benswift-me/blog/2026/03/03/mini-neon-perceptron-xor-edition.mdx
  - ~/projects/benswift-me/src/components/svelte/NeonPerceptron.svelte
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->

Write a new MDX blog post at
`blog/2026/03/19/perceptron-apparatus-inference.mdx` (or similar slug) that
explains how the physical perceptron apparatus can be used to perform model
inference from a trained MLP, using an interactive SVG widget embedded in the
post.

## Context

The [perceptron apparatus](~/projects/perceptron_apparatus) is a 1.2m diameter
circular wooden table that works as a slide rule for neural net calculations. It
implements a 36→6→10 MLP architecture for MNIST digit recognition. The Elixir
project generates SVGs of the apparatus and exports trained weights to JSON.

There are two existing blog posts about the _neon perceptron_ (a separate but
related project using Three.js 3D visualisations):

- `/blog/2025/12/11/neon-perceptron-digital-twin.mdx` --- full 5×5 version
- `/blog/2026/03/03/mini-neon-perceptron-xor-edition.mdx` --- mini XOR version

This new post is about the _wooden apparatus_ specifically, and should use 2D
SVG-based widgets rather than Three.js 3D scenes.

## Existing JS package --- use this, don't rebuild

The `perceptron-apparatus` npm package (`~/projects/perceptron_apparatus/js/`)
already provides almost everything needed:

- **`PerceptronApparatus` class** (`src/index.ts`) --- renders the full board
  SVG into a container element, with methods to animate sliders (`setSlider`,
  `setSliders`) and rotate the log ring (`setLogRingRotation`)
- **`ComputationAnimator`** (`src/widgets/animator.ts`) --- step-by-step forward
  pass animation that sets inputs, multiplies via the log ring, accumulates into
  hidden/output sliders, with `onStep` progress callbacks and abort support
- **`mnistWeights`** (`src/widgets/weights.ts`) --- pre-trained MNIST weights
  already embedded as TypeScript constants (no JSON loading needed)
- **`MLP` class** (`src/training/model.ts`) --- `forward()` implementing the
  36→6→10 architecture with ReLU
- **Math primitives** (`src/training/math.ts`) --- matMul, relu, etc.
- **Board rendering** (`src/board.ts`, `src/radial-ring.ts`,
  `src/azimuthal-ring.ts`, `src/rule-ring.ts`) --- full SVG generation with data
  attributes for slider targeting

If new features are needed (e.g. coarser step granularity, simplified board
config for blog use), add them to the `perceptron-apparatus` package rather than
reimplementing in benswift-me.

## Post concept

The post walks through how to perform inference on the apparatus step by step,
using an interactive SVG diagram that animates the process. The tone should
connect to the "Museum of the Future" framing --- this is a device from a
post-digital world where the knowledge to build computers has been lost, so
people use this analogue apparatus instead.

## Single Svelte component: `ApparatusInference.svelte`

One Svelte 5 component in `src/components/svelte/` that wraps the existing
package:

1. **Mount** --- create a `<div>`, instantiate `PerceptronApparatus` with
   appropriate `BoardConfig`
2. **Wire up `ComputationAnimator`** with `mnistWeights` and `mode: "step"`
3. **Digit picker** --- a small 6×6 grid showing a few sample MNIST digits (from
   the package's sample data or hardcoded). Clicking one loads it as input.
4. **Stepper controls** --- play / pause / step / reset buttons that drive the
   `ComputationAnimator`
5. **Step readout** --- text display showing current phase and description from
   the `onStep` callback
6. **Prediction display** --- highlight the winning output when inference
   completes

Use `client:only="svelte"` in MDX (same pattern as existing perceptron posts).
Gruvbox-inspired colour palette to match the site theme.

### Granularity concern

The full step-by-step mode does 276 individual slider animations (36×6 + 6×10).
Consider:

- Adding a coarser "per-neuron" step mode to the `ComputationAnimator` in the
  apparatus package (animate one hidden/output neuron at a time rather than each
  multiply)
- Providing both "detailed" and "overview" playback speeds
- A "skip to result" button that runs `mode: "fast"`

### Performance concern

The apparatus SVG is large (hundreds of elements). Consider whether a simpler
`BoardConfig` (fewer tick marks, smaller size) works better for the blog
context, especially on mobile.

## Dependency wiring

Link the package locally:

```json
"perceptron-apparatus": "file:../perceptron_apparatus/js"
```

in benswift-me's `package.json`. No npm publish needed.

## Post structure (prose)

1. Introduction --- what is the perceptron apparatus, the Museum of the Future
   framing
2. The architecture --- 36 inputs (6×6 downsampled MNIST), 6 hidden neurons, 10
   outputs
3. Interactive walkthrough --- embedded widget showing the inference process
4. The slide rule trick --- explain in prose how multiplication works on the
   apparatus (no separate widget needed for v1)
5. Why this matters --- making computation visible, the defamiliarisation angle
6. Link to existing neon perceptron blog posts for the digital/3D version

## Key files

- `~/projects/perceptron_apparatus/js/src/index.ts` --- PerceptronApparatus
  class
- `~/projects/perceptron_apparatus/js/src/widgets/animator.ts` ---
  ComputationAnimator
- `~/projects/perceptron_apparatus/js/src/widgets/weights.ts` --- mnistWeights
- `~/projects/perceptron_apparatus/js/src/training/model.ts` --- MLP forward
  pass
- `~/projects/perceptron_apparatus/js/src/board.ts` --- SVG board rendering
- `~/projects/perceptron_apparatus/docs/mnist-mlp.md` --- full architecture docs
- `~/projects/benswift-me/blog/2025/12/11/neon-perceptron-digital-twin.mdx` ---
  reference post
- `~/projects/benswift-me/blog/2026/03/03/mini-neon-perceptron-xor-edition.mdx`
  --- reference post
- `~/projects/benswift-me/src/components/svelte/NeonPerceptron.svelte` ---
reference for component pattern
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

<!-- AC:BEGIN -->

- [ ] #1 New MDX blog post exists at an appropriate path under blog/2026/
- [ ] #2 One interactive Svelte component wrapping `PerceptronApparatus` +
      `ComputationAnimator` from the `perceptron-apparatus` package
- [ ] #3 Widget uses real trained weights (`mnistWeights` from the package)
- [ ] #4 Post explains the apparatus architecture and step-by-step inference
      algorithm
- [ ] #5 Forward pass produces correct outputs (verified against MLP.forward()
      from the package)
- [ ] #6 No duplicated forward pass / weights / geometry code in benswift-me ---
      all shared logic lives in the `perceptron-apparatus` package
- [ ] #7 Post links to existing neon perceptron blog posts for context
- [ ] #8 Post builds and renders correctly in the Astro site (`pnpm build`
      passes)
- [ ] #9 `perceptron-apparatus` package linked as a local file dependency in
    benswift-me
<!-- AC:END -->
