---
title: Algorithmic uni marketing billboards
date: 2019-02-16 14:46 +1100
---

In the spirit of Murdoch University's [*free your
think*](http://www.campaignbrief.com/wa/2017/07/murdoch-university-launches-fr.html)
marketing campaign, I've put together a dynamic full-page ad billboard as my
pitch for the ANU's next marketing campaign.

{:.hl-para}

Disclaimer: this is in no way an official ANU campaign. Seriously, though, it's
a great uni---and you should come [study with us](http://www.anu.edu.au/study).

The campaign is called: **verb** *your* **verb**---hit refresh to see the
different options.

<div style="position:relative;padding-top:56.25%;">
  <iframe src="{{site.baseurl}}{% link _talks/algorithmic-ad-billboards.md %}" frameborder="0" allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
</div>

If you want to see it in fullscreen, you can [do that as
well]({{site.baseurl}}{% link _talks/algorithmic-ad-billboards.md %}).

## How does it work?

It uses the same [reveal.js](https://github.com/hakimel/reveal.js/) template
that I use for all my [talks/slides]({{site.baseurl}}{% link talks.html
%})---it's basically a one-slide presentation.

Each time the page loads, it:

1. pulls a random background image from [unsplash](https://unsplash.com)
2. chooses two verbs at random from [a list of the 1000 most frequently used
   verbs]((https://www.talkenglish.com/vocabulary/top-1000-verbs.aspx))
3. places them on the billboard in the form **verb** *your* **verb**,
   randomising the location and text style
   
As with all things on this blog, you can check out the source[^all-in-one] to see
all the details.

[^all-in-one]:
    It's actually all in inline `<script>` and `<style>` tags---which I know
    isn't nice modular software engineering, but it means that it's all on the
    one place. So, kids, do as I say in class, not as I do on my blog.
