---
title: "Even faster xtlang compile times"
description:
  "More xtlang compiler work, plus deleting a 3s startup sleep, takes AOT
  compilation of Extempore's audio libraries from 216s to 13.6s."
tags:
  - extempore
---

In
[part deux of the aarch64 update](/blog/2026/02/26/extempore-is-alive-on-aarch64-part-deux/)
I posted ahead-of-time compilation benchmarks for the refactored xtlang
compiler. There's been more compiler work since then. Type solving was cubic in
a function's size, and closures with lots of captured variables (or deeply
nested `let`s) were quadratic; both are now fixed, which helps most on the big
instrument libraries.

The other change was deleting a `sleep`. Every Extempore Scheme process slept
for 3 seconds at startup (a leftover from an old macOS NSApp workaround), which
was most of the time it took to compile a small library. Removing it exposed a
race in how Scheme processes in the same Extempore talk to each other: those
calls went over a TCP connection back to the same Extempore, and a reply sent in
the first couple of seconds was dropped. In-process IPC now goes straight onto
the other process's task queue, and `extempore --nobase` starts in about 20ms.

Same machine and method as last time[^bench-setup]:

| Library                         |     Before |  Feb 2026 |       Now |   Speedup |
| ------------------------------- | ---------: | --------: | --------: | --------: |
| `libs/base/base.xtm`            |      5.59s |     3.24s |     0.15s |     37.3x |
| `libs/core/math.xtm`            |     16.57s |     4.04s |     0.64s |     25.9x |
| `libs/core/rational.xtm`        |      6.47s |     3.47s |     0.34s |     19.0x |
| `libs/core/audiobuffer.xtm`     |      7.45s |     3.49s |     0.44s |     16.9x |
| `libs/core/audio_dsp.xtm`       |     32.14s |     5.71s |     2.04s |     15.8x |
| `libs/core/instruments.xtm`     |    109.83s |     8.38s |     3.24s |     33.9x |
| `libs/core/fft.xtm`             |      5.71s |     3.99s |     0.67s |      8.5x |
| `libs/core/audiofile.xtm`       |      9.17s |     3.64s |     0.26s |     35.3x |
| `libs/core/audio_dsp_ext.xtm`   |      5.51s |     4.28s |     1.00s |      5.5x |
| `libs/core/instruments_ext.xtm` |     12.57s |     9.26s |     3.76s |      3.3x |
| `libs/external/portmidi.xtm`    |      4.86s |     3.35s |     1.03s |      4.7x |
| **Total**                       | **215.9s** | **52.9s** | **13.6s** | **15.9x** |

That's 15.9x on wall-clock time. With the 3s startup sleep subtracted from the
earlier columns (and ~20ms per invocation from "Now"), pure compile time went
from ~183s before to ~20s in February and 13.4s now --- a 13.7x speedup overall.

[^bench-setup]:
    Linux x86_64 (AMD Threadripper 7960X, Zen 4), LLVM 22.1.8, each library
    compiled in a separate `extempore --nobase --batch` process; "Now" is commit
    `5811fd81` on `master` (median of five runs). "Before" (`44b7b5c5`) and "Feb
    2026" (`93dacf79`) are the numbers from the previous post. Four libraries
    have moved from `libs/external/` into `libs/core/` (`fft.xtm`,
    `audiofile.xtm`, `audio_dsp_ext.xtm` and `instruments_ext.xtm`), and a few
    rows aren't quite like-for-like: `sndfile.xtm` has been replaced by pure
    xtlang WAV/AIFF handling in `audiofile.xtm` (and `fft.xtm` no longer wraps
    KissFFT), `audiobuffer.xtm` has shrunk, and `portmidi.xtm` now loads more
    code than it used to.
