---
title: "The annual benswift.me re-write: 2019 edition"
tags:
  - dev
---

# The annual benswift.me re-write: 2019 edition




Welcome, traveller. You've managed to find my blog without being [eaten by a
grue](https://zork.wikia.com/wiki/Grue). If you haven't visited for a while, you
might have noticed that I've re-written my website. [Again](/blog/2017/07/06/benswift-me-update-july-2017-edition).

There are a few reasons:

1. it forces me to keep up to date with web stuff, which I [teach for a
   living](https://cs.anu.edu.au/courses/comp1720/) (students can sniff out a
   fraud)

2. my academic activities don't fit the traditional "list of journal
   publications" shape that my university-provided web presence is geared
   towards

3. if I move to a different institution, I don't have the difficult job of
   exfiltrating my content from my old institution's platform

4. building things is fun (I'm good at this stuff, and it feels good to use the
   skills you've spent years developing)

5. part of being an academic is brand-management, and that's much easier to do
   if you completely control (at least one of) the platforms you're putting your
   message out on

6. I'm a control-freak, and the idea of _not_ being in control bums me out (this
   is the pernicious flip side of #5)

Some of these are good reasons, some not-so-good. For a fun party game, [argue
with me on twitter](https://twitter.com/benswift) about which is which 😉

## The nitty-gritty technical stuff

I've (once again) gone with a [Jekyll](https://jekyllrb.com/)-powered static
site. This time, though, I've opted for my own lovingly hand-crafted HTML & CSS
rather than one of the out-of-the-box themes. In doing this, I decided on a few
design priorities:

1. _modern_ markup: CSS grid & flexbox **all the way** (sorry if you're on an old
   version of IE)
2. _minimal_ markup: there's really not many elements in each page (I wanted to
   see how far I could push back against the `div` soup that's so common these
   days)
3. _semantic_ markup: we have `nav` and `article` and `main` and `aside`, so
   let's use them

Typography-wise, I used [@rsms](https://twitter.com/rsms)'s new [Inter
UI](https://rsms.me/inter/) font family, and I really like it. I'm not a
designer (as you can probably tell) so I kept it simple---one typeface, one
highlight colour, and then I poke around with
[Sass's](https://www.sass-lang.com) colour manipulation functions to get a _bit_
more variation.

**The verdict**: I was really pleasantly surprised---it came together in about a
day of hard work. Next time around (i.e. now that I know what I'm doing a bit
more) it'd be even easier. I particularly liked using [grid template
areas](https://css-tricks.com/snippets/css/complete-guide-grid/#prop-grid-template-areas)
to draw a little ascii-art diagram of my desired layout. Obviously the layout
for this blog is really boring, but I can imagine this being really handy for
more complex layouts.

If it's broken for you and you're on a modern browser[^ie-shade], then please
[let me know](mailto:ben.swift@anu.edu.au) and I'll try to fix it if I can. I
don't think I've broken any (many) links, but again let me know if you find
something I've missed.

[^ie-shade]: that's my subtle way of throwing shade at IE

The other thing I really like about this iteration of the annual `benswift.me`
redesign is that I finally understand the whole thing. No more magic themes
which I hesitantly poke around in "eye-of-newt" style whenever I want to make
changes, and that's a nice feeling[^control-freak].

[^control-freak]: especially if you're a control freak

Let me know what you think of my new redesign in the comments. Just
kidding---there are no comments. But do get in touch in some other way (see the
icons at the top for various options).
