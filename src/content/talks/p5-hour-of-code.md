---
title: "Drawing like a 5-year-old"
layout: reveal
author: "Ben Swift"
date: "2017-09-06"
event: "Telopeal High School STEM Day"
---

<SlideTitle />

<SlideBackgroundImage image="images/talks/p5-hour-of-code/chalk.webp" heading="who drew pictures as a 5yo?" />

## your "hour of code"

<https://hourofcode.com/>

teach the computer to draw a picture

learn how to deal with its tantrums

share your stuff with the world

## p5.js

open up a web browser (e.g. Firefox) and head to <https://editor.p5js.org/>

**(optional)** if you want to share your work later, create an account (it's
super-easy, and free)

## edit the code

```js
function setup() {
  createCanvas(800, 800);
}

function draw() {
  // add this next line on your computer
  background(220);
  rect(0, 0, 100, 100);
}
```

don't forget to hit the play button!

<SlideBackgroundImage image="images/talks/p5-hour-of-code/collaboration.webp" heading="collaboration" />

## can you draw the square **differently**?

- bottom right
- tall and skinny
- short and fat
- filling the **whole** top right quarter

## new shapes

what happens if you replace `rect` with `ellipse`?

you can have multiple lines of code in the `draw` function---can you draw a
square and a circle on top of one another?

<SlideBackgroundImage image="images/talks/p5-hour-of-code/paint.webp" heading="colours" />

## colours {#colours-2}

put one of these **before** your `rect` line:

```js
fill(255, 0, 0);
// or
stroke(15, 180, 0);
```

<!-- class: fragment -->

try changing the numbers around...

## moar colours

```js
fill(255, 0, 0); // each value from 0-255
```

<div style="font-size: 33vh; font-weight:600; line-height:1em; text-align:center;">
<span style="color:#A00;">R</span>
<span style="color:#0A0;">G</span>
<span style="color:#00A;">B</span>
</div>

<hr class="impact center" data-background-color="#262626" />

how do you know what instructions the computer **understands**?

<SlideBackgroundImage image="images/talks/p5-hour-of-code/yoda.webp" heading="use the <a href=\" />

<SlideBackgroundImage image="images/talks/p5-hour-of-code/volcano.webp" heading="dealing with errors" />

like a 5-year-old, you need to be **specific**

don't forget any brackets, commas, etc.

learn to _understand_ the tantrums:

```
ReferenceError: sdfsd is not defined (sketch: line 8)
SyntaxError: missing ) after argument list (sketch: line 12)
```

<SlideBackgroundImage image="images/talks/p5-hour-of-code/smiley.webp" heading="smiley face" />

```js
function setup() {
  createCanvas(800, 800);
  noStroke();
}

function draw() {
  background(120);
  // set colour to yellow & draw face
  fill(255, 255, 0);
  ellipse(400, 400, 400, 400);

  // set colour to black & draw eyes/mouth
  fill(0);
  ellipse(300, 350, 70, 70);
  ellipse(500, 350, 70, 70);
  ellipse(400, 500, 120, 70);
}
```

## interaction

replace one of the numbers (e.g. a `100`) with `mouseX`

replace one of the numbers with `frameCount`

do some maths (e.g. `+`, `-`, `*`, `/`, `%`, ...)

## what have we done today?

programming (like any sufficiently complex activity) uses lots of jargon &
technical terms

but in the end, it's just about telling your computer what to do **in language
it understands**

there's lots more!

if you created an account earlier, then you'll have a **share** tab along the
top of the screen

## going further

<https://p5js.org/reference/>

<https://p5js.org/examples/>

[ben.swift@anu.edu.au](mailto:ben.swift@anu.edu.au)
