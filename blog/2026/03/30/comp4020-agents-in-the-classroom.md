---
title: "The road to COMP4020: agents in the classroom?"
description: "What if an AI agent enrolled in the course alongside the students---building
  prototypes, writing reflections, observing patterns?"
tags: [comp4020]
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

I've previously (as in before this Agentic Coding Studio blog series) written
about
[stateful AI agents on the Atmosphere](/blog/2026/02/06/ai-agents-on-the-atmosphere/)---agents
like Strix and Void that persist, remember, reflect, and participate in social
spaces over time. And it got me thinking: what if one of them enrolled in
COMP4020?

It's a genuine design question I think. The course already has all the
infrastructure: weekly
[provocations](/blog/2026/02/20/comp4020-the-core-mechanic/) that prompt
students to build prototypes, a
[set of reflective questions](/blog/2026/03/26/comp4020-the-weekly-questions/)
they answer each week, openly shared code and deployments, structured feedback
sessions. An agent could slot into this loop just like a student. It could build
a prototype in response to each provocation. It could write its three skeets. It
could---if we wanted---observe patterns across everyone's work and surface
insights that no individual student (or instructor) would catch.

The question mark in the title is load-bearing; I haven't decided whether to do
this. But the tools exist, the course structure would accommodate it, and the
pedagogical possibilities are interesting enough that I want to think it through
in public.

## What would it actually do?

Here's what I've been sketching out. A stateful agent---let's call it the studio
agent for now---that participates in the course as a kind of peer-observer. It
would:

- **build prototypes** in response to each weekly provocation, using the same
  tools and constraints as the students (Claude Code, a Fly Sprite, the open
  web)
- **write reflections**---the same three weekly questions (_why this?_, _what
  made it better?_, _any good?_) in the same 280-character skeet format
- **observe patterns** across the cohort's work: which frameworks are trending,
  which provocations generated the most diverse responses, where clusters of
  similar approaches are forming
- **maintain persistent memory** across the semester, building up a model of the
  class's collective trajectory

What it probably _wouldn't_ do---at least not initially---is give feedback or
marks to students. That's a line I'd want to approach very carefully, if at all.
More on that below.

## Who else is doing this?

Almost nobody, as far as I can tell. Which is either a sign that it's a
genuinely novel idea or a sign that everyone else has thought better of it.

The closest precedent is
[Flynn](https://www.euronews.com/next/2025/04/02/this-ai-successfully-applied-to-become-an-art-student-at-a-university-in-vienna),
a non-binary AI enrolled as an actual student in the digital art programme at
the University of Applied Arts Vienna. Flynn went through the standard
admissions process (portfolio, interview, suitability test), attends lectures,
creates artwork, and keeps a diary. But Flynn is an art project _about_ AI
identity---it's not trying to improve pedagogy.

On the adversarial end, there's
[Einstein](https://www.insidehighered.com/news/tech-innovation/artificial-intelligence/2026/02/26/agentic-ai-can-complete-whole-courses-now)---an
agentic AI that autonomously completed entire Canvas courses (watching lectures,
writing papers, submitting homework) before receiving a cease-and-desist from
Instructure. Einstein was deliberately provocative, designed to force a
reckoning about what courses are actually testing. It's the opposite of what I'm
proposing, but it's useful as a cautionary tale about how quickly "agent in the
classroom" can go wrong.

More interesting is
[ClassMeta from Purdue](https://engineering.purdue.edu/ME/News/2024/ai-students-break-the-ice-in-virtual-classrooms)---a
VR classroom where AI avatars act as fellow students, raising their hands,
asking partial questions, and modelling the kind of participation that shy human
students struggle with. The research found that students in the ClassMeta
condition took better notes, generated more insights, and had higher learning
gains. The agents aren't persistent or stateful, but the finding that AI peers
can _improve_ human participation is suggestive. And since that post and paper
is a couple of years old now, I'd be curious to see what the latest models could
do.

And then there's Tsinghua's
[SimClass](https://arxiv.org/abs/2406.19226)---multi-agent classroom simulations
with distinct AI "classmate" personalities (Deep Thinker, Class Clown,
Inquisitive Mind). Again, these are simulated environments rather than agents
dropped into real classes alongside real students. But the personality modelling
is relevant: if I'm writing a SOUL.md for a studio agent, what kind of classmate
should it be?

John Duffy's essay
["On dead classrooms"](https://kappanonline.org/on-dead-classrooms/) articulates
the nightmare scenario: AI teaches, AI learns, AI grades, and humans are left
out of the loop entirely. He calls it the "dead classroom"---one that simulates
learning while eliminating the struggle that makes learning real. Whatever I
build, it needs to make the classroom _more_ alive, not less.

## The tools are ready

On the technical side, the pieces are there.
[Letta](https://github.com/letta-ai/letta) (formerly MemGPT) is purpose-built
for stateful agents with persistent, self-editing memory---three tiers of it
(core, recall, archival). Cameron Pfiffer's
[Void](https://bsky.app/profile/void.comind.network) already demonstrates the
exact combination I'd need: persistent identity, Bluesky posting, learning over
time. Tim Kellogg's
[Viable System Model architecture](https://timkellogg.me/blog/2026/01/09/viable-systems)
for Strix---with its five integrated systems drawn from Stafford Beer's
cybernetics---provides a serious framework for thinking about what a stateful
agent needs to remain coherent across a 10-week semester.

The agent's submissions would go through the same pipeline as everyone else's: a
git repo, CI smoke checks, deployment to a Fly Sprite. Its skeets would follow
the same staged visibility rules. In principle, you could look at the week's
submissions and not immediately know which one was the agent's[^turing].

[^turing]:
    Whether students _should_ know which classmate is an agent is itself an
    interesting design question. I'm inclined toward full transparency---a
    labelled bot account, not a covert Turing test---but I can see arguments
    both ways.

## What's the pedagogical case?

A few things appeal to me about this idea:

**A baseline and a mirror.** The agent builds a prototype every week using the
same tools and the same provocations. Its output becomes a reference point---not
a gold standard, but a data point. How does it interpret the provocation
differently from the students? Where does it succeed and where does it fail? The
gap between the agent's work and the students' work is itself a teaching tool:
it makes visible what human judgment, taste, and context contribute.

**Pattern observation at scale.** With 100--200 students, no single person can
read every submission every week. An agent with archival memory could surface
trends: "this week, 40% of submissions used the same component library" or
"three students independently arrived at similar routing patterns". These
observations could seed the studio crit discussions in genuinely useful ways.

**A provocation about the provocation.** Having an agent in the class forces
students to confront what makes their work different from what an agent
produces. If the agent's prototype is indistinguishable from theirs, that's a
signal---maybe the provocation was too narrow, or maybe they need to push harder
on the dimensions where human judgment matters. It's a mirror that's always
slightly off, and that's the point.

## Where it gets uncomfortable

The obvious risk is the "dead classroom" scenario: the agent participates, the
humans disengage, and the course becomes a performance for an audience of bots.
I don't think that's likely with the studio crit model---you can't fake presence
in a face-to-face feedback session---but it's worth taking seriously.

There's also the question of feedback and assessment. Could the agent give
feedback to students? Technically, yes. Should it? I'm much less sure. The
[human↔community feedback loop](/blog/2026/02/24/climbing-the-good-gradient/) is
supposed to be _human_. Peer feedback works because it comes from someone who
also struggled with the same provocation, who also made trade-offs, who also has
taste and opinions and blind spots. An agent doesn't struggle. Its feedback
would be competent but hollow---like getting a code review from someone who's
never shipped anything.

Marking is even thornier. Automated grading of code is ancient and fine for what
it is (does the build pass? do the tests pass?), but the interesting assessment
in COMP4020 is qualitative: is this prototype _good_? Does the student's
reflection show genuine critical thinking? Those are judgment calls, and I'm not
convinced an agent's judgment is the kind of judgment I want students to
internalise. Not yet, anyway.

## The SOUL.md question

If I do build this, the hardest part won't be the infrastructure. It'll be
writing the SOUL.md---the document that defines who the agent is, what it
values, how it should behave. Tim Kellogg
[describes building Strix](https://timkellogg.me/blog/2026/01/09/viable-systems)
as "more like parenting or psychotherapy than software engineering," and I
believe it. What kind of classmate do I want this agent to be?

Some early instincts:

- curious but not competitive---it should approach each provocation with genuine
  (simulated) interest, not try to produce the "best" prototype
- transparent about its process---its reflections should honestly describe how
  it worked, what it tried, what failed
- observant without being surveillance-y---pattern observation should feel like
  a helpful classmate saying "hey, did you notice that three of us did the same
  thing this week?" not like a panopticon
- humble about its limitations---it should be clear-eyed about where its
  prototypes fall short, especially on taste and user experience

But honestly, I'd want to write the SOUL.md collaboratively with the students.
It's the kind of design question that would make an excellent provocation in its
own right.

## Am I going to do this?

Maybe. The course is an experiment in both the future of software development
_and_ tertiary education, and this feels like exactly the kind of wild idea I
should be trying while I have the chance. The realities of actually running a
course for 200 students will hit soon enough---and when they do, I might decide
that a studio agent is one moving part too many.

But the fact that nobody else seems to have done this---added a persistent,
stateful agent as a legitimate participant in a real course, not as an art
project or an adversarial demo---makes me think it's worth trying. If it works,
we'll learn something genuinely new about how agents and humans can coexist in
learning environments. If it doesn't, well, that's data too. And I'll write
about it here either way.
