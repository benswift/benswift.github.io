---
title: benswift.me dev roadmap for 2020
tags: meta web
---

As a developer of web tech curricula (specifically 2D graphics & interaction
design in [COMP1720](https://cs.anu.edu.au/courses/comp1720/)) there's always a
tension in trying to just teach the fundamentals and keeping the coursework
up-to-date. For the latter, that doesn't necessarily mean re-writing the course
each year with the js framework-du-jour, but it's useful to at least know what
the best practices are and how to point students in a good direction if they
want to go deeper.

I try and use this website as a bit of a test-bed for [trying new
things](https://benswift.me/blog/tag/meta/) and staying up to date. So, here's
my list of things to try in 2020:

- update to Jekyll 4 (currently, it's the
  ~~`jekyll-assets`~~`jekyll-paginate-v2` plugin that's [blocking the
  update](https://github.com/sverrirs/jekyll-paginate-v2/issues/165))

- **or** move this blog from Jekyll to [Eleventy](https://www.11ty.io) (because
  all the cool kids are on the [JAMstack](https://jamstack.org) these days)

- switch to [Netlify](https://www.netlify.com) for hosting so that I can use
  their nice workflow stuff (e.g. serverless functions)

- package up my [reveal slides]({{site.baseurl}}{% link
  _posts/2018-09-28-another-reveal.js-plugin-for-jekyll.md %}) plugin on npm (if
  I switch to Eleventy) or RubyGems (if I stay with Jekyll) so that others can
  use them

- (maybe) re-write the CSS (from the current hand-rolled Sass) to something
  using a utility class framework like [Tailwind](https://tailwindcss.com)

There's no timeline on any of this, and I'm going to be busy with other things
(e.g. my [Reimagine Fellowship]({{site.baseurl}}{% link
_posts/2019-03-20-reimagine-fellow-project-pitch.md %}), updating the
[Extempore](https://github.com/digego/extempore) docs and generally [doing good
research]({{site.baseurl}}{% link research.md %})).
