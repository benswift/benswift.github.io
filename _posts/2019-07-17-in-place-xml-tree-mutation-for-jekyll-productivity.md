---
layout: post
title: In-place XML tree mutation for Jekyll productivity
tags: web
---

I wrote a [reveal.js]({% link
_posts/2018-09-28-another-reveal.js-plugin-for-jekyll.md %}) plugin for Jekyll
so that I can make nice slides (especially for my
[ANU](https://cs.anu.edu.au/courses/comp1720/lectures/)
[courses](https://cs.anu.edu.au/courses/comp2300/lectures/)). Recently, though,
I've been touching up the COMP1720 slides for 2019 and it's getting _really
slow_ to build the website.

I turned to Jekyll's built-in profiling command to see where the problem is.
Here's the output of `jekyll build --profile` on this website, which (currently)
builds in **7.2 seconds** on my machine.

| Filename                                 | Count | Bytes   |  Time |
|------------------------------------------|-------|---------|-------|
| _layouts/reveal.html                     |     9 | 104.60K | 4.102 |
| _layouts/default.html                    |    81 | 729.15K | 0.809 |
| _includes/head.html                      |    90 | 266.90K | 0.702 |
| research.md                              |     1 | 16.40K  | 0.196 |
| _includes/hljs.html                      |    90 | 29.44K  | 0.192 |
| _includes/slides/background-image.html   |     9 | 31.94K  | 0.154 |
| _layouts/paginated.html                  |    21 | 70.29K  | 0.078 |
| _talks/u3a-world-since-google.md         |     1 | 14.49K  | 0.058 |
| _includes/header.html                    |    81 | 85.88K  | 0.042 |
| _talks/ltc-stem-camp.md                  |     1 | 13.38K  | 0.040 |
| feed.xml                                 |     1 | 105.55K | 0.038 |
| ...more inconsequential stuff follows... |       |         |       |

Clearly, the `reveal.html` layout is the problem, taking 4.1s (more than half
the total build time). I suspect that this is because my [reveal
plugin]({% link
_posts/2018-09-28-another-reveal.js-plugin-for-jekyll.md %}) does a bunch of
copying of (Nokogiri) XML nodes, because I wasn't worrying about performance
when I wrote it.

### Re-parent all the nodes!

Looking at the [Nokogiri API](https://nokogiri.org/rdoc/Nokogiri/XML/Node) and
the `revealify.rb` plugin code, there are a bunch of places where instead of
duplicating & copying nodes, I can just re-parent them into the right places.
I'm a big immutability fan usually, which is why I built the plugin based on
copying originally, but with a bit of careful re-parenting the `revealify.rb`
plugin now looks like
[this](https://github.com/benswift/benswift.github.io/blob/source/_plugins/revealify.rb)
(see the [linked post above]({% link
_posts/2018-09-28-another-reveal.js-plugin-for-jekyll.md %}) to see what it
looked like before).

And the result? Total build time is down to **2.8 seconds**. Admittedly that was
because it was _really inefficient_ before, but I'll take a 2.5x speedup anyday
😊. Here's the relevant profiler output with the updated plugin:

| Filename                                 | Count | Bytes   |  Time |
|------------------------------------------|-------|---------|-------|
| _layouts/default.html                    |    82 | 741.77K | 0.873 |
| _includes/head.html                      |    91 | 269.82K | 0.780 |
| research.md                              |     1 | 16.40K  | 0.198 |
| _layouts/reveal.html                     |     9 | 105.65K | 0.182 |
| _includes/hljs.html                      |    91 | 29.77K  | 0.172 |
| _includes/slides/background-image.html   |     9 | 31.94K  | 0.151 |
| _layouts/paginated.html                  |    21 | 70.55K  | 0.101 |
| _talks/u3a-world-since-google.md         |     1 | 14.50K  | 0.058 |
| _includes/header.html                    |    82 | 86.94K  | 0.045 |
| _talks/ltc-stem-camp.md                  |     1 | 13.39K  | 0.041 |
| feed.xml                                 |     1 | 112.62K | 0.029 |
| ...more inconsequential stuff follows... |       |         |       |

Wow, the `reveal.html` layout has gone from 4.1s to 0.2s, a **20x speedup**!

So I guess the moral of the story is that profiling is important, and that
avoiding copies and writing filthy mutable code is helpful as long as you're
careful.

Now that I've done procrastinating with this stuff, I can get back to writing my
slides for the upcoming semester.
