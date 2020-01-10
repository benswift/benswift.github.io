---
title: Research
layout: page
permalink: /research/
---

{% include assets/picture.html file="images/pages/ben-soundscapes-21.jpg" alt="Ben performing at Soundscapes #21, Photo by Adam Thomas" %}

I am a multidisciplinary researcher and Senior Lecturer in the Research School
of Computer Science at the [Australian National
University](https://cecs.anu.edu.au/people/ben-swift). I'm interested in
computational art, data visualisation, human-computer interaction, hardware
hacking/making (particularly in pursuit of creative ends) and the intersection
of code, creativity and culture as those boundaries dissolve in the modern
world. I lead the [code/creativity/culture
group](https://cs.anu.edu.au/code-creativity-culture/) at the ANU Research
School of Computer Science (you should check out the [c/c/c group's projects
page](https://cs.anu.edu.au/code-creativity-culture/projects/) as well).

I am a **livecoder**, and have performed at both local and international arts
festivals---you can find recordings of some of my sets [on my livecoding
page]({% link livecoding.md %}).

I love building things, and one thing I'm particularly excited about is the
potential of **liveness** (real-time human-in-the-loop interactivity) in
programming tools and workflows. I have made significant [open-source code
contributions](https://github.com/benswift) to the international research and
livecoding communities, especially through my work on
[Extempore](https://github.com/digego/extempore): the state-of-the-art in
livecoding languages.

{:.hl-para}

To get a sense for my current ongoing research projects, head to the
[c/c/c](https://cs.anu.edu.au/code-creativity-culture/) website---that's the
most up-to-date list of all the things that me and my group are working on.

### Come study with me

If you're interested in doing Honours/Masters/PhD research with me, [send me an
email](mailto:ben.swift@anu.edu.au). I always have a few project ideas kicking
around, but I'm also open to hearing about the project/big idea that excites
_you_. Send me

1. a **one-paragraph** description of the project you're interested in doing,
   and
2. a **link to something you've made**: a livecoding video, a project on GitHub,
   an academic paper---even a blog post

I get a lot of emails about this sort of thing, so including these two things is
a great way to show that you've thought a bit about what sort of research
project you're interested in (and why I'd be a good fit). You should think hard
about how to make your email stand out from the crowd.

## Publications

{% bib_list ben-pubs.bib %}

## Curated/invited livecoding performances

<div class="bibliography">
{% for lc in site.livecoding reversed %}
{% if lc.type == "curated" and lc.hidden != true %}
<div>

{% if lc.event_url %}

<p class="title"><a href="{{ lc.event_url }}">{{ lc.title }}</a></p>
{% else %}
<p class="title">{{ lc.title }}</p>
{% endif %}

{% if lc.curator %}

<p>{{ lc.curator }} <span class="date">(curator)</span></p>
{% endif %}

{% if lc.venue_url %}

<p>
  <span class="date">{{ lc.date | date: "%d %b '%y" }}</span> @
  <a href="{{ lc.venue_url }}"><span class="venue">{{ lc.venue }}</span></a>
</p>
{% else %}
<p>
  <span class="date">{{ lc.date | date: "%d %b '%y" }} @ </span>
  <span class="venue">{{ lc.venue }}</span>
</p>
{% endif %}

</div>
{% endif %}
{% endfor %}
</div>
