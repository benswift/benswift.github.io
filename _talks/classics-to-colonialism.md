---
event: "an invited guest lecture at the ANU School of Cybernetics"
title: From Classics to Colonialism
subtitle: via drum circles
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

[part deux](#part-2): making noise with Euclidean Rhythms (+ livecoding!)

[part trois](#part-3): but is it cultural appropriation?

{% assign url = page.url | prepend: site.baseurl | prepend: site.url %}
{% include qrcode.html text=url showlink=true %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/the-school-of-athens.jpg" %}

{% include slides/image-credit.html
   artist="Rafael"
   title="The School of Athens"
   materials="📸 from Wikipedia, public domain"
%}

## backstory

The Euclidean algorithm for computing the greatest common divisor of two
integers is one of the oldest known algo- rithms (circa 300 B.C.). It was first
described by Euclid in Proposition 2 of Book VII of Element

_taken from the paper_

{% include slides/background-image.html image="images/talks/classics-to-colonialism/18SCI-KNUTH1-videoSixteenByNineJumbo1600.jpg" %}

> granddaddy of all algorithms, because it is the oldest nontrivial algorithm
> that has survived to the present day
>
> **Donald Knuth**, _TAOCP Vol. 2_

{% include slides/image-credit.html
   materials="📸 Brian Flaherty for The New York Times"
%}

## geometric visualisation

<img class="r-stretch" src="{% link assets/images/talks/classics-to-colonialism/euclidean-algo-animated.gif %}" alt="animated visualisation of the Euclidean algorithm">

_animation from [Wikipedia](https://en.wikipedia.org/wiki/Euclidean_algorithm)_

## in code

```extempore
(define (gcd k n)
  (if (= k 0)
      n
      (gcd (modulo n k) k)))
```

{% include slides/impact.html %}

<div class="stacked-paper">
<a href="https://www.sciencedirect.com/science/article/pii/S0925772108001156">
<img src="{% link assets/images/talks/classics-to-colonialism/distance-geometry-of-music.jpg %}" alt="first page of 'distance geometry of music' paper">
</a>
</div>

<script src="{% link assets/js/euclidean-rhythm.js %}"></script>

<section id="euclidean-rhythm-example-1" data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,1:1,1:2,0:3,0:4,0:5,0:6,0:7" %}

</section>

<section data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,1:1,1:2,0:3,0:4;0:5,0:6,0:7" %}

</section>

<section data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,1:1,1:2;0:5,0:6,0:7;0:3,0:4" %}

</section>

<section data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,0:5,0:3,1:1,0:6,0:4,1:2,0:7" %}

</section>

<section id="euclidean-rhythm-example-2" data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,1:1,1:2,1:3,1:4,0:5,0:6,0:7,0:8,0:9,0:10,0:11" %}

</section>

<section data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,1:1,1:2,1:3,1:4,0:5,0:6;0:7,0:8,0:9,0:10,0:11" %}

</section>

<section data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,1:1,1:2,1:3,1:4;0:7,0:8,0:9,0:10,0:11;0:5,0:6" %}

</section>

<section data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,1:1,1:2;0:7,0:8,0:9;0:5,0:6;1:3,1:4;0:10,0:11" %}

</section>

<section data-auto-animate>

{% include slides/euclid-algo-widget.html algobits="1:0,0:7,0:5,1:3,0:10,1:1,0:8,0:6,1:4,0:11,1:2,0:9" %}

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

