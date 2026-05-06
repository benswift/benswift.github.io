---
title: "On Agentic Tools and Lock-in"
description: "A response to Lars Faye's 'Agentic Coding is a Trap': LLMs have the lowest
  vendor lock-in of any tool I've used in 20 years."
tags: [ai]
---

I read Lars Faye's
[Agentic Coding is a Trap](https://larsfaye.com/articles/agentic-coding-is-a-trap)
post this morning. It engages with what I think is the core question around
agentic software development, and especially with how we teach others (and
juniors) to do it effectively. My paraphrase:

> how _necessary_ is the struggle of implementation in delivering good software?

Honestly, I don't think anyone has a precise handle on the answer. My gut feel
is that it's _somewhat_ necessary, in the same way that I'm still teaching my
kids arithmetic even though we have ubiquitous calculating devices. But I also
think that some of the four-Yorkshiremen-style "in my day we walked 15 miles in
the snow, uphill both ways" stuff I read is probably a little overblown.
Although my feeling there is no less based on vibes and experience than the
claim itself.

I do think it's worth making one other point about the
[Vendor Lock-In section](https://larsfaye.com/articles/agentic-coding-is-a-trap#vendor-lock-in)
of the article. Of all the software tools and techniques I've invested
significant time in over my 20-year career as a researcher and developer, LLMs
have some of the lowest lock-in I've ever encountered. Seriously, I was more
locked in to Emacs[^emacs] than I am to Claude (even though I'm quite happy
with Claude at the moment). All the tooling I've built is just md files with
human-readable instructions in them, and switching to a different coding
harness is, in general, just a file rename away (`mv CLAUDE.md AGENTS.md`).

So while it's a pain when Claude has an outage, if they were really not working
for me I'd let my monthly subscription lapse, and I reckon I'd be just as
productive with a new platform within about one hour (partially because the new
provider's model would help with the migration).

It's not to say that I don't read and nod along with Lars's post. I do, if for
no other reason than that I grieve the loss of the feeling of mastery that
comes with being a code-slinging wizard (something I'm now realising was at
least a little load-bearing for my work identity). But in the scheme of tech
and software dev, LLMs are the first thing in perhaps my whole career that I
think might actually live up to the hype. They also have the least lock-in of
anything I've used (cf Google's famous
[we have no moat and neither does anyone else](https://newsletter.semianalysis.com/p/google-we-have-no-moat-and-neither)
post). And that makes me a little less nervous about diving in.

[^emacs]:
    Although regular readers will note that I
    [broke free of this a year ago](/blog/2026/02/18/ben-s-dev-setup-2026-edition/).
