---
title: Another reveal.js plugin for Jekyll
date: "2018-09-28 13:42:26 +1000"
tags: software
---

I use [Jekyll](https://jekyllrb.com/) to create my course websites and
[reveal.js](https://github.com/hakimel/reveal.js/) to create my lecture slides.
Both of them are awesome, and allow me to focus on writing (hopefully) great
content, and the formatting/presentation stuff stays out of the way until I `git
push` the updates to the server.

There are a few ways of making these two tools (Jekyll and reveal.js) play
nicely together: see [here](https://github.com/dploeger/jekyll-revealjs) and
[here](https://medium.com/aerobatic-blog/building-a-reveal-js-presentation-with-jekyll-collections-52bcdba4114a)
for example. However, most of these require you to put each slide in a new `.md`
file, which is a pain.

What I want to do is to write one `.md` file per presentation, and have the
level 1 and level 2 headings (i.e. `#` and `##`) determine the slide splits
(this is pretty much how [pandoc does
it](https://pandoc.org/MANUAL.html#producing-slide-shows-with-pandoc)).

I wrote a simple [Jekyll plugin](https://jekyllrb.com/docs/plugins/) to make
this happen---which has just a couple of moving parts

{:.hl-para}

Because the source for this [whole blog is on
GH](https://github.com/benswift/benswift.github.io/), then you can just head
there and see it for yourself if you're the sort of person who prefers reading
code to prose. Think of this blog post as a "companion piece".

## 0. download the reveal.js source

It's step 0 because it's super easy---just head to
[GitHub](https://github.com/hakimel/reveal.js/releases), download & unzip the
latest release. You can put it wherever you like in your main site folder; I
usually put it in `assets/`.

## 1. the revealify [filter](https://jekyllrb.com/docs/plugins/filters/) {#the-revealify-filter}

First, put this code into a `revealify.rb` file in your Jekyll `_plugins`
directory:

```ruby
{% include symlinks/revealify.rb %}
```

## 2. add a reveal [layout](https://jekyllrb.com/docs/layouts/)

You'll need a new [layout](https://jekyllrb.com/docs/layouts/) as well: create a
`reveal.html` file in your Jekyll `_layouts` directory and make sure that the
body tag has this in it (you'll need to make sure it's got the right paths &
other stuff for your setup). The key part is that first `{% raw %}{{ content |
revealify }}{% endraw %}` line---that takes the content of your page (the jekyll
`.md` file with `layout: reveal` in the frontmatter) and passes it through the
"revealify" filter plugin we [made earlier](#the-revealify-filter).

The configuration stuff here is just the example config from
[reveal.js](https://github.com/hakimel/reveal.js#configuration), so feel free to
tweak to suit your own presentation.

```html
<!-- this is where the reveailfy filter gets applied -->
{% raw %}{{ content | revealify }}{% endraw %}

<!-- load the reveal.js css & js (assuming you've put it in assets/)-->
<link rel="stylesheet" href="{% raw %}{{site.baseurl}}{% endraw %}/assets/reveal.js-3.7.0/css/reveal.css">
<link rel="stylesheet" href="{% raw %}{{site.baseurl}}{% endraw %}/assets/reveal.js-3.7.0/css/theme/white.css">
<script src="{% raw %}{{site.baseurl}}{% endraw %}/assets/reveal.js-3.7.0/js/reveal.js" type="text/javascript"></script>

<!-- configure the presentation, (you can tweak options to suit) -->
<script>
 Reveal.initialize({

   // Display presentation control arrows
   controls: true,

   // Help the user learn the controls by providing hints, for example by
   // bouncing the down arrow when they first encounter a vertical slide
   controlsTutorial: true,

   // Determines where controls appear, "edges" or "bottom-right"
   controlsLayout: 'bottom-right',

   // Visibility rule for backwards navigation arrows; "faded", "hidden"
   // or "visible"
   controlsBackArrows: 'faded',

   // Display a presentation progress bar
   progress: true,

   // Display the page number of the current slide
   slideNumber: false,

   // Push each slide change to the browser history
   history: false,

   // Enable keyboard shortcuts for navigation
   keyboard: true,

   // Enable the slide overview mode
   overview: true,

 });
</script>
```

{:.hl-para}

The full [layout](https://jekyllrb.com/docs/layouts/) file will depend on how
the rest of your site works (where you've put the `reveal.js-x.x.x` folder,
etc.) so I haven't included the full file here (you can [see it on
GitHub](https://github.com/benswift/benswift.github.io/blob/source/_layouts/reveal.html),
though). Also remember that you can see the full list of reveal configuration
options [in the README](https://github.com/hakimel/reveal.js#configuration):

## 3. write your slides as markdown content

Finally, write your content as a regular jekyll post which uses the `reveal`
layout, e.g.

```md
---
title: "Week 1: intro"
layout: reveal
---

## Intro

- welcome to the course
- we're gonna learn all the things

## Timeline

- first, we'll sit in boring lectures...
- ... then, there will be a huge exam!

fun times.
```

Then, you get all the niceties of the `jekyll watch` cycle; livereload,
auto-compilation of scss assets, etc.

And if you need to do something interesting with the formatting or layout of
your content, then you can just drop straight into writing HTML (as you can
always do in a markdown file).

## 4. write amazing content

This is the hard part. But at least if you've got a nice workflow for actually
turning your content into nice looking slides then you've got a head start :)
