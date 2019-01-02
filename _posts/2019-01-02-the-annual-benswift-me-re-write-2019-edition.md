---
layout: post
title: 'The annual benswift.me re-write: 2019 edition'
date: 2019-01-02 17:46
---

Welcome, traveller. You've managed to find my blog without being [eaten by a
grue](http://zork.wikia.com/wiki/Grue)---nice one.

I've re-written my blog [again]({{site.baseurl}}{% link
_posts/2017-07-06-benswift-me-update-july-2017-edition.md %}), because I figure
it's a good way for me to keep up to date with my web skills. Given that I teach
[web stuff](https://cs.anu.edu.au/courses/comp1720/) and that students can sniff
out a fraud if you're behind the times, I figure it's the least that I can do.

I've (once again) gone with a [Jekyll](https://jekyllrb.com/)-powered static
site. This time, though, I've opted for my own lovingly hand-crafted HTML & CSS
rather than one of the out-of-the-box themes. In doing this, I decided on a few
design priorities:

1. *modern* markup: CSS grid & flexbox **all the way** (sorry if you're on an old
   version of IE)
2. *minimal* markup: there's really not many elements in each page (I wanted to
   see how far I could push back against the `div` soup that's so common these
   days)
3. *semantic* markup: we have `nav` and `article` and `main` and `aside`, so
   let's use them
   
**The verdict**: I was really pleasantly surprised---it came together in about a
day of hard work. Next time around (i.e. now that I know what I'm doing a bit
more) it'd be even easier. I particularly liked using [grid template
areas](https://css-tricks.com/snippets/css/complete-guide-grid/#prop-grid-template-areas)
to draw a little ascii-art diagram of my desired layout. Obviously the layout
for this blog is really boring, but I can imagine this being really handy for
more complex layouts.

If it's broken for you and you're on a modern-ish browser, then please [let me
know](mailto:ben.swift@anu.edu.au) and I'll try to fix it if I can. I don't
think I've broken any (many) links, but again let me know if you find something
I've missed.

Let me know what you think of my new redesign in the comments. Just
kidding---there are no comments. But do get in touch in other way (see the icons
at the top for various options).
