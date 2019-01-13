---
title: The creative potential of random
permalink: /talks/creative-potential-of-random/
date: "2017-08-17 16:00:00 +1100"
summary: >-
  There's so much to randomness than just "crazy, unpredictable dice rools".
  Wnderstanding the different types of randomness allows us to shape this
  randomness for our own creative ends. A talk given as a guest lecture to
  [COMP1720: Art & Interaction in New Media](https://cs.anu.edu.au/courses/comp1720/) in 2017.
---

{% include slides/title.html %}

{% include slides/background-image.html image="images/talks/creative-potential-of-random/blue-poles.jpg" %}

{% include slides/background-image.html image="images/talks/creative-potential-of-random/static.png" %}

## synopsis

- randomness: highlights from history
- different **types** of randomness
- mapping: using randomness effectively

{% include slides/background-image.html image="images/talks/all/prasanna-kumar-218699.jpg" heading="story" %}

{% include slides/background-image.html image="images/talks/creative-potential-of-random/jack-hamilton-320934.jpg" %}

{% include slides/impact.html %}

if you're reading the slides at home, **watch the video**

{% include slides/background-image.html image="images/talks/code-2k18/ben-smiths-sounscapes.jpg" heading="livecoding" %}

## randomness in music has a long history

musikalisches würfelspiel (18th century)

aleatoric music (20th century)

some of our labs have explored randomness in various forms

## types of randomness

not all randomness is created equal

but this **isn't** a maths lecture

## three useful types for artists

1. uniform: [`random([min], [max])`](https://p5js.org/reference/#/p5/random)
2. gaussian: [`randomGaussian()`](https://p5js.org/reference/#/p5/randomGaussian)
3. discrete: [`random(choices)`](https://p5js.org/reference/#/p5/random) (Array version)

## uniform random numbers

start with two numbers (`min` and `max`)

picks any number between those two numbers

all numbers in the range are **equally likely**

this last point is the key attribute of random numbers

{% include slides/background-image.html
   image="images/talks/creative-potential-of-random/Gauss_1840_by_Jensen.jpg"
   heading="Carl Friedrich Gauss" bgsize="contain"%}

## gaussian random numbers

picks a number *around* some middle point

numbers closer to that middle point are **more likely** than ones further away

named after Carl Friedrich Gauss

has other names: *normal distribution*, *bell curve*, etc.

## discrete random variables

sometimes there are a fixed number of outcomes, either equally likely or some
more likely than others

e.g. coin toss, roll of the dice, football match

let's have a look at the reference for
[`random()`](https://p5js.org/reference/#/p5/random) again...

if `random()` is passed one parameter which is an array, then the return value
will be one of the elements of the array, selected at random (all equally
likely)


## discrete random variables with *different likelihoods*

if you want some outcomes (i.e. some elements of the array) to happen more often
than others, there are a couple of tricks

you can add multiple identical elements to the array (think about why this
works?)

```javascipt
var loadedDice = [1, 2, 2, 2, 2 3, 4, 5, 6];
var roll = random(loadedDice);
```

## discrete random variables with *different likelihoods*

another approach: if you want one thing to happen e.g. 10% of the time, and
something else to happen the other 90%

1. use `random(100)` to get a random number between 0 and 100
2. if the result is *less than* 10, do the first thing, otherwise do the other
   thing

## mapping: using randomness effectively

mapping (I know the word "map" is overloaded in programming) in this context
means what do you *do* with the randomness

in my livecoding, I use random numbers to control/modulate: **pitch**,
**loudness**, **duration**, **rhythm**, **timbre** & more

## mapping random numbers in your sketches

in your sketches, think about how (and what kinds) of randomness you could use
to control: **position**, **size/shape**, **colour/transparency**,
**stroke/fill**, etc.

what's the right balance between **predictability** and **surprise**?

choosing where to use randomness, where not to use it, and what type of
randomness to use: *this is where the art happens*

## re-creating the random pixels image

```javascript
loadPixels();
for (var i = 0; i < pixels.length; i++) {
    if (random() < 0.5)
        pixels[i] = 0;
    else
        pixels[i] = 255;
}
updatePixels();
```

{% include slides/background-image.html image="images/talks/creative-potential-of-random/blue-poles.jpg" heading="re-creating Blue Poles?" %}

{% include slides/impact.html %}

{:style="font-size:2em;"}

🤔
