---
event: "an invited guest lecture at the ANU School of Cybernetics"
title: From Classics to Colonialism
subtitle: via drum circles
date: "2021-04-19"
permalink: /talks/classics-to-colonialism/
summary: >-
  Did the ancient Greeks know how to bust a move? Is there a deeper mathematical
  truth to which songs are best to dance to? Can algorithmic composition be a
  vehicle of oppression?
hidden: true
---

{% include slides/title.html %}

{% include hljs.html %}

{% include slides/ack-country.html %}

## outline

[part un](#part-1): Euclid's algorithm

[part deux](#part-2): sounding bodies and Euclidean Rhythms

[part trois](#part-3): implications

{% assign url = page.url | prepend: site.baseurl | prepend: site.url %}
{% include qrcode.html text=url showlink=true %}

---

<p class="r-fit-text">391&nbsp;&nbsp;578</p>

what's the _biggest_ number which divides both evenly?

{% include slides/background-image.html image="images/talks/classics-to-colonialism/the-school-of-athens.jpg" heading="the Euclidean algorithm" id="part-1" %}

the Euclidean algorithm for computing the greatest common divisor of two
integers is one of the oldest known algorithms (circa 300 B.C.)

first described by Euclid's _Elements, Proposition 2, Book VII_

independently discovered in several other places, (China, India)

{% include slides/background-image.html image="images/talks/classics-to-colonialism/18SCI-KNUTH1-videoSixteenByNineJumbo1600.jpg" %}

> granddaddy of all algorithms, because it is the oldest nontrivial algorithm
> that has survived to the present day
>
> **Donald Knuth**, _TAOCP Vol. 2_

{% include slides/image-credit.html
   credit="📸 Brian Flaherty for The New York Times"
%}

## in plain English

To find the **g**reatest **c**ommon **d**ivisor of two numbers (_a_ and _b_),
repeatedly replace the larger of the two numbers by their difference until both
are equal. This final number is then the greatest common divisor.

([source](https://www.sciencedirect.com/science/article/pii/S0925772108001156))

## why?

early on: astronomy, calendars

these days: _so many thing_ (e.g. number theory, cryptography)

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
(define (gcd a b)
  (if (= a 0)
      b
      (gcd (modulo b a) a)))
```

## rhythmic notation {#part-2}

{% include slides/euclid-algo-widget.html algobits="1:0,0:1,0:2,0:3,1:4,0:5,0:6,0:7;1:0,0:1,1:2,0:3,1:4,0:5,1:6,0:7;0:0,1:1,1:2,0:3,1:4,1:5,1:6,0:7" %}

## beyond 4/4

{% include slides/euclid-algo-widget.html algobits="1:0,0:1,0:2,1:3,0:4;1:0,0:1,0:2,1:3,1:4,1:5,1:6;1:0,0:1,1:2,0:3,0:4,1:5,0:6,1:7,0:8,1:9,0:10,0:11" %}

{% include slides/stacked-papers.html 
           image-path="assets/images/talks/classics-to-colonialism/distance-geometry-of-music.jpg"
           link="https://www.sciencedirect.com/science/article/pii/S0925772108001156"
           alt="first page of 'distance geometry of music' paper" %}

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

---

<iframe class="r-stretch" src="https://apps.musedlab.org/groovepizza/?source=pub&museid=5nitE48DN"></iframe>

<h2 data-auto-animate>euclid(5,8)</h2>

{% include slides/euclid-algo-widget.html algobits="1:0,0:1,1:2,1:3,0:4,1:5,1:6,0:7" %}

<p style="margin-top: 1rem;"><strong>aka:</strong> <span class="fragment">cuban <em>cinquillo</em></span></p>

---

<iframe class="r-stretch" src="https://apps.musedlab.org/groovepizza/?source=pub&museid=5nitE48DN"></iframe>

{% include slides/stacked-papers.html 
           width="50%"
           image-path="assets/images/talks/classics-to-colonialism/aksak-rhythm-list.png"
           alt="list of 'world' music rhythms which are Euclidean" %}

## implications? {#part-3}

not all widely-used rhythms in the world are Euclidean

low-dimensional interface (2 params, 3 at a stretch) for generating lots of
interesting and culturally-significant rhythms

{% include slides/background-image.html image="images/talks/classics-to-colonialism/big-wow.gif" heading="musicologists" %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/conspiracy.gif" heading="algorithmic composers" %}

{% include slides/impact.html %}
<!-- musician -> simple interface -> cultural domain -->

{% include slides/impact.html %}

algorithmic drum circle?

{% include slides/background-image.html image="images/talks/classics-to-colonialism/drum-circle.jpg" %}

{% include slides/image-credit.html
   artist="<a href='https://www.tropicalbreezeresort.com/'>Tropical Breeze Resort</a>"
   address1="🏢 140 Columbus Blvd"
   address2="🏢 Siesta Key, Florida USA 34242"
   phone="☎ 941.256.2686"
%}

{% include slides/impact.html %}
<!-- musician -> cultural domain -->

---

> ...such rhythmic structures can be fruitfully regarded not only as retentions
> of African musical and cultural heritage, but also as a way of theorizing the
> threads of continuity that exist between many of the disparate musics and
> cultures that have shared African roots, but have been radically altered by
> the passage of time and cross-cultural contact and musical hybridity.
>
> _Stewart, J (2010)_. [Articulating the African Diaspora through Rhythm:
> Diatonic Rhythms, Nested Looping Structures, and the music of Steve
> Coleman](http://www.jessestewart.ca/media/african_diasporic_rhythm.pdf)

---

> The rules of American commercialism permit us to circumvent indigenous labor,
> employing indigenous know-how to re-construct crude facsimiles of sacred
> objects and sophisticated musical instruments. The commercialisation of the
> pseudo-African Drum is socially, ethically and legally upheld by our moral
> framework. It is, however, in violation of the ethic of the ethnic Drum.
>
> _Friedberg, L (2003)_. [Drumming for
> Dollars](http://www.chidjembe.com/drumdollars.html)

{% include slides/youtube.html id="fn3KWM1kuAw" %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/Do_You_Love_Me_by_The_Contours_US_vinyl_A-side.png" bgsize="contain" %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/mm_The-Countours_Original-Members-2-1024x828.jpg" bgsize="contain" %}

{% include slides/image-credit.html
   artist="The Contours"
   credit="📸 Motown Museum"
%}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/Boston-Dynamics-robot-dogs.jpg" bgsize="contain" %}

{% include slides/stacked-papers.html 
           image-path="assets/images/talks/classics-to-colonialism/distance-geometry-of-music.jpg"
           link="https://www.sciencedirect.com/science/article/pii/S0925772108001156"
           alt="first page of 'distance geometry of music' paper" %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/paper-authors/godfried-toussaint.jpg" %}

{% include slides/background-image.html image="images/livecoding/ben-acmc-09-closeup.jpg" %}

{% include slides/background-image.html image="images/talks/classics-to-colonialism/typing-cat.gif" heading="Ben said algorithms are racist!" %}

well... sometimes, but that's not the main point here

look, you learned one earlier---I saw you---so you're guilty as well

we can't hide behind algorithmic disintermediation

<hr class="center">

> Machine learning is like money laundering for bias.
>
> **Maciej Cegłowski**, [_The Moral Economy of
> Tech_](https://idlewords.com/talks/sase_panel.htm)

## what did you learn?

{:.fragment}

Euclid's algorithm!

{:.fragment}

To find the **g**reatest **c**ommon **d**ivisor of two numbers (_a_ and _b_),
repeatedly replace the larger of the two numbers by their difference until both
are equal. This final number is then the greatest common divisor.

{:.fragment}

yes, **it will be on the final exam**

{% include slides/questions.html %}

