---
title: "Musical instructions"
layout: reveal
author: "Ben Swift"
date: "2019-05-22"
event: "Lake Tuggeranong College STEM Camp"
---

<SlideTitle />

<hr class="impact center" data-background-color="#262626" />

can y'all keep a secret?

<SlideBackgroundImage image="images/talks/ltc-stem-camp/ben-ltc-graduation-group.jpg" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/ben-ltc-graduation-solo.jpg" bgsize="contain" bgcol="#000" />

<hr class="impact center" data-background-color="#262626" />

enough about me...

tell me about **you**

<SlideBackgroundImage image="images/talks/ltc-stem-camp/tadas-mikuckis-20931-unsplash.jpg" heading="musicians?" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/roman-mager-59976-unsplash.jpg" heading="mathematicians?" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/fatos-bytyqi-535528-unsplash.jpg" heading="coders?" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/aaron-burden-82797-unsplash.jpg" />

<h2 class="talk-box" data-background-color="#aef4e6">talk</h2>

<!-- class: fragment -->

music, maths, computers: what's the connection?

<!-- class: fragment -->

what are computer programs good at?

<!-- class: fragment -->

what would a song performed by a computer program sound like?

## outline

what is (pop) music?

activity: (_low-tech_ musical instructions)

livecoding: (_high-tech_ musical instructions)

<hr class="impact center" data-background-color="#262626" />

**music** _(n.)_

<!-- class: fragment -->

a series of pitched "events" over time

<SlideBackgroundImage image="images/talks/ltc-stem-camp/jonathan-safa-689951-unsplash.jpg" heading="pedantry alert." />

<!-- class: fragment -->

catchy hooks

<!-- class: fragment -->

repetitive harmonic patterns (e.g. chord progressions)

<!-- class: fragment -->

processed/synthetic sounds (lots of computers involved in the production)

<hr class="impact center" data-background-color="#262626" />

lots of **patterns**

but how do we express them?

## "dimensions" of a musical note

1. time
2. pitch
3. loudness

<SlideBackgroundImage image="images/talks/ltc-stem-camp/aron-visuals-322314-unsplash.jpg" heading="time" />

what aspects of the music does it influence?

why is it important?

how do we measure it?

what aspects of the music does it influence?

why is it important?

how do we measure it?

<SlideBackgroundImage image="images/talks/ltc-stem-camp/jason-rosewell-60014-unsplash.jpg" heading="loudness" />

what aspects of the music does it influence?

why is it important?

how do we measure it?

<SlideBackgroundImage image="images/talks/pop-production-as-problem-solving/the-digital-marketing-collaboration-45756-unsplash.jpg" heading="modelling the domain" id="modelling-the-domain" />

remember: music is a series of musical events

each event has a time, a pitch and a loudness

## maths recap 1: functions

function _f(x, y)_ takes two parameters/arguments and returns a result

e.g. _f(x, y)_ = _8x_ + _2y_

parameters are _input_, the function does something with the inputs to produce
an _output_

## maths recap 2: modular arithmetic

arithmetic which "wraps around"

0, 1, 2, 0, 1, 2, 0, 1, 2, ... instead of 0, 1, 2, 3, 4, 5, 6, ...

the modulus can be any integer, e.g.

- 7 _mod_ 4 is 3
- 18 _mod_ 7 is 4

<SlideBackgroundImage image="images/talks/ltc-stem-camp/lukas-blazek-263122-unsplash.jpg" heading="example: clock" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/jason-leung-1378422-unsplash.jpg" heading="patterns" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/orlova-maria-1365053-unsplash.jpg" heading="are" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/paul-talbot-704-unsplash.jpg" heading="everywhere" />

<hr class="impact center" data-background-color="#262626" />

**activity**: musical instructions

## how to play

split into pairs

I'll tell one person (person A) the name of a song

person A will write down (in _English_) instructions for how to play the song
(**no conventional music notation allowed**)

person B will read the instructions, "sing" them, and try to guess what the song
is

<SlideBackgroundImage image="images/talks/ltc-stem-camp/dolo-iglesias-487520-unsplash.jpg" heading="scales (just a warm-up)" />

<hr class="impact center" data-background-color="#262626" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/laura-college-286844-unsplash.jpg" heading="Jaws" />

<hr class="impact center" data-background-color="#262626" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/FreddyMercuryWembley.jpg" heading="We Will Rock You" />

_remember_: you have to describe the instruments, **not** the vocal track

<hr class="impact center" data-background-color="#262626" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/coldplay-clocks.jpeg" />

<hr class="impact center" data-background-color="#262626" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/this-is-america.jpeg" heading="This is America" />

<SlideBackgroundImage image="images/talks/ltc-stem-camp/bady-qb-1476403-unsplash.jpg" heading="your choice of song" />

<h2 class="talk-box" data-background-color="#aef4e6">talk</h2>

what was the hardest part?

what was the easiest?

was it easier/harder than you expected?

how would you do it differently next time?

## what _I'm_ gonna do

learn a new song (by ear!)

figure out how to turn it into code

find a bunch of sounds which sound (approximately) like the recording

lay down a vocal track (maybe)

make the whole process make sense to you guys

## what _you're_ gonna do

help me choose the song

be kind when I make mistakes

clap politely at the end (even if I flame out)

<SlideBackgroundImage image="images/talks/pop-production-as-problem-solving/the-digital-marketing-collaboration-45756-unsplash.jpg" heading="reminder: domain model" />

**time** (in beats), e.g. 0, 1, 2, 3, 4, 5, 6, 7, 8

**pitch** (in MIDI note numbers), e.g. middle C as 60, C# as 61, etc.

**loudness** (0 is silent, 127 is super loud)

## [extempore](https://extemporelang.github.io/): a livecoding _language_

[extempore](https://extemporelang.github.io/) is a programming language designed
for musical livecoding (written [Andrew Sorensen](https://twitter.com/digego)
and [me](/index))

`mplay` is the key function:

```xtlang
;;                pitch loud duration   instrument
(mplay *midi-out* 60    80   (* .5 dur) 1)
```

don't worry about the syntax, I'll explain enough for you to follow along

<SlideBackgroundImage image="images/talks/pop-production-as-problem-solving/rawpixel-487102-unsplash.jpg" heading="I'm old..." />

## what did we learn?

pop music isn't black magic, it's a domain with lots of structure/patterns

we can write instructions which express those patterns

computers/code are _really useful_ for modelling/exploring this stuff

<!-- class: fragment -->

this is _not_ AI, either

## c/c/c studio

in 2020 I'm starting an art+music+code extension program at the ANU

we'll do stuff like this (and lots more)

if you're interested, let me know 😊

<hr class="impact center" data-background-color="#262626" />

🤔

<!-- class: fragment -->

[ben.swift@anu.edu.au](mailto:ben.swift@anu.edu.au)

<!-- class: fragment -->

<https://benswift.me>

<!-- things to get -->

<!-- Wacom -->
<!-- Maschine -->
<!-- long HDMI cable -->
<!-- other cables -->
<!-- pens & paper? -->

<!-- end things to get -->
