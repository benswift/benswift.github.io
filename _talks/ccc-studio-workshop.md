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

<script src="{{ site.baseurl }}/assets/js/TweenMax.min.js" type="text/javascript"></script>
<script src="{{ site.baseurl }}/assets/js/Winwheel.js" type="text/javascript"></script>
<script src="{{ site.baseurl }}/assets/js/ccc-workshop-wheels.js" type="text/javascript"></script>

{% include slides/background-image.html image="images/talks/ccc-studio-workshop/mount-majura-bushland.jpg" %}

We acknowledge and celebrate the First Australians on whose traditional lands we
meet, and pay our respect to the elders past, present and emerging

{% include slides/background-image.html image="documents/ccc-curriculum-design-workshop/blog-post-url-qr-code.png" bgsize="contain" bgcol="black" %}

{% include slides/background-image.html image="documents/ccc-curriculum-design-workshop/CoDCL-5948.jpg" heading="welcome" bgsize="contain" bgcol="black" %}

{% include slides/background-image.html image="documents/ccc-curriculum-design-workshop/vikas-anand-dev-iMmlx_fCeWc-unsplash.jpg" heading="c/c/c untangled(?)" %}

The code/creativity/culture group (c/c/c) is a research group within the
Research School of Computer Science. Our goal is to create spaces for _talking_,
_thinking_ and _making_ about the way that **code** (software), **creativity**
(especially the arts) and **culture** (life) intersect in the modern world.

(from the [c/c/c website](https://cs.anu.edu.au/code-creativity-culture/))

{% include slides/youtube.html id="Sv4Y-UPqML8" %}

{% include slides/background-image.html image="images/posts/comp1720-mp-exhibition-2018-2.jpg" heading="the c/c/c studio" %}

an [ANU Extension](https://cs.anu.edu.au/code-creativity-culture/) program to
teach computer science to year 11 & 12 students through making art, music and
other cool things with computers

curriculum being developed right now (using
[COMP1720](https://cs.anu.edu.au/courses/comp1720/) & [COMP2710 Laptop
Ensemble](https://cs.anu.edu.au/code-creativity-culture/lens/) as a starting
point, but everything's up for grabs!)

first student intake (year 11 only) in 2021, first graduates in 2022

{% include slides/background-image.html image="documents/ccc-curriculum-design-workshop/med-badr-chemmaoui-ZSPBhokqDMc-unsplash.jpg" heading="today's workshop" %}

_your design brief for today_: in your group, create an assessment task which
teaches a particular **code** concept/tool by exploring a problem/challenge
facing our **culture** through a particular **creative** process/medium

it might be used in the c/c/c studio 😊

## timeline

| **9:00**  | intro & group formation                                                                                                                           |
| **9:30**  | [group work session 1]({% link _posts/2019-11-07-codesign-culture-lab-workshop.md %}#group-work-session-1) (assessment item spec) |
| **10:30** | break (morning tea)                                                                                                                               |
| **11:00** | presentations                                                                                                                                     |
| **11:30** | [group work session 2]({% link _posts/2019-11-07-codesign-culture-lab-workshop.md %}#group-work-session-2) (assessment criteria)  |
| **12:00** | presentations                                                                                                                                     |
| **12:15** | wrap-up                                                                                                                                           |

{% include slides/background-image.html image="documents/ccc-curriculum-design-workshop/joeri-romer-Xne1N4yZuOY-unsplash.jpg" heading="group formation" %}

look for the stickers on your table

**red**&nbsp;<span style="color:#eb4d4b;">⬤</span> = _code_

**blue**&nbsp;<span style="color:#3498db;">⬤</span> = _creativity_

**yellow**&nbsp;<span style="color:#f1c40f;">⬤</span> = _culture_

**purple**&nbsp;<span style="color:#8e44ad;">⬤</span> = 💩

each group must have _all_ of the stickers between them

## your task today

your group needs to produce a document describing your assessment item,
including:

- description
- background/motivation
- learning outcomes
- spec
- resources
- faq

there are lots of details on the workshop content page

---

<style>
.wheelIndicator {
  font-size:2em;
  text-align:center;
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
let container = document.getElementsByClassName("slides")[0];
let wheelWidth = parseFloat(window.getComputedStyle(container).width)/7;

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

{% include slides/background-image.html image="documents/ccc-curriculum-design-workshop/shapelined-qawemGipVPk-unsplash.jpg" heading="workshop goals" %}

**think**: how do we inspire & motivate _everyone_ to make, and in doing so, to learn?

**talk**: what are the opportunities of the c/c/c framing? what are the problems?

**make**: produce an _actual thing_

{% include slides/impact.html %}

[let's go!]({% link
_posts/2019-11-07-codesign-culture-lab-workshop.md %}#group-formation)
