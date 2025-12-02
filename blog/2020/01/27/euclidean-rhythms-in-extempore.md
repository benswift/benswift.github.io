---
title: "Euclidean rhythms in Extempore"
tags:
  - extempore
---

# Euclidean rhythms in Extempore




As part of the new Extempore pattern language stuff I added a helper for
generating [euclidean rhythms](https://en.wikipedia.org/wiki/Euclidean_rhythm).
I wrote it (in a recursive style) in Scheme using the algorithm described in
[Godfried
Toussaint's](https://cgm.cs.mcgill.ca/~godfried/publications/banff-extended.pdf)
paper (although it's credited to _Bjorklund_).

As well as the obvious musical possibilities, one of the things I noticed when I
was playing around that if one loops through euclidean rhythms of increasing
"density" the _visual representation_ exhibits some cool patterns as well.
Here's an example of the 17 different rhythms of length 16 (from 0 to 16
inclusive). We can print out the patterns using this loop (using `'X` for the
"hit" marker so that it looks more prominent in a log view).

```xtlang
(dotimes (i 17)
  (println (euclid i 16 'X)))
```

What gets printed to the log is:

```text
(_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _)
(X _ _ _ _ _ _ _ _ _ _ _ _ _ _ _)
(X _ _ _ _ _ _ _ X _ _ _ _ _ _ _)
(X _ _ _ _ _ X _ _ _ _ X _ _ _ _)
(X _ _ _ X _ _ _ X _ _ _ X _ _ _)
(X _ _ _ X _ _ X _ _ X _ _ X _ _)
(X _ _ X _ X _ _ X _ _ X _ X _ _)
(X _ _ X _ X _ X _ X _ _ X _ X _)
(X _ X _ X _ X _ X _ X _ X _ X _)
(X _ X X _ X _ X _ X _ X X _ X _)
(X _ X X _ X _ X X _ X X _ X _ X)
(X _ X X X _ X X _ X X _ X X _ X)
(X _ X X X _ X X X _ X X X _ X X)
(X _ X X X X X _ X X X X _ X X X)
(X _ X X X X X X X _ X X X X X X)
(X _ X X X X X X X X X X X X X X)
(X X X X X X X X X X X X X X X X)
```

Look, there's probably some super-cool mathematical explanation for why this
looks like that. Stephen Wolfram, if you're reading, drop me a line and tell me
what it is. But I just thought it looked cool---I'm sure there are generative
art possibilities here as well (they may have already been explored).
