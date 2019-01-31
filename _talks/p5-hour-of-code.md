---
title: Drawing like a 5-year-old
permalink: /talks/p5-hour-of-code/
date: "2017-09-06"
summary: >-
  Who drew pictures as a 5yo? Everone! This one-hour interactive talk/workshop
  provides an introduction to code art in the web browser using the
  [p5.js](https://p5js.org/examples/) library. This talk was originally
  presented at Telopea High School.
---

{% include slides/title.html %}

{% include slides/background-image.html image="images/talks/p5-hour-of-code/chalk.jpg" heading="who drew pictures as a 5yo?" %}

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

``` javascript
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

{% include slides/background-image.html image="images/talks/p5-hour-of-code/collaboration.jpg" heading="collaboration" %}

## can you draw the square **differently**?

- bottom right
- tall and skinny
- short and fat
- filling the **whole** top right quarter

## new shapes

what happens if you replace `rect` with `ellipse`?

you can have multiple lines of code in the `draw` function---can you draw a
square and a circle on top of one another?

{% include slides/background-image.html image="images/talks/p5-hour-of-code/paint.jpg" heading="colours" %}

## colours {#colours-2}

put one of these **before** your `rect` line:

``` javascript
fill(255, 0, 0);
// or
stroke(15, 180, 0);
```

{:.fragment}

try changing the numbers around...

## moar colours

``` javascript
fill(255, 0, 0); // each value from 0-255
```

<div style="font-size: 33vh; font-weight:600; line-height:1em; text-align:center;">
<span style="color:#A00;">R</span>
<span style="color:#0A0;">G</span>
<span style="color:#00A;">B</span>
</div>

{% include slides/impact.html %}

how do you know what instructions the computer **understands**?

{% include slides/background-image.html
image="images/talks/p5-hour-of-code/yoda.jpg" heading="use the <a href=\"https://p5js.org/reference/\">reference</a>" %}

{% include slides/background-image.html
image="images/talks/p5-hour-of-code/volcano.jpg" heading="dealing with errors" %}

like a 5-year-old, you need to be **specific**

don't forget any brackets, commas, etc.

learn to *understand* the tantrums:

```
ReferenceError: sdfsd is not defined (sketch: line 8)
SyntaxError: missing ) after argument list (sketch: line 12)
```

{% include slides/background-image.html
image="images/talks/p5-hour-of-code/smiley.png" heading="smiley face" %}

``` javascript
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
