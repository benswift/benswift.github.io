---
title: "From Classics to Colonialism"
layout: reveal
author: "Ben Swift"
date: "2021-04-19"
subtitle: "via drum circles"
event: "an invited guest lecture at the ANU School of Cybernetics"
---

<SlideTitle />

<SlideAckCountry />

## outline

[part un](#part-1): Euclid's algorithm

[part deux](#part-2): sounding bodies and Euclidean Rhythms

[part trois](#part-3): what does it all mean?

<!-- QR code not yet implemented -->

---

<p class="r-fit-text">391&nbsp;&nbsp;578</p>

what's the _biggest_ number which divides evenly into both of these numbers?

<SlideBackgroundImage image="images/talks/classics-to-colonialism/the-school-of-athens.webp" heading="the Euclidean algorithm" id="part-1" />

the Euclidean algorithm for computing the greatest common divisor of two
integers is one of the oldest known algorithms (circa 300 B.C.)

first described in Euclid's _Elements, Proposition 2, Book VII_

independently discovered in several other places (China, India)

<SlideBackgroundImage image="images/talks/classics-to-colonialism/18SCI-KNUTH1-videoSixteenByNineJumbo1600.webp" />

> granddaddy of all algorithms, because it is the oldest nontrivial algorithm
> that has survived to the present day
>
> **Donald Knuth**, _TAOCP Vol. 2_

<SlideImageCredit  />

## in plain English

To find the **g**reatest **c**ommon **d**ivisor of two numbers (_a_ and _b_),
repeatedly replace the larger of the two numbers by their difference until both
are equal. This final number is then the greatest common divisor.

([source](https://www.sciencedirect.com/science/article/pii/S0925772108001156))

<SlideBackgroundImage image="images/talks/classics-to-colonialism/ashley-west-edwards-zwmkMkJ2Qi4-unsplash.webp" />

To find the **g**reatest **c**ommon **d**ivisor of two numbers (_a_ and _b_),
repeatedly replace the larger of the two numbers by their difference until both
are equal. This final number is then the greatest common divisor.

## why?

early on: tiling, astronomy, calendars

these days: _many applications_ (e.g. number theory, cryptography)

## geometric visualisation

<img class="r-stretch" src="/assets/images/talks/classics-to-colonialism/euclidean-algo-animated.gif" alt="animated visualisation of the Euclidean algorithm">

_animation from [Wikipedia](https://en.wikipedia.org/wiki/Euclidean_algorithm)_

## in code

```xtlang
(define (gcd a b)
  (if (= a b)
      a
      (gcd (min a b) (abs (- a b)))))
```

## in code (a bit more efficient)

```xtlang
(define (gcd a b)
  (if (= a 0)
      b
      (gcd (modulo b a) a)))
```

## rhythmic notation {#part-2}

<!-- Euclidean algorithm widget: 1:0,0:1,0:2,0:3,1:4,0:5,0:6,0:7;1:0,0:1,1:2,0:3,1:4,0:5,1:6,0:7;0:0,1:1,1:2,0:3,1:4,1:5,1:6,0:7 -->

---

<!-- Euclidean algorithm widget: 1:0,0:1,0:2,1:3,0:4;1:0,0:1,0:2,1:3,0:4,1:5,0:6;1:0,0:1,1:2,0:3,0:4,1:5,0:6,1:7,0:8,1:9,0:10,0:11;1:0,0:1,0:2,1:3,0:4,0:5,1:6,0:7,0:8,0:9,1:10,0:11,0:12,1:13,0:14,0:15 -->

<h2 id="euclidean-rhythm-example-1" data-auto-animate>euclid(3,8)</h2>

same basic idea as Euclid, although attributed to Bjorklund

<!-- Euclidean algorithm widget: 1:0,1:1,1:2,0:3,0:4,0:5,0:6,0:7 -->

<section data-auto-animate>

<!-- Euclidean algorithm widget: 1:0,1:1,1:2,0:3,0:4;0:5,0:6,0:7 -->

</section>

<section data-auto-animate>

<!-- Euclidean algorithm widget: 1:0,1:1,1:2;0:5,0:6,0:7;0:3,0:4 -->

</section>

<h2 data-auto-animate>euclid(3,8)</h2>

<!-- Euclidean algorithm widget: 1:0,0:5,0:3,1:1,0:6,0:4,1:2,0:7 -->

<p style="margin-top: 1rem;"><strong>aka:</strong> <span class="fragment">cuban <em>tresillo</em></span></p>

<h2 id="euclidean-rhythm-example-2" data-auto-animate>euclid(5,12)</h2>

<!-- Euclidean algorithm widget: 1:0,1:1,1:2,1:3,1:4,0:5,0:6,0:7,0:8,0:9,0:10,0:11 -->

<section data-auto-animate>

<!-- Euclidean algorithm widget: 1:0,1:1,1:2,1:3,1:4,0:5,0:6;0:7,0:8,0:9,0:10,0:11 -->

</section>

<section data-auto-animate>

<!-- Euclidean algorithm widget: 1:0,1:1,1:2,1:3,1:4;0:7,0:8,0:9,0:10,0:11;0:5,0:6 -->

</section>

<section data-auto-animate>

<!-- Euclidean algorithm widget: 1:0,1:1,1:2;0:7,0:8,0:9;0:5,0:6;1:3,1:4;0:10,0:11 -->

</section>

<h2 data-auto-animate>euclid(5,12)</h2>

<!-- Euclidean algorithm widget: 1:0,0:7,0:5,1:3,0:10,1:1,0:8,0:6,1:4,0:11,1:2,0:9 -->

<p style="margin-top: 1rem;"><strong>aka:</strong> <span class="fragment">South
African <em>Venda</em>, Macedonia, Central African Republic, Tool's
<em>Schism</em> and many more...</span></p>

<h2 data-auto-animate>euclid(5,8)</h2>

<!-- Euclidean algorithm widget: 1:0,0:1,1:2,1:3,0:4,1:5,1:6,0:7 -->

<p style="margin-top: 1rem;"><strong>aka:</strong> <span class="fragment">cuban <em>cinquillo</em></span></p>

<SlideBackgroundImage image="images/talks/classics-to-colonialism/ashley-west-edwards-zwmkMkJ2Qi4-unsplash.webp" />

> Line up the boxes in one row (_ones_ on the left), then move the rightmost
> _zeroes_ "under" the left-hand _ones_.
>
> If there's more than one short ("hanging chad") column on the right, take as
> many of those short columns as you can and move them to below the tallest
> (left-hand) columns---and repeat this process until there's no more than one
> short column.

<SlideStackedPapers width="50%" imagePath="assets/images/talks/classics-to-colonialism/aksak-rhythm-list.webp" alt="list of 'world' music rhythms which are Euclidean" />

## paper "results" {#part-3}

a simple algorithm for generating Euclidean rhythms

a laundry list of examples of these rhythms "in the wild"

proofs of a number of "nice" mathematical properties of Euclidean rhythms

some kite-flying about the relationship between said nice properties and the
human cultural practices associated with musicmaking

<SlideBackgroundImage image="images/talks/classics-to-colonialism/big-wow.gif" heading="musicologists:" />

not all widely-used rhythms in the world are Euclidean

<SlideBackgroundImage image="images/talks/classics-to-colonialism/conspiracy.gif" heading="algorithmic composers:" />

here's a low-dimensional (2--3 parameter) interface for generating a wide range
of interesting-sounding and culturally-significant rhythms to get people
**dancing**

<hr class="impact center" data-background-color="#262626" />
<!-- musician -> simple interface -> cultural domain -->

<SlideBackgroundImage image="images/talks/classics-to-colonialism/drum-circle.webp" />

<SlideBackgroundImage image="images/talks/classics-to-colonialism/british-museum.webp" />

---

> ...such rhythmic structures [Euclidean rhythms] can be fruitfully regarded not
> only as retentions of African musical and cultural heritage, but also as a way
> of theorizing the threads of continuity that exist between many of the
> disparate musics and cultures that have shared African roots, but have been
> radically altered by the passage of time and cross-cultural contact and
> musical hybridity.
>
> _Stewart, J (2010)_.
> [Articulating the African Diaspora through Rhythm: Diatonic Rhythms, Nested Looping Structures, and the music of Steve Coleman](https://www.jessestewart.ca/media/african_diasporic_rhythm.pdf)

---

> The rules of American commercialism permit us to circumvent indigenous labor,
> employing indigenous know-how to re-construct crude facsimiles of sacred
> objects and sophisticated musical instruments. The commercialisation of the
> pseudo-African Drum is socially, ethically and legally upheld by our moral
> framework. It is, however, in violation of the ethic of the ethnic Drum.
>
> _Friedberg, L (2003)_.
> [Drumming for Dollars](https://www.chidjembe.com/drumdollars.html)

<SlideYouTube id="fn3KWM1kuAw" />

<SlideBackgroundImage image="images/talks/classics-to-colonialism/Do_You_Love_Me_by_The_Contours_US_vinyl_A-side.webp" bgsize="contain" />

<SlideBackgroundImage image="images/talks/classics-to-colonialism/mm_The-Countours_Original-Members-2-1024x828.webp" bgsize="contain" />

<SlideBackgroundImage image="images/talks/classics-to-colonialism/boston-dynamics-police-dog.webp" />

<SlideBackgroundImage image="images/talks/classics-to-colonialism/paper-authors/godfried-toussaint.webp" />

<SlideBackgroundImage image="images/livecoding/ben-acmc-09-closeup.webp" />

<SlideBackgroundImage image="images/talks/classics-to-colonialism/typing-cat.gif" heading="Ben said the Euclidean algorithm is racist!" />

well, maybe... but that's not the main point here

you learned it earlier---I saw you---so you're implicated

algorithms (even simple ones!) can give us leverage in cultural domains, can/how
do we use it safely, sustainably, at _scale_?

<hr class="center">

> Machine learning is like money laundering for bias.
>
> **Maciej Cegłowski**,
> [_The Moral Economy of Tech_](https://idlewords.com/talks/sase_panel.htm)

## what did you learn?

<!-- class: fragment -->

Euclid's algorithm!

<!-- class: fragment -->

To find the **g**reatest **c**ommon **d**ivisor of two numbers (_a_ and _b_),
repeatedly replace the larger of the two numbers by their difference until both
are equal. This final number is then the greatest common divisor.

<!-- class: fragment -->

yes, **it will be on the final exam**

<SlideQuestions />

<hr class="impact center" data-background-color="#262626" />

<https://apps.musedlab.org/groovepizza/>

---

<iframe class="r-stretch" src="https://apps.musedlab.org/groovepizza/?source=pub&museid=5myOlMOZ0"></iframe>

---

<iframe class="r-stretch" src="https://apps.musedlab.org/groovepizza/?source=pub&museid=5nitE48DN"></iframe>
