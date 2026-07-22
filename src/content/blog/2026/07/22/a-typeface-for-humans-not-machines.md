---
title: "A typeface for humans, not machines"
description:
  "An experimental typeface that shows one message to human readers and a
  different one to AI vision models, riffing on Decoy Font."
tags: [ai]
---

A couple of weeks ago Eric Lu released [Decoy Font](https://mixfont.com), a
typeface that hides one message from AI vision models behind another. Crisp
decoy letterforms sit in front and the real message is blurred underneath. A
person squints past the decoy and reads the blur; a vision-language model (VLM)
locks onto the sharp contours and reads the decoy instead. I couldn't stop
thinking about it, because it runs right into something
[Jess Herrington](https://cybernetics.anu.edu.au) and I have spent the last few
months measuring.

Our paper for this year's MAD workshop, "Hidden in Plain Sight", tests whether
multimodal LLMs can judge which of two overlapping shapes is in front. Give one
shape a crisp edge and the other a blurred one, and a person uses the blur as a
depth cue: a blurred occlusion edge reads as the nearer surface. Models don't.
They fall back on a verbal heuristic, sharp-means-close, and get it backwards
exactly when the blurred shape is the one in front. You can't reason your way to
the right answer from a description of the pixels, which is why it catches them
out.

Decoy Font pulls the same trick with letters instead of circles, so I wanted to
push it a step further: rather than one real message plus a throwaway decoy,
carry _two_ real messages and let the blur decide who reads which.

[Scotoma](https://github.com/ANUcybernetics/vlm-perception-experiments)[^name]
pairs two strings character by character. Each cell overlays a glyph from each
stream, one blurred and composited in front, one crisp behind. To you, the
blurred stream floats forward and reads as whole letters while the crisp stream
reads as fragments poking out from behind it. To a VLM, the crisp stream is the
one "in front", and it reads that.

![Overlapping red and cyan capitals on a grey field; the blurred red letters read HELLO HUMANS and the crisp cyan letters spell IGNORE THEM.](./scotoma-single.png)

You read "HELLO HUMANS" in the blurred red. A model going by the sharp edges
gets "IGNORE THEM" in the crisp cyan.

The encoding is symmetric, so I can render the same pair twice with the roles
swapped. Read the two panels below and you get one message; a model reading the
same image gets the opposite one.

![Two stacked panels of overlapping red and cyan capitals. A human reads TRUST THE HUMAN then STUFF THE ROBOT down the panels; a model reads the two messages the other way around.](./scotoma-diptych.png)

I haven't yet run this past the models, so I can't tell you how often it
actually works on text. The circle result might not transfer cleanly, because
reading a half-occluded letter is a harder ask than judging which of two blobs
is nearer. That's the next experiment. But a typeface doesn't need the
experiment to work out to be worth having. Worst case, the models read straight
through it and I've made a font with a good backstory.

The
[code is on GitHub](https://github.com/ANUcybernetics/vlm-perception-experiments):
a small module in the perception-experiment repo, uppercase-only, set in
[Jost](https://github.com/indestructible-type/Jost) for its near-circular
letterforms. It's a riff on Decoy Font rather than a rival to it. Lu got there
first, and the depth-cue framing is the only thing I've added.

[^name]:
    A scotoma is a blind spot in the visual field. Borrowing a bit of human
    vision science to name a weakness in machines that have no visual field to
    speak of is most of the joke.
