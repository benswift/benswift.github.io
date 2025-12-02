---
title: "Student project: animated 3D code rendering engine"
tags:
  - teaching
---

::: tip
I'm trying to get better at writing down potential student project ideas as they
come to me. For the moment, I'm doing this on my blog using the
[`student-project`](https://benswift.me/blog/tag/student-project/) tag.
:::

As a [livecoder](/livecoding/) I care more than most about how my
code looks on the screen. While I've [written in the
past](https://benswift.me/research/#swiftVisualCodeAnnotations2013) about the
potential of animated "tooltip" style code annotations, I'd love to have more
detailed (parametric) control over the display of the code/text itself,
especially in a "handwritten" style. Being able to "write" the code in real-time
in sync with the music in a livecoding setup would look super cool, and I
[^unproven-hypothesis] think that it might even help folks follow what's going
on in terms of which bits of code are responsible for which parts of the music.

[^unproven-hypothesis]: I have no evidence for this... but I'd like to try and get some.

Making this happen would require:

- a handwriting synthesis model (something like [this one by Alex
  Graves](https://github.com/sjvasquez/handwriting-synthesis))

- (optionally) a 3D version (which would give output like
  [this](https://www.youtube.com/watch?v=rA3QZVEfGpc), but automated rather than
  manual)

- a way of applying keyword colouring & other standard code display niceties
  (because it'd be nice to not _lose_ the things that a regular old IDE/text
  editor can do)

- a protocol for a livecoding IDE to communicate (including timing information)
  with this code synthesis engine so that the code would be displayed/drawn (and
  re-drawn) in response to the music in funky ways

...and it'd all have to run in real-time during a performance (although it
needn't be running on the livecoder's machine---as mentioned above it'd ideally
use some sort of [nrepl](https://nrepl.org/nrepl/index.html)-style protocol and
could be done over the network).

If you're an ANU student and you want to do a research project along these lines
with the [c/c/c studio](https://cs.anu.edu.au/code-creativity-culture/), then
[drop me a line](mailto:ben.swift@anu.edu.au).
