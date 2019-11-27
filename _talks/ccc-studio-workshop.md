---
event: Reimagine CoDesign Culture Lab
title: c/c/c studio curriculum design
subtitle: Reimagine CoDesign Culture Lab
date: "2019-11-28"
permalink: /talks/ccc-studio-workshop/
summary: >-
  a half-day workshop at the 2019 CECS Reimagine CoDesign Culture Lab
---
{% include slides/title.html %}

{% asset js/TweenMax.min.js %}
{% asset js/Winwheel.js %}
{% asset js/ccc-workshop-wheels.js %}

{% include slides/background-image.html image="images/talks/ccc-studio-workshop/mount-majura-bushland.jpg" %}

We acknowledge and celebrate the First Australians on whose traditional lands we
meet, and pay our respect to the elders past, present and emerging

## welcome

<!-- TODO get a photo of CDCL attendees -->

{% include slides/background-image.html image="documents/ccc-curriculum-design-workshop/vikas-anand-dev-iMmlx_fCeWc-unsplash.jpg" heading="c/c/c untangled(?)" %}

The code/creativity/culture group (c/c/c) is a research group within the
Research School of Computer Science. Our goal is to create spaces for _talking_,
_thinking_ and _making_ about the way that **code** (software), **creativity**
(especially the arts) and **culture** (life) intersect in the modern world.

(_from the_ [c/c/c landing
page](https://cs.anu.edu.au/code-creativity-culture/))

---

{% include youtube.html id="Sv4Y-UPqML8" %}

{% include slides/background-image.html image="images/posts/comp1720-mp-exhibition-2018-2.jpg" heading="the c/c/c studio" %}

an [ANU Extension](https://cs.anu.edu.au/code-creativity-culture/) program to
teach computer science to year 11 & 12 students through making art, music and
other cool things with computers

curriculum being developed right now (using
[COMP1720](https://cs.anu.edu.au/courses/comp1720/) & [COMP2710 Laptop
Ensemble](https://cs.anu.edu.au/code-creativity-culture/lens/) as a starting
point, but everything's up for grabs!)

first student intake (year 11 only) in 2021, first graduates in 2022

## today's workshop task

_your design brief for today_: in your group, create an assessment task which
teaches a particular **code** concept/tool by exploring a problem/challenge
facing our **culture** through a particular **creative** process/medium.

it might be used in the c/c/c studio 😊

## timeline

**9:00**: intro & group formation

**9:30**: [group work session 1]({{site.baseurl}}{% link
_posts/2019-11-07-codesign-culture-lab-workshop.md %}#group-work-session-1)
(assessment item spec)

{:style="background-color: #ddd;"}

**10:30**: break (morning tea)

**11:00**: presentations

**11:30**: [group work session 2]({{site.baseurl}}{% link
_posts/2019-11-07-codesign-culture-lab-workshop.md %}#group-work-session-2)
(assessment criteria)

**12:15**: wrap-up

## group formation

look for the stickers on your table

- **red**: _code_
- **blue**: _creativity_
- **green**: _culture_
- **brown**: _💩_

---

<style>
.wheelIndicator {
  width:100%;
  font-size:2em;
  text-align:center;
  margin-bottom:-0.2em;
}

.wheelResult {
  font-size:1.3em;
  background-color: #f5ddfa;
  border-left: 10px solid #be2edd;
  padding: 1em 1em;
  margin: 0;
}
</style>

<p class="wheelResult">

<em>objective</em>: learning about <strong><span
class="codeWheel-canvas-result">________</span></strong> by exploring
<strong><span class="cultureWheel-canvas-result">________</span></strong>
through <strong><span
class="creativityWheel-canvas-result">________</span></strong>

</p>

<div style="width:100%; display:flex; justify-content:space-between;">
<div class="wheelIndicator">⧨<div id="codeWheel-canvas"></div></div>
<div class="wheelIndicator">⧨<div id="cultureWheel-canvas"></div></div>
<div class="wheelIndicator">⧨<div id="creativityWheel-canvas"></div></div>
</div>

<script>
let wheelWidth = document.getElementsByClassName("slides")[0].offsetWidth/7;

let codeWheel = makeWheel(
  [
	"algorithms",
	"embedded systems",
	"signal processing",
	"software design",
	"databases",
	"networks",
	"UI/UX design",
	"data analytics",
	"machine learning",
	"cybersecurity"
  ],
  "codeWheel-canvas",
  wheelWidth);

let creativityWheel = makeWheel(
  [
	"music",
	"sound",
	"dance",
	"photography",
	"painting",
	"drawing",
	"textiles",
	"film",
	"sculpture",
	"creative writing",
	"memes",
  ],
  "creativityWheel-canvas",
  wheelWidth);

let cultureWheel = makeWheel(
  [
	"privacy",
	"ethics",
	"wealth distribution",
	"climate change",
	"work-life balance",
	"social media use",
	"immigration",
	"tolerance",
	"food security",
	"world peace"
  ],
  "cultureWheel-canvas",
  wheelWidth);
</script>

## workshop goals

how can we teach computing?

how do we inspire & motivate _everyone_ to make, and in doing so, to learn?

what are the opportunities of the c/c/c framing? what are the problems?
