---
title: OzCHI Connected Creativity Algorave
subtitle: Dec 1, Ainslie Arts Centre
permalink: /gig-setlist/
layout: reveal
setlist:
  - artist: Niamh McCool
    title: The internet as metaphor for the Sea
  - artist: Matthew Walsh
    title: The Hyperdimensional Resonator
  - artist: Ushini Attanayake, Ben Swift
    title: Livecoding in Extempore
  - artist: Yichen Wang, Charles Martin
    title: Cubing Sound Ensemble
  - artist: Bernard Gray
    title: A Year of Sharing Livecoding
published: false
---

<section data-background-color="black">
<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/770997042?h=3f79e9ce8f&loop=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
</section>

{% for set in page.setlist %}
{% unless forloop.last %}

<section class="upnext-slide" data-background-color="black">

<div class="upnext-box">
<div><span class="desc">that was:</span> <span class="artist">{{page.setlist[forloop.index0].artist}}</span></div>
<div class="title">{{ page.setlist[forloop.index0].title }}</div>
<div><span class="desc">up next:</span> <span class="artist">{{page.setlist[forloop.index].artist}}</span></div>
<div class="title">{{ page.setlist[forloop.index].title }}</div>
</div>

</section>

{% endunless %}
{% endfor %}

{% include slides/impact.html %}

thanks.

## {{ page.title }}

<table class="r-stretch">
{% for set in page.setlist %}
<tr><td><strong>{{ set.artist }}</strong> {{ set.title }}</td></tr>
{% endfor %}
</table>

<style>
.upnext-box .desc {
  font-style: italic;
}
.upnext-box .artist {
  font-size: 1.2em;
  font-weight: 900;
  color: white;
  background-color: #1d4ed8;
  padding: 0.2em;
  border-radius: 0.1em;
}
.upnext-box {
  font-size: 1.3em;
  color: white;
  padding: 0.2em 0.4em;
  line-height: 2;
}
.upnext-box .title {
  padding-bottom: 3em;
}
</style>
