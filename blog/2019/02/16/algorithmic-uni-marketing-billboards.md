---
title: "Algorithmic uni marketing billboards"
tags:
  - dev
---

In the spirit of Murdoch University's
[_free your think_](https://www.campaignbrief.com/wa/2017/07/murdoch-university-launches-fr.html)
marketing campaign, I've put together a dynamic full-page ad billboard as my
pitch for the ANU's next marketing campaign.

::: tip Disclaimer

This is in no way an official ANU campaign. Seriously, though, it's a great
uni---and you should come [study with us](https://www.anu.edu.au/study).

:::

The campaign is called: **verb** _your_ **verb**---hit refresh to see the
different options.

::: warning

The interactive widget is no longer available.

:::

## How does it work?

It uses the same [reveal.js](https://github.com/hakimel/reveal.js/) template
that I use for all my [talks/slides](/talks/)---it's basically a one-slide
presentation.

Each time the page loads, it:

1. pulls a random background image from [unsplash](https://unsplash.com)
2. chooses two verbs at random from
   [a list of the 1000 most frequently used verbs](https://www.talkenglish.com/vocabulary/top-1000-verbs.aspx)
3. places them on the billboard in the form **verb** _your_ **verb**,
   randomising the location and text style

As with all things on this blog, you can check out the source to see all the
details.

**UPDATE 12 March**: I rewrote the billboard code from vanilla js to
[clojurescript](https://clojurescript.org) because it makes me happy (source
[here](https://github.com/benswift/benswift.github.io/blob/source/_cljs/algorithmic_billboard/src/algorithmic_billboard/core.cljs),
and you can still see the original js source
[here](https://github.com/benswift/benswift.github.io/blob/9f4dbeceb99a43f1430593f89bdde68e1fc5c3e9/widgets/algorithmic-ad-billboards.html)).
