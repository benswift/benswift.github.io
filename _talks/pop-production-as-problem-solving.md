---
event: National Youth Science Forum '19
title: Pop-production as problem-solving
date: "2019-01-11"
permalink: /talks/pop-production/
summary: >-
  Sure, computers are useful for solving problems, but what about when
  creativity is required? How do we solve problems like producing a pop song
  using code? A talk for the [National Youth Science Forum 2019](https://www.nysf.edu.au)
---

{% include slides/title.html %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/anders-jilden-89745-unsplash.jpg"
		   heading="give a guest lecture? sure 😊"  %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/marcus-cramer-426515-unsplash.jpg"
		   heading="oh, is it January already?"  %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/aditya-chinchure-494048-unsplash.jpg"
		   heading="<a href=\"https://extemporelang.github.io/\">extempore</a>: a
		   livecoding language" %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/rob-potter-350100-unsplash.jpg"
		   heading="livecoding"  %}

## outline

- [what's a producer?](#pop-production)
- [modelling the domain](#modelling-the-domain)
- [crowdsourced livecoding](#crowdsourced-livecoding)

## what _I'm_ gonna do

- learn a new song (by ear!)
- figure out how to turn it into code
- find a bunch of sounds which sound (approximately) like the recording
- lay down a vocal track (maybe)
- make the whole process make sense to you guys

{:.fragment}

**all in 45 minutes ⏲**

{:.fragment}

yikes!

## what _you're_ gonna do

- help me choose the song
- be kind when I make mistakes
- clap politely at the end (even if I flame out)

{% include slides/background-image.html image="images/talks/pop-production-as-problem-solving/rawpixel-487102-unsplash.jpg" heading="I'm old..." %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/bieber.jpg"
		   heading="pop music is <em>produced</em>"
		   id="pop-production" %}

## what's a producer?

a
[producer](https://www.recordingconnection.com/reference-library/recording-entrepreneurs/what-does-a-music-producer-do/)
is someone who makes songs happen

pop songs are characterised by:

- catchy hooks
- repetitive harmonic patterns (e.g. chord progressions)
- processed/synthetic sounds (lots of computers involved in the production)

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/quincy.jpg"
		   heading="Quincy Jones" %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/max-martin.jpg"
		   heading="Max Martin" %}

{% include slides/impact.html %}

programming as **problem solving**...

{% include slides/impact.html %}

the problem:

{:.fragment}
write a **no. 1** hit

{% include slides/background-image.html image="images/talks/pop-production-as-problem-solving/the-digital-marketing-collaboration-45756-unsplash.jpg" heading="modelling the domain" id="modelling-the-domain" %}

{% include slides/impact.html %}

**music** _(n.)_

a series of pitched "events" over time

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/alex-harvey-44062-unsplash.jpg"
		   heading="pedantry alert!"  %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/johannes-plenio-473709-unsplash.jpg"  %}

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/rawpixel-com-586684-unsplash.jpg"  %}

## dimensions of the domain

- time
- pitch
- loudness

## parameterisation

- **time** (in beats), e.g. 1, 2, 3, 4, 5, 6, 7, 8
- **pitch** (in MIDI note numbers), e.g. middle C as 60, C# as 61, etc.
- **loudness** (0 is silent, 127 is super loud)

## [extempore](https://extemporelang.github.io/): a livecoding _language_

[extempore](https://extemporelang.github.io/) is a programming language designed
for musical livecoding (written [Andrew Sorensen](https://twitter.com/digego)
and [me]({% link index.md %}))

don't worry about the syntax, I'll explain enough for you to follow along

{% include slides/background-image.html
		   image="images/talks/pop-production-as-problem-solving/rob-potter-350100-unsplash.jpg"
		   heading="let's go!"
		   id="crowdsourced-livecoding" %}

## what did we learn?

pop music isn't black magic, it's a domain with lots of structure/patterns

computers/code are _really useful_ for modelling/exploring this stuff

{:.fragment}

this is _not_ AI, either

{% include slides/impact.html %}

{:style="font-size:2em;"}

🤔

{:.fragment}

<https://benswift.me>
