---
event: "an invited guest lecture at the ANU School of Cybernetics"
title: From Classics to Colonialism...
subtitle: ...via drum circles
date: "2021-04-19"
permalink: /talks/classics-to-colonialism/
summary: >-
  TODO
hidden: true
---

{% include slides/title.html %}

{% include hljs.html %}

{% include slides/ack-country.html %}

## outline

[part un](#part-1): Euclid's algorithm

[part deux](#part-2): Euclidean Rhythms (+ livecoding!)

[part trois](#part-3): but is it cultural appropriation?

{% include slides/impact.html %}

{:style="font-size:0.6em;"}

{% assign url = page.url | prepend: site.baseurl | prepend: site.url %}
{% include qrcode.html text=url showlink=true %}

<hr class="center">

<style>
.bignumber-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.bignumber {
  font-size: 500px;
  min-width: 1ch;
  max-width: 2ch;
  text-align: center;
  border: none;
}
.bignumber-wrapper input:placeholder-shown {
  border-radius: 0.1em;
  border: 5px solid #be2edd;
}
</style>

<div class="bignumber-wrapper">
<input class="bignumber"  inputmode="numeric" pattern="[0-9]*" type="text" placeholder="k">&nbsp;<input class="bignumber"  inputmode="numeric" pattern="[0-9]*" type="text" placeholder="n">
</div>

## what's next?

these questions keep me up at night

if you'd like to help (or just to hang out with the c/c/c group more generally)
then let me know 😊

{% include slides/questions.html %}

