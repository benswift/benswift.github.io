---
title: "Extempore is alive on aarch64 (part deux)"
tags:
  - extempore
---

A quick update on
[Extempore on aarch64](/blog/2025/12/17/extempore-s-aliiiiive-on-aarch64):

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
  [I'm using these days](/blog/2026/02/18/ben-s-dev-setup-2026-edition))
- there's now
  [a repl](https://github.com/digego/extempore/commit/c76be4d24e3315cc80acb1a244fda6aff7003bce),
  although only on macOS/Linux at the moment
- [upgraded to LLVM 22](https://github.com/digego/extempore/commit/1dcdaf94d1)
  (from 21), which went surprisingly smoothly
- I'm part-way through updating the docs website (bringing it into the
  [`docs/` folder in the main extempore repo](https://github.com/digego/extempore/tree/aarch64/docs))

This is still all on the
[aarch64 branch](https://github.com/digego/extempore/tree/aarch64); I'm not
ready to merge to master just yet. If you're an extempore user and you're
willing to get your hands a little dirty and try build from source on the tip of
that branch and try out your extempore workloads, then I'd appreciate
that---including bug reports of things that don't work.
