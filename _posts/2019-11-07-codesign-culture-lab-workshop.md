---
title: code/creativity/culture curriculum design workshop
tags: reimagine ccc
hidden: true
---

Is it possible to learn about algorithms by writing poetry about wealth
inequality? How about commenting on social media use via sculptures built using
cybersecurity tools and concepts? Furthermore, is it possible to design an
assessment task which encourages deep technical work and honest cultural
reflection in producing a genuinely interesting creative outcome?

This workshop will bring together folks from all points of the
code/creativity/culture compass to design a _real_ assessment task for the c/c/c
studio creative code outreach program. In fact, it _needs_ a diverse range of
voices to work properly. So if you've got thoughts and ideas about
CS/Engineering curriculum design, the arts, and life within the socio-technical
assemblage of our present age, then come along and have your say!

This workshop is part of the [CoDesign Culture
Lab](https://cecs.anu.edu.au/events/event-series/codesign-culture-lab)---title
TBC. If you're coming to the culture lab and you'd like to be part of the
workshop, [get in touch](mailto:ben.swift@anu.edu.au) 😊

{% include toc.html %}

## Workshop timeline

- **9:00**: intro---what is the c/c/c studio
- **9:20**: group formation & ice-breakers

---

- **9:30**: spin the wheel(s)!
- **9:45**: [group work session 1](#group-work-session-1) (assessment item spec)
- **10:30**: present your assessment item spec to workshop

---

- **11:00**:  break (morning tea)

---

- **11:30**: [group work session 2](#group-work-session-2) (assessment criteria)
- **12:00**: present your assessment criteria to the workshop
- **12:15**: wrap-up

## Brief

You're a curriculum designer for the c/c/c studio! Welcome aboard.

**Today's task**: in groups, come up with a assessment[^assessment] task which
explores a _problem_ through a creative _process_ using a particular _tool_.

[^assessment]:
    you can think of it as an assignment, but that word has some baggage, so
	just think of it as a description of a thing which a student must submit
	which will be evaluated on whether it's a good thing

At the end of this workshop, your group will produce (and present to the rest of
us) two things:

- an assessment spec document: brief description & motivation, learning
  outcomes, any specific constraints or requirements on either the deliverable
  or the process

- a set of assessment criteria which will be used to assess the submissions for
  your assessment

However, you don't get to pick the _problem_/_process_/_tool_ triad which forms
the basis for your assessment task. Instead, we'll spin the
code/creativity/culture wheels and let fate[^fate].

[^fate] well, the PRNG in your web browser, anyway

## Let's spin the wheels![^winwheel]

[^winwheel]: wheels powered by [Winwheel.js](http://dougtesting.net/home) by Douglas McKechie

<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
{% asset js/Winwheel.js %}
{% asset js/ccc-workshop-wheels.js %}

<style>
.wheelIndicator {
  width:100%;
  font-size:6em;
  text-align:center;
  margin-bottom:-0.3em;
}

.wheelResult {
  font-size:2em;
  margin-bottom:1em;
}
</style>

### code

The _tool_ (or class of tools) which the students need to leverage in their
creative response. This is deliberately broad---you can (and should) narrow it
down in _your_ assessment task spec.

Note: one other way to frame this is this is the skill/concept that you want the
students to learn (perhaps surreptitiously) in _doing_ the assessment task.

<div class="wheelIndicator">⧨</div>
<canvas id="codeWheel-canvas" width="800" height="600" onclick='startSpin(codeWheel);'>
</canvas>

{:.wheelResult}

_code_ wheel: <strong><span class="codeWheel-canvas-result"></span></strong>

<script>
// based on a (slightly tweaked) version of the ACM BoK 2016
let acmBoK2016 = [
  "Circuits & Electronics",
  "Computing Algorithms",
  "Computer Architecture",
  "Digital Design",
  "Embedded Systems",
  "Computer Networks",
  "Information Security",
  "Signal Processing",
  "Systems & Project Eng.",
  "Software Design"
];

// these ones pulled out of Ben's arse
let benCodeConcepts = [
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
]

let codeWheel = makeWheel(benCodeConcepts, "codeWheel-canvas");
</script>

### creativity

The creative _process_ (the medium) through which the student will explore the
problem.

<div class="wheelIndicator">⧨</div>
<canvas id="creativityWheel-canvas" width="800" height="600" onclick='startSpin(creativityWheel);'>
</canvas>

{:.wheelResult}

_creativity_ wheel: <strong><span class="creativityWheel-canvas-result"></span></strong>

<script>
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
  "creativityWheel-canvas");
</script>


### culture

The _problem_ facing our culture/society to explore through the chosen tool &
process.

<div class="wheelIndicator">⧨</div>
<canvas id="cultureWheel-canvas" width="800" height="600" onclick='startSpin(cultureWheel);'>
</canvas>

{:.wheelResult}

_culture_ wheel: <strong><span class="cultureWheel-canvas-result"></span></strong>

<script>
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
  "cultureWheel-canvas");
</script>

{:.wheelResult}

_assessment task theme:_

<p class="hl-para wheelResult">

learning about <strong><span
class="codeWheel-canvas-result">____</span></strong> by exploring <strong><span
class="cultureWheel-canvas-result">____</span></strong> through <strong><span
class="creativityWheel-canvas-result">____</span></strong>

</p>

## Group work session 1: preparing an assessment spec {#group-work-session-1}

Now that you've spun the wheel, you've got a context in which to come up with a
specific assesssment task. You might be thinking that the c/c/c wheels left you
with a pretty broad scope---and you'd be right---your group's job is to narrow
this down into a specific task which is tractable for your intended audience of
students.

### Things to think about

- the target age/background/etc of the students is up to you---you could choose
  early high-school one-off workshop, year 11/12 extension program (i.e. the
  c/c/c studio), first-year assignment at uni, graduate-level coursework, etc.

- in plain language, what do you want a student to learn through the process of
  completing your assessment task? (that will help with coming up with some
  learning outcomes)

- how might the _tool_ and the _process_ shape the responses to the problem? can
  you use this to your advantage in encouraging students to attain the learning
  outcomes?

- how are you going to constrain the scope of your task so that it supports
  students from a wide range of backgrounds/abilities?


## Group work session 2: articulating the assessment criteria {#group-work-session-2}

### Things to think about

- what would an _excellent_ submission look like? what would a
  borderline-acceptable (e.g. a bare pass) submission look like?

- the problems (from the culture wheel) are _not solvable through a single
  assessment task_, so don't make that the criteria---instead, you want students
  to explore & understand the problem, process & tool more deeply

### Presenter bio

Dr Ben Swift is a Senior Lecturer in the ANU Research School of Computer Science
(RSCS). As the leader of the code/creativity/culture (c/c/c) research group,
Ben's goal is to create spaces for talking about the way that code (software),
creativity (especially the arts) and culture (life) intersect in the modern
world. Ben's research contributions range from traditional Computer Science
(digital multimedia, web technologies and human-computer interaction) through to
invited livecoding (live code-based music performance) performances and
multimedia artwork installations.

In 2019 Ben was awarded one of the inaugural _Reimagine Fellowships_ to develop
the **c/c/c studio**, an ANU Extension outreach program which will teach
computer science to pre-tertiary students through making art, music and other
cool things with computers. The c/c/c studio will also provide a supportive
community in which a new generation of people can learn, create, and
share---unlocking the latent potential in students who never knew their diverse
interests (especially in the arts & music) could be used in engineering and
computing.

https://cs.anu.edu.au/code-creativity-culture/
http://benswift.me
