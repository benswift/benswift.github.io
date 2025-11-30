---
title: Jekyll build speedups for Ruby 3.2
tags: web tools
---

There's a [bunch of buzz](https://news.ycombinator.com/item?id=34413012) about
Ruby's new YJIT in v3.2.0. I have to develop and maintain a bunch of Jekyll
websites for work, some of which are getting into "non-trivial build time"
territory (or maybe I'm really easily distracted, but a 30s build is enough for
me to break my flow).

Here's some very unscientifc benchmarks from my [Jekyll](https://jekyllrb.com)
(v4.3) builds on my M1 Max MBP (64GB).

## ruby 3.1.2p20 (2022-04-12 revision 4491bb740a) [arm64-darwin21]

First, this is the previous version of Ruby, which I've been happily working
with for ages.

    bundle exec jekyll build

Averaged over 3 runs, the build time was 17.7 (±0.8) seconds.

## ruby 3.2.0 (2022-12-25 revision a528908271) [arm64-darwin22]

After upgrading to the latest Ruby v3.2.0, the average over 3 runs was 17.2 (±0.2) seconds.

## ruby 3.2.0 (2022-12-25 revision a528908271) +YJIT [arm64-darwin22]

I [followed these
instructions](https://dev.to/dpaluy/install-ruby-320-yjit-with-asdf-b82) to
build a YJIT-enabled Ruby v3.2. Then, after re-installing all the deps:

    RUBY_YJIT_ENABLE=true bundle exec jekyll build

The build was _heaps_ faster---the average over 3 runs was 3.7 (±0.2) seconds.
**That's a 4.8x speedup**.

Obviously, like all benchmarks on the internet this one is wrong & stupid and
you should do your own testing. Three runs probably isn't enough to shake out
any cache effects, and I don't know (but could guess?) that the JIT might have
even more pronounced cold start issues (although I didn't really see it above).
Anyway, if you build a lot of Jekyll sites, my anecdotal evidence is that you
can save yourself a bunch of time, and tighten those feedback loops to stay in
the flow state. Have fun!
