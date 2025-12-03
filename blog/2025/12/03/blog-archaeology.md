---
title: "Blog archaeology"
tags: [meta]
---

After the
[recent switch to VitePress](/blog/2025/12/02/switching-from-jekyll-to-vitepress/),
I became curious about how many of the previous iterations I still had access
to. I've been an obsessive git packrat for _years_, and I figured that there'd
be some secrets in the git repo. So I went spelunking in the history.

What I found was more extensive than I expected. The repository I'm currently
working
in---[benswift.github.io](https://github.com/benswift/benswift.github.io)---turned
out to be just one chapter in a longer story. A bit more digging on GitHub
revealed earlier chapters I'd forgotten about.

## The Octopress era (2012)

The earliest archaeological evidence dates back to August 2012: a fork of
[imathis/octopress](https://github.com/imathis/octopress) that I used for a few
months. The
[first commit](https://github.com/benswift/octopress/commit/8dc0cb0b4b0de3c6f40674198cb2bd44aeee9b86)
was on 20 August 2012, and the
[last one](https://github.com/benswift/octopress/commit/b317c23438fe4ad8a271e19312b04ca82e901159)
I can find is from 8 November that year. This version used Ubuntu fonts and had
a custom GitHub sidebar.

But here's what I find most interesting: the commit messages mention "new
'detached' octopress/org blogging works"---apparently I was already integrating
[org-mode](https://orgmode.org) with my blogging setup back then.[^org-mode]

[^org-mode]:
    I've had an on-again, off-again relationship with org-mode for over a
    decade. The evidence suggests the relationship started earlier than I
    remembered. There's even a
    [post about mapping over table rows in org-mode](/blog/2019/03/09/mapping-over-table-rows-in-org-mode/)
    from 2019, and one about
    [configuring Spacemacs with org-roam and org-noter](/blog/2020/12/16/configuring-spacemacs-org-roam-org-noter-for-academic-writing-bliss/)
    from 2020.

## The Clojure experiments (2013-2017)

Then came what I'm now calling "the Clojure years".

First up: November-December 2013. I forked
[nakkaya/static](https://github.com/nakkaya/static), a Clojure-based static site
generator.
[Created on 28 November](https://github.com/benswift/static/commit/b0f10b6dbcb2996caf97acd5d4eb82c0a1b75acc),
[last commit on 4 December](https://github.com/benswift/static/commit/387b093fb1899ac0e4c839cdee0603d5c4184f8d).
One week. I was clearly keen to try something new, but went back to something
more mainstream.

But I wasn't done with Clojure. In December 2014, while simultaneously running
Jekyll (more on that in a moment), I created a separate repository called
"biott"[^biott]---built on
[Cryogen](https://github.com/cryogen-project/cryogen), another Clojure-based
static site generator. This one stuck around longer, with commits running from
[December 2014](https://github.com/benswift/biott/commit/f844154c74681e14cdb8e7f9f1a439345f23a76c)
to
[January 2017](https://github.com/benswift/biott/commit/c31767fa17bd1e2a6b8a11c902293dca62443132).
It used [Cutestrap](https://www.cutestrap.com) for CSS, which tells you
something about mid-2010s web aesthetic sensibilities.[^cutestrap]

[^biott]: "Ben is On The Tubes". Obviously.
[^cutestrap]:
    Cutestrap described itself as "A sassy, opinionated CSS Framework. A tiny
    alternative to Bootstrap." The repo is now archived. RIP.

The [biott repository](https://github.com/benswift/biott) is now marked as
DEPRECATED, with a note pointing to benswift.github.io. So at some point I
consolidated back to Jekyll. But here's the weird part: the timelines overlap.
Biott was active from 2014-2017, but Jekyll was _also_ active during that
period. Was I running two blogs in parallel? Trying to migrate? Maintaining
separate personal and professional sites? The git history doesn't say, and I
can't remember.

## The Jekyll era begins (2014)

Meanwhile, back in the main benswift.github.io repository, the first
commit---[`2519a6176`](https://github.com/benswift/benswift.github.io/commit/2519a617685205a42994d7c9b3b8c27984fdede2)
from 3 January 2014---is refreshingly simple: "Jekyll new." Straight to the
point. This was the [Lanyon](https://github.com/poole/lanyon) theme era, which I
quickly adapted into something called "Maid".[^maid-theme]
[Redcarpet](https://github.com/vmg/redcarpet) for markdown,
[Pygments](https://pygments.org) for syntax highlighting, and a sidebar that I
spent way too much time tweaking.

[^maid-theme]:
    I have absolutely no memory of why I called it "Maid". The commit messages
    suggest it was a fork of John Otander's theme work, but the naming remains a
    mystery.

But by June 2014, I was already getting restless. On 11 June, commit
[`2fb5cf4e8`](https://github.com/benswift/benswift.github.io/commit/2fb5cf4e8733dbae850231d053e7189264d4a66d)
declared: "Nuke all the things to restart." The next commit? "Nuke even more
things." When you're burning it down, might as well make sure nothing survives.

This ushered in the [Pixyll](https://github.com/johno/pixyll) era, built on
[Basscss](https://github.com/basscss/basscss). The git log shows me tweaking
blockquote styling, adding sticky footers, and adjusting font weights. This
version lasted about four and a half years---through that entire overlapping
biott/Cryogen period---which in blog-framework-years is practically geological
time.

## The big Jekyll restart (2018)

Then came the big one: 30 December 2018, commit
[`c1a4d0225`](https://github.com/benswift/benswift.github.io/commit/c1a4d022534c9cda11d98f23b94f112330c9a783)---"initial
commit of jekyll files". A complete restart, moving to a custom setup based on
[Jekyll's Minima theme](https://github.com/jekyll/minima). Same day, commit
[`eaf35f115`](https://github.com/benswift/benswift.github.io/commit/eaf35f1151f38dd42de232513e6a0a9f73b1880c):
"migrate content from old blog version".[^migration-quotes] This is the setup
that would stick around for six years.

[^migration-quotes]:
    The scare quotes around "migrate" are doing a lot of work here---it was more
    like copying markdown files and hoping for the best.

Looking at the commit statistics, 2019 was wild: 1,405 commits out of roughly
3,500 total. That's 40% of the entire repository's history in a single year.
What was I doing?

Well, everything:

- January 2019: integrating [reveal.js](https://revealjs.com) for slide
  presentations (a feature I've used constantly ever since)
- October 2019: [Jekyll](https://jekyllrb.com) 4.0 upgrade
- December 2019-January 2020: a complete asset pipeline refactor, switching from
  [jekyll-scholar](https://github.com/inukshuk/jekyll-scholar) to
  [bibtex-ruby](https://github.com/inukshuk/bibtex-ruby)
- Custom syntax highlighting for
  [xtlang](https://extemporelang.github.io)[^xtlang]

[^xtlang]:
    The programming language I use for [livecoding](/livecoding/). Every blog
    framework has had to learn to syntax-highlight it.

The reveal.js integration turned out to be the most enduring feature. Every
subsequent version---including the current [VitePress](https://vitepress.dev)
setup---has had to support it. Turns out when you give a lot of talks and teach
a lot of classes, you need slide support _everywhere_.

## The present (2024)

Fast forward to November-December 2024, and I finally pulled the trigger on
[migrating to VitePress](/blog/2025/12/02/switching-from-jekyll-to-vitepress/).
The migration took about two days of intensive work (commits
[`97ae2f706`](https://github.com/benswift/benswift.github.io/commit/97ae2f70661cff49b5700f9054d589b876e5bb7f)
through
[`42a26bd25`](https://github.com/benswift/benswift.github.io/commit/42a26bd25f4e1bdc384eee7f0f2790d87b43b51d)
on 30 November-2 December). The last Jekyll version is preserved at the
[`jekyll` tag](https://github.com/benswift/benswift.github.io/tree/jekyll).
TypeScript instead of Ruby, Vue components instead of Liquid templates, modern
ES6 modules instead of... well, whatever Jekyll was doing with its asset
pipeline.

## What's the point?

So what does this archaeological expedition tell us?

First, the pattern is clear: [Octopress](https://github.com/imathis/octopress) →
Clojure experiments ([static](https://github.com/nakkaya/static),
[Cryogen](https://github.com/cryogen-project/cryogen)) → long
[Jekyll](https://jekyllrb.com) tenure → [VitePress](https://vitepress.dev). The
blog has always been a place to try new things---two separate Clojure attempts,
multiple Jekyll themes, and now a Vue-based system. Each iteration taught me
something.

Second, there's something satisfying about having this entire history preserved.
Every commit tells a story---not just "what changed" but often "why I wanted to
change it". The commit messages are a diary of sorts: technical decisions,
aesthetic tweaks, occasional outbursts of "nuke all the things".

The git packrat habit means I can see exactly when I added that custom CSS for
blockquotes (multiple times, apparently), when I first integrated reveal.js
(September 2018), and how many times I've tweaked the font rendering (too many
to count). It's all there in the log---across multiple repositories, spanning
over a decade.

But here's the thing: the actual _frameworks_ matter less than the content and
the features that support creating it. Octopress, two different Clojure
generators, Jekyll with three different themes, VitePress---they're all just
different ways to serve markdown files with syntax highlighting and
presentations. The reveal.js requirement survived across all of them. The xtlang
syntax highlighting survived. The actual blog posts survived.

So was migrating to VitePress worth it? Yeah. It's faster, the tooling is
better, and I can use modern JavaScript without fighting the framework. But in
six years when I'm "nuking all the things" again, will the next framework be
fundamentally different? Probably not.

As long as I keep committing everything to git, I'll be able to look back and
see exactly when---and why---I decided the blockquote padding needed to be 0.5em
instead of 1em. And honestly, that's kind of beautiful.
