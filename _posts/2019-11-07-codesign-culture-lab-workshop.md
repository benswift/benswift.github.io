---
title: CoDesign Culture Lab workshop
tags: reimagine ccc
hidden: true
---

A workshop at the [CoDesign Culture
Lab](https://cecs.anu.edu.au/events/event-series/codesign-culture-lab)---title
TBC. If you're coming to the culture lab and you'd like to be part of the
workshop, [get in touch](mailto:ben.swift@anu.edu.au) 😊

{% include toc.html %}

## Brief

You're a curriculum designer for the c/c/c studio! Welcome aboard.

**Today's task**: in groups, come up with an assessment task which explores a
_problem_ through a creative _process_ using a particular _tool_. You don't get
to pick the _problem_, _process_ & _tool_ though---we'll let the wheel decide.

At the end of this workshop, your group will produce (and present to the rest of
us) two things:

- an assignment spec: brief description & motivation, any specific restraints or
  requirements, and 

- a set of learning outcomes / assessment criteria which will be used to assess
  the submissions for your assignment

### Things to think about...

- as for the age/background of the students, it's up to you---e.g. early
  high-school one-off workshop, year 11/12 extension program (i.e. the c/c/c
  studio), first-year assignment at uni, graduate-level coursework, etc.

- these problems are _not solvable in a single assessment task_, so don't make
  that the criteria---instead, you want students to explore & understand the
  problem, process & tool more deeply

- think: how might the _tool_ and the _process_ shape the responses to the
  problem? can you use this to your advantage in encouraging students to attain
  the learning outcomes?

- how are you going to constrain the scope of your task so that it supports
  students from a wide range of backgrounds/abilities?

## Workshop timeline

- **9:00**: intro---what is the c/c/c studio
- **9:20**: team formation

---

- **9:30**: spin the wheel(s)!
- **9:45**: group work---assignment spec
- **10:30**: present your assignment spec to workshop

---

- **11:00**:  break (morning tea)

---

- **11:30**: group work: learning outcomes/assessment criteria
- **12:00**: present your LOs/AC to the workshop
- **12:15**: wrap-up

## Let's spin the wheels![^winwheel]

{:.hl-para}

Note: all these lists are a work-in-progress.

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

{:.hl-para .wheelResult}

result: <strong><span class="codeWheel-canvas-result"></span></strong>

<script>
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

let benCodeConcepts = [
  "algorithms",
  "robotics",
  "Software Eng",
  "databases",
  "networks",
  "UI/UX design",
  "data analytics",
  "compilers",
  "operating systems"
]

let codeWheel = makeWheel(benCodeConcepts, "codeWheel-canvas");
</script>

### creativity

The creative _process_ (the medium) through which the student will explore the
problem.

<div class="wheelIndicator">⧨</div>
<canvas id="creativityWheel-canvas" width="800" height="600" onclick='startSpin(creativityWheel);'>
</canvas>

{:.hl-para .wheelResult}

result: <strong><span class="creativityWheel-canvas-result"></span></strong>

<script>
let creativityWheel = makeWheel(
  [
	"music",
   "dance",
   "photography",
	"sculpture",
	"creative writing",
	"meme"
  ],
  "creativityWheel-canvas");
</script>


### culture

The _problem_ facing our culture/society to explore through the chosen tool &
process.

<div class="wheelIndicator">⧨</div>
<canvas id="cultureWheel-canvas" width="800" height="600" onclick='startSpin(cultureWheel);'>
</canvas>

{:.hl-para .wheelResult}

result: <strong><span class="cultureWheel-canvas-result"></span></strong>

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
   "conflict"
  ],
  "cultureWheel-canvas");
</script>

<p class="hl-para wheelResult">
<em>assessment task theme:</em>

<br /><br />

exploring <strong><span
class="cultureWheel-canvas-result">____</span></strong> through
<strong> <span
class="creativityWheel-canvas-result">____</span></strong> using
<strong><span class="codeWheel-canvas-result">____</span></strong>

</p>

## notes

- give 30mins for presenting back

- what to do if someone in a group thinks the other "c"s are bullshit?

- what about arguments in the group at all?

- STS staff in SoS (Rob Ackland, Jenny Davis, Adrian McKenzie, Mindy Bruce, Matt
  Wade)

- do I want to invite some naysayers?

- in the task, provide very clear guidelines

- use the kind of template I'd use for curriculum design

- having Kim Blackmore (iLEAP fellows - ask Jez)

- invite Tony

- potential icebreaker: what's the best assessment task you've ever done (or
  set)

- invite specific people outside of the culture lab (cc reimagine@anu.edu.au)

### TODO by the end of the day

- photo
- blurb (1 para) - that's what will bring people in the door, pitch it to
  specific people
- bio
- list of people I want to invite specifically (both attendees and
  non-attendees)

### TODO by early next week

do I need:
- scribes? (inc. graphic scribes?)
- co-facilitators?
- materials?
- tech?
- tables/room configuration?
