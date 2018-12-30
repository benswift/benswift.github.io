---
title: another reveal.js plugin for Jekyll
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
sections (separated by `##` headings) to determine the slide splits (this is how
[pandoc does it](https://pandoc.org/MANUAL.html#producing-slide-shows-with-pandoc)).

I wrote a simple [Jekyll](https://jekyllrb.com/docs/plugins/) to make this
happen---which has just a couple of moving parts

## 1. the revealify [filter](https://jekyllrb.com/docs/plugins/filters/) {#the-revealify-filter}

First, put this code into a `revealify.rb` file in your Jekyll `_plugins`
directory:

```ruby
# (c) Ben Swift 2018, MIT Licence
# ben.swift@anu.edu.au

# a liquid filter for turning regular md output into the <section>-enclosed
# chunks required by reveal.js

require 'jekyll'
require 'nokogiri'

module Jekyll

  module Revealify

    def revealify(html)

      # parse content
      content = Nokogiri::HTML.fragment(html)

      # create an empty node
      reveal_div = Nokogiri::HTML.fragment('<div class="reveal"><div class="slides"></div></div>', 'UTF-8')
      slides_div = reveal_div.search('.slides').first

      content.xpath("*").each do |element|

        # <section> elements should be passed through as-is
        if element.matches? "section"
          slides_div.add_child(element.dup)

        else
          # on "split" elements (<h1>, <h2>, <hr>)
          if element.matches? "h1,h2,hr"
            current_section = slides_div.add_child("<section>").first
            # hoist all the header's attributes up to the wrapper element
            # not sure if this will always work, but here goes...
            element.keys.each do |attribute|
              # relies on the fact that the "current" wrapper node is the last child in ret
              current_section[attribute] = element[attribute]
              # element.delete attribute
            end
          end

          # add the element to the current <section> (i.e. the current slide)
          # unless it's just an <hr> (which are used for splitting only)
          current_section = slides_div.last_element_child
          current_section.add_child(element.dup) unless element.matches? "hr"
        end

      end

      reveal_div.to_html
    end

  end

end

Liquid::Template.register_filter(Jekyll::Revealify)
```

## 2. add a reveal [layout](https://jekyllrb.com/docs/layouts/)

You'll need a new [layout](https://jekyllrb.com/docs/layouts/) as well: create a
`reveal.html` file in your Jekyll `_layouts` directory and make sure that the
body tag has this in it (you'll need to make sure it's got the right paths &
other stuff for your setup). The key part is that first `{% raw %}{{ content |
revealify }}{% endraw %}` line---that takes the content of your page (the jekyll
`.md` file with `layout: reveal` in the frontmatter) and passes it through the
filter defined in the [revealify filter](#the-revealify-filter).

The configuration stuff here is just the example config from
[reveal.js](https://github.com/hakimel/reveal.js#configuration), so feel free to
tweak to suit your own presentation.

```html
<!-- this is where the reveailfy filter gets applied -->
{% raw %}{{ content | revealify }}{% endraw %}

<!-- load the reveal.js source -->
<script src="{{site.baseurl}}/reveal.js-3.6.0/js/reveal.js" type="text/javascript"></script>

<!-- configure the presentation -->
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

*Note:* I'm ommitting some details here about how to set up everything (e.g.
putting the reveal.js source folder in the right place).

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
