---
title: "Extempore's aliiiiive on aarch64"
tags: ["extempore"]
---

If you're on the [extempore](https://github.com/digego/extempore) mailing list
you'll have seen the chatter over the last year or so about how development has
(sortof) stalled due to the "core team" ([@digego](https://github.com/digego)
and [@me](https://github.com/benswift), but calling it a "core team" makes it
sound more grown-up) having other committments these days and not so much time
to hack on it.

Well, a recent (much appreciated!)
[drive-by PR](https://github.com/digego/extempore/pull/415) got me thinking...
how much work would it _actually_ be to get it working properly on aarch64. This
has been the main thing weighing me down for a while; I'm still doing the
occasional livecoding gig using an old intel build (via rosetta 2) but that's
being
[phased out](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment).

So I had a reasonably free afternoon yesterday and pulled down that branch
(thanks [@soulofmischief](https://github.com/soulofmischief)). It built straight
away (yay!) but couldn't actually compile/run xtlang code. And there was some
futzing with the build setup required, and a few external lib updates, and other
general gardening tasks.

By the end of yesterday I had:

- extempore building & the full "audio" suite of libraries working correctly
  (including AOT-compilation) on both macOS aarch and Linux x64
- made headway on updating the build & test GitHub Actions workflows (still not
  properly working yet, though)
- streamlined a few aspects of the build process (not related to the aarch64
  port specifically, just 'axe sharpening' stuff while I was working on it)

It all works on my M3 MBP and my x64 Linux box. I haven't got easy access to a
Windows machine these days so I'm relying on the (very indirect and frustrating)
GitHub windows runners to do my debugging there. So that's something that'll
need to be done before this can ever land on the main branch.

I also didn't touch the graphics stuff; some of it might Just Work^TM although I
suspect not. And graphics is a big support burden (esp. since extempore is all
OpenGL) so I think I'm reconsidering whether we even include that stuff in the
"core distribution" anymore, or just leave it as libraries that might/might not
work depending on your platform.

But it wasn't _too_ bad, and I feel positive that it's do-able without an
unreasonable amount of engineering effort. One other problem is that I'm going
away for a month in Dec/Jan, so I don't think this branch will be tested & ready
before then. But if any extempore users out there want to pull down & compile
the [aarch64 branch](https://github.com/digego/extempore/tree/aarch64) and give
me feedback (either via GH or on the extempore mailing list) then that'd be much
appreciated.
