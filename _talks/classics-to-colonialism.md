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

[part deux](#part-2): sounding bodies and Euclidean Rhythms

[part trois](#part-3): cui bono?

{% assign url = page.url | prepend: site.baseurl | prepend: site.url %}
{% include qrcode.html text=url showlink=true %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/the-school-of-athens.jpg" %}

{% include slides/image-credit.html
   artist="Rafael"
   title="The School of Athens"
   credit="📸 from Wikipedia, public domain"
%}

## the Euclidean algorithm

the Euclidean algorithm for computing the greatest common divisor of two
integers is one of the oldest known algorithms (circa 300 B.C.)

first described by Euclid's _Elements, Proposition 2, Book VII_

{% include slides/background-image.html image="images/talks/classics-to-colonialism/18SCI-KNUTH1-videoSixteenByNineJumbo1600.jpg" %}

> granddaddy of all algorithms, because it is the oldest nontrivial algorithm
> that has survived to the present day
>
> **Donald Knuth**, _TAOCP Vol. 2_

{% include slides/image-credit.html
   credit="📸 Brian Flaherty for The New York Times"
%}

## in plain English

TODO

## geometric visualisation

<img class="r-stretch" src="{% link assets/images/talks/classics-to-colonialism/euclidean-algo-animated.gif %}" alt="animated visualisation of the Euclidean algorithm">

_animation from [Wikipedia](https://en.wikipedia.org/wiki/Euclidean_algorithm)_

## in code

```extempore
(define (gcd a b)
  (if (= a b)
      a
      (gcd (min a b) (abs (- a b)))))
```

## in code (a bit more efficient)

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

<h2 data-auto-animate>euclid(3,8)</h2>

{% include slides/euclid-algo-widget.html algobits="1:0,0:5,0:3,1:1,0:6,0:4,1:2,0:7" %}

<p style="margin-top: 1rem;"><strong>aka:</strong> <span class="fragment">cuban <em>tresillo</em></span></p>

---

<iframe class="r-stretch" src="https://apps.musedlab.org/groovepizza/?source=pub&museid=5myOlMOZ0"></iframe>

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

<h2 data-auto-animate>euclid(5,12)</h2>

{% include slides/euclid-algo-widget.html algobits="1:0,0:7,0:5,1:3,0:10,1:1,0:8,0:6,1:4,0:11,1:2,0:9" %}

<p style="margin-top: 1rem;"><strong>aka:</strong> <span class="fragment">South
African <em>Venda</em>, Macedonia, Central African Republic and
more...</span></p>

<h2 data-auto-animate>euclid(5,8)</h2>

{% include slides/euclid-algo-widget.html algobits="1:0,0:1,1:2,1:3,0:4,1:5,1:6,0:7" %}

<p style="margin-top: 1rem;"><strong>aka:</strong> <span class="fragment">cuban <em>cinquillo</em></span></p>

## TODO

moar rhythm examples (from around the world)

implications: simply-parameterised way to generate interesting rhythms

-> obviously useful for livecoding

appeals to the "small interface, huge expressive power" of all makers
(_especially_ software makers) TODO maybe have a picture of some cool machine?

## TODO

90s drum circle

## algorithmically-mediated colonialism?

_Stewart, J (2010)_ [Articulating the African Diaspora through Rhythm: Diatonic
Rhythms, Nested Looping Structures, and the music of Steve
Coleman](http://www.jessestewart.ca/media/african_diasporic_rhythm.pdf)

_Friedberg, L (2003)_ [Drumming for
Dollars](http://www.chidjembe.com/drumdollars.html)

---

{% include slides/youtube.html id="fn3KWM1kuAw" %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/Do_You_Love_Me_by_The_Contours_US_vinyl_A-side.png" bgsize="contain" %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/mm_The-Countours_Original-Members-2-1024x828.jpg" bgsize="contain" %}

{% include slides/image-credit.html
   artist="The Contours"
   credit="📸 Motown Museum"
%}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/Boston-Dynamics-robot-dogs.jpg" %}

{% include slides/impact.html %}

<div class="stacked-paper">
<a href="https://www.sciencedirect.com/science/article/pii/S0925772108001156">
<img src="{% link assets/images/talks/classics-to-colonialism/distance-geometry-of-music.jpg %}" alt="first page of 'distance geometry of music' paper">
</a>
</div>

{% include slides/background-image.html image="images/talks/classics-to-colonialism/paper-authors/godfried-toussaint.jpg" %}

{% include slides/background-image.html image="images/livecoding/ben-alta.jpg" %}

## but it's just math!

show some tricky maths from the paper

---

> Machine learning is like money laundering for bias.
>
> **Maciej Cegłowski**, [_The Moral Economy of
> Tech_](https://idlewords.com/talks/sase_panel.htm)

{% include slides/background-image.html image="images/livecoding/ben-acmc-09-closeup.jpg" %}

<hr class="center">

{:style="font-size:0.8rem;"}

```python
# a SoCY twitter bot
for tweet in api.user("3AInstitute").timeline(limit=200):
  if tweet.user.location == "San Francisco":
    tweet.retweet_with_comment("I have so many questions")
```

{% include slides/questions.html %}

