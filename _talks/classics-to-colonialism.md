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

# Euclid's algorithm

## backstory

The Euclidean algorithm for computing the greatest common divisor of two
integers is one of the oldest known algo- rithms (circa 300 B.C.). It was first
described by Euclid in Proposition 2 of Book VII of Element

_taken from the paper_

## Knuth

> "granddaddy of all algorithms, because it is the oldest nontrivial algorithm
> that has survived to the present day"

<section data-auto-animate>

<style>
.algo-container {
  display: flex;
  justify-content: flex-start;
  font-size: 100px;
  font-weight: 700;
  font-family: "Fira Code", monospace;
  margin: 0;
}
.algo-container .bit {
  border: 0.1em solid #f5ddfa;
  padding: 0.3em;
  margin: 0.3em;
}
.algo-container .bit[data-value]:before {
  content: attr(data-value);
}
.algo-container .bit[data-value="1"] {
  background-color: #333;
  color: #fafafa;
}
</style>

{% assign algobits = "1:0,1:1,1:2,0:3,0:4,0:5,0:6,0:7" %}
{% assign rows = algobits | split: ";" %}
{% for row in rows %}
<div class="algo-container">
{% assign bitpairs = row | split: "," %}
{% for bitpair in bitpairs %}
{% assign bit = bitpair | split: ":" %}
<div class="bit" data-value="{{bit[0]}}" data-id="{{bit[1]}}"></div>
{% endfor %}
</div>
{% endfor %}

</section>

<section data-auto-animate>

{% assign algobits = "1:0,1:1,1:2,0:3,0:4;0:5,0:6,0:7" %}
{% assign rows = algobits | split: ";" %}
{% for row in rows %}
<div class="algo-container">
{% assign bitpairs = row | split: "," %}
{% for bitpair in bitpairs %}
{% assign bit = bitpair | split: ":" %}
<div class="bit" data-value="{{bit[0]}}" data-id="{{bit[1]}}"></div>
{% endfor %}
</div>
{% endfor %}

</section>

<section data-auto-animate>

{% assign algobits = "1:0,1:1,1:2;0:5,0:6,0:7;0:3,0:4" %}
{% assign rows = algobits | split: ";" %}
{% for row in rows %}
<div class="algo-container">
{% assign bitpairs = row | split: "," %}
{% for bitpair in bitpairs %}
{% assign bit = bitpair | split: ":" %}
<div class="bit" data-value="{{bit[0]}}" data-id="{{bit[1]}}"></div>
{% endfor %}
</div>
{% endfor %}

</section>

<section data-auto-animate>

{% assign algobits = "1:0,0:5,0:3,1:1,0:6,0:4,1:2,0:7" %}
{% assign rows = algobits | split: ";" %}
{% for row in rows %}
<div class="algo-container">
{% assign bitpairs = row | split: "," %}
{% for bitpair in bitpairs %}
{% assign bit = bitpair | split: ":" %}
<div class="bit" data-value="{{bit[0]}}" data-id="{{bit[1]}}"></div>
{% endfor %}
</div>
{% endfor %}

</section>

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
  width: 2ch;
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

