---
title: "Musical instructions"
description: "A slide deck presented at Lake Tuggeranong College STEM Camp"
---

# Musical instructions

## Lake Tuggeranong College STEM Camp

---

<!-- _class: impact -->
can y'all keep a secret?

---

![bg](/assets/images/talks/ltc-stem-camp/ben-ltc-graduation-group.webp)

---

![bg](/assets/images/talks/ltc-stem-camp/ben-ltc-graduation-solo.webp)

---

<!-- _class: impact -->
enough about me...

tell me about **you**

---

![bg](/assets/images/talks/ltc-stem-camp/tadas-mikuckis-20931-unsplash.webp)

## musicians?

---

![bg](/assets/images/talks/ltc-stem-camp/roman-mager-59976-unsplash.webp)

## mathematicians?

---

![bg](/assets/images/talks/ltc-stem-camp/fatos-bytyqi-535528-unsplash.webp)

## coders?

---

![bg](/assets/images/talks/ltc-stem-camp/aaron-burden-82797-unsplash.webp)

---

<h2 class="talk-box" data-background-color="#aef4e6">talk</h2>

music, maths, computers: what's the connection?

what are computer programs good at?

what would a song performed by a computer program sound like?

---

## outline

what is (pop) music?

activity: (_low-tech_ musical instructions)

livecoding: (_high-tech_ musical instructions)

---

<!-- _class: impact -->
**music** _(n.)_

a series of pitched "events" over time

---

![bg](/assets/images/talks/ltc-stem-camp/jonathan-safa-689951-unsplash.webp)

## pedantry alert.

catchy hooks

repetitive harmonic patterns (e.g. chord progressions)

processed/synthetic sounds (lots of computers involved in the production)

---

<!-- _class: impact -->
lots of **patterns**

but how do we express them?

---

## "dimensions" of a musical note

1. time
2. pitch
3. loudness

---

![bg](/assets/images/talks/ltc-stem-camp/aron-visuals-322314-unsplash.webp)

## time

what aspects of the music does it influence?

why is it important?

how do we measure it?

what aspects of the music does it influence?

why is it important?

how do we measure it?

---

![bg](/assets/images/talks/ltc-stem-camp/jason-rosewell-60014-unsplash.webp)

## loudness

what aspects of the music does it influence?

why is it important?

how do we measure it?

---

![bg](/assets/images/talks/pop-production-as-problem-solving/the-digital-marketing-collaboration-45756-unsplash.webp)

## modelling the domain

remember: music is a series of musical events

each event has a time, a pitch and a loudness

---

## maths recap 1: functions

function _f(x, y)_ takes two parameters/arguments and returns a result

e.g. _f(x, y)_ = _8x_ + _2y_

parameters are _input_, the function does something with the inputs to produce
an _output_

---

## maths recap 2: modular arithmetic

arithmetic which "wraps around"

0, 1, 2, 0, 1, 2, 0, 1, 2, ... instead of 0, 1, 2, 3, 4, 5, 6, ...

the modulus can be any integer, e.g.

- 7 _mod_ 4 is 3
- 18 _mod_ 7 is 4

---

![bg](/assets/images/talks/ltc-stem-camp/lukas-blazek-263122-unsplash.webp)

## example: clock

---

![bg](/assets/images/talks/ltc-stem-camp/jason-leung-1378422-unsplash.webp)

## patterns

---

![bg](/assets/images/talks/ltc-stem-camp/orlova-maria-1365053-unsplash.webp)

## are

---

![bg](/assets/images/talks/ltc-stem-camp/paul-talbot-704-unsplash.webp)

## everywhere

---

<!-- _class: impact -->
**activity**: musical instructions

---

## how to play

split into pairs

I'll tell one person (person A) the name of a song

person A will write down (in _English_) instructions for how to play the song
(**no conventional music notation allowed**)

person B will read the instructions, "sing" them, and try to guess what the song
is

---

![bg](/assets/images/talks/ltc-stem-camp/dolo-iglesias-487520-unsplash.webp)

## scales (just a warm-up)

---

<!-- _class: impact -->
![bg](/assets/images/talks/ltc-stem-camp/laura-college-286844-unsplash.webp)

## Jaws

---

<!-- _class: impact -->
![bg](/assets/images/talks/ltc-stem-camp/FreddyMercuryWembley.webp)

## We Will Rock You

_remember_: you have to describe the instruments, **not** the vocal track

---

<!-- _class: impact -->
![bg](/assets/images/talks/ltc-stem-camp/coldplay-clocks.webp)

---

<!-- _class: impact -->
![bg](/assets/images/talks/ltc-stem-camp/this-is-america.webp)

## This is America

---

![bg](/assets/images/talks/ltc-stem-camp/bady-qb-1476403-unsplash.webp)

## your choice of song

---

<h2 class="talk-box" data-background-color="#aef4e6">talk</h2>

what was the hardest part?

what was the easiest?

was it easier/harder than you expected?

how would you do it differently next time?

---

## what _I'm_ gonna do

learn a new song (by ear!)

figure out how to turn it into code

find a bunch of sounds which sound (approximately) like the recording

lay down a vocal track (maybe)

make the whole process make sense to you guys

---

## what _you're_ gonna do

help me choose the song

be kind when I make mistakes

clap politely at the end (even if I flame out)

---

![bg](/assets/images/talks/pop-production-as-problem-solving/the-digital-marketing-collaboration-45756-unsplash.webp)

## reminder: domain model

**time** (in beats), e.g. 0, 1, 2, 3, 4, 5, 6, 7, 8

**pitch** (in MIDI note numbers), e.g. middle C as 60, C# as 61, etc.

**loudness** (0 is silent, 127 is super loud)

---

## [extempore](https://extemporelang.github.io/): a livecoding _language_

[extempore](https://extemporelang.github.io/) is a programming language designed
for musical livecoding (written [Andrew Sorensen](https://twitter.com/digego)
and [me](/))

`mplay` is the key function:

```xtlang
;;                pitch loud duration   instrument
(mplay *midi-out* 60    80   (* .5 dur) 1)
```

don't worry about the syntax, I'll explain enough for you to follow along

---

![bg](/assets/images/talks/pop-production-as-problem-solving/rawpixel-487102-unsplash.webp)

## I'm old...

---

## what did we learn?

pop music isn't black magic, it's a domain with lots of structure/patterns

we can write instructions which express those patterns

computers/code are _really useful_ for modelling/exploring this stuff

this is _not_ AI, either

---

## c/c/c studio

in 2020 I'm starting an art+music+code extension program at the ANU

we'll do stuff like this (and lots more)

if you're interested, let me know 😊

---

<!-- _class: impact -->
🤔

[ben.swift@anu.edu.au](mailto:ben.swift@anu.edu.au)

<https://benswift.me>

<!-- things to get -->

<!-- Wacom -->
<!-- Maschine -->
<!-- long HDMI cable -->
<!-- other cables -->
<!-- pens & paper? -->

<!-- end things to get -->
