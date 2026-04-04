---
title: "Extempore is alive on aarch64 (part deux)"
description: "CI green on four platforms, a migration from TinyScheme to s7, and a 9x
  compiler speedup from hash table caches and union-find type unification."
tags:
  - extempore
---

A quick update on
[Extempore on aarch64](/blog/2025/12/17/extempore-s-aliiiiive-on-aarch64/):

- [CI is now green](https://github.com/digego/extempore/actions) on macOS,
  Windows, and _two_ Linux architectures (aarch64 and x64)
- OpenGL graphics stuff is (soft) deprecated because that's increasingly tricky
  to maintain and keep up-to-date, but there are
  [a couple of new WebGPU examples](https://github.com/digego/extempore/tree/aarch64/examples/external);
  the
  [shadertoy one](https://github.com/digego/extempore/blob/aarch64/examples/external/shadertoy.xtm)
  is kindof fun (no full "xtmrender" pipeline yet, and not ETA on that
  unfortunately)
- along the way I wrote a
  [tree-sitter grammar](https://github.com/extemporelang/tree-sitter-extempore)
  for extempore (Scheme + xtlang) and some _very_ hacked-together support for
  evaling code in [helix](https://helix-editor.com) (which
  [I'm using these days](/blog/2026/02/18/ben-s-dev-setup-2026-edition/))
- there's now
  [a repl](https://github.com/digego/extempore/commit/c76be4d24e3315cc80acb1a244fda6aff7003bce),
  although only on macOS/Linux at the moment
- [upgraded to LLVM 22](https://github.com/digego/extempore/commit/1dcdaf94d1)
  (from 21), which went surprisingly smoothly
- I'm part-way through updating the docs website (bringing it into the
  [`docs/` folder in the main extempore repo](https://github.com/digego/extempore/tree/aarch64/docs))

## Compiler guts

**NOTE: these compiler & Scheme changes are in a couple of standalone commits
and could be reverted in future... experimental stuff. But fun!**

The biggest under-the-hood change is a
[refactor of the xtlang compiler](https://github.com/digego/extempore/commit/93dacf79)
and a migration from TinyScheme to
[s7 Scheme](https://ccrma.stanford.edu/software/snd/snd/s7.html)---Bill
Schottstaedt's embeddable Scheme interpreter from CCRMA. s7 was originally
forked from TinyScheme anyway, so the migration path was relatively
straightforward, but it's a much more capable interpreter with proper hash
tables, first-class environments, and better performance across the board.

On the compiler side, the old xtlang type checker used assoc-list caches for
everything---which was fine when type environments were small, but scaled poorly
for libraries with heavy generic instantiation. The refactored compiler replaces
those with hash table caches, adds union-find for type unification, and moves to
constraint-based solving.

Here are ahead-of-time compilation benchmarks for all the core and external
audio libraries[^bench-setup]:

| Library                             |     Before |     After |   Speedup |
| ----------------------------------- | ---------: | --------: | --------: |
| `libs/base/base.xtm`                |      5.59s |     3.24s |      1.7x |
| `libs/core/math.xtm`                |     16.57s |     4.04s |      4.1x |
| `libs/core/rational.xtm`            |      6.47s |     3.47s |      1.9x |
| `libs/core/audiobuffer.xtm`         |      7.45s |     3.49s |      2.1x |
| `libs/core/audio_dsp.xtm`           |     32.14s |     5.71s |      5.6x |
| `libs/core/instruments.xtm`         |    109.83s |     8.38s | **13.1x** |
| `libs/external/fft.xtm`             |      5.71s |     3.99s |      1.4x |
| `libs/external/sndfile.xtm`         |      9.17s |     3.64s |      2.5x |
| `libs/external/audio_dsp_ext.xtm`   |      5.51s |     4.28s |      1.3x |
| `libs/external/instruments_ext.xtm` |     12.57s |     9.26s |      1.4x |
| `libs/external/portmidi.xtm`        |      4.86s |     3.35s |      1.5x |
| **Total**                           | **215.9s** | **52.9s** |  **4.1x** |

The headline number is a 4.1x wall-clock speedup, but each invocation includes
~3s of startup overhead (there's a hard-coded `sleep` for NSApp initialisation
because reasons). Subtracting that out, the pure compile time went from ~183s to
~20s---a **9x speedup**.

The standout is `instruments.xtm` at 13.1x; it's a longer file and works the
compiler more than some of the others, which is exactly where the new union-find
and hash table caches pay off. Libraries showing more modest improvements
(1.3--1.5x) are dominated by LLVM JIT time and startup overhead rather than
Scheme-level type checking, so there's not much to squeeze out of those on the
compiler side.

[^bench-setup]:
    Benchmarked on Linux x86_64 (AMD Zen 4) with LLVM 22.1.0 and ORC JIT. Each
    library compiled in a separate `extempore --nobase --batch` process.
    "Before" is commit `44b7b5c5` (TinyScheme, assoc-list caches); "After" is
    commit `93dacf79` (s7 Scheme, hash table caches + union-find + constraint
    solver).

This is still all on the
[aarch64 branch](https://github.com/digego/extempore/tree/aarch64); I'm not
ready to merge to master just yet. If you're an extempore user and you're
willing to get your hands a little dirty and try build from source on the tip of
that branch and try out your extempore workloads, then I'd appreciate
that---including bug reports of things that don't work.
