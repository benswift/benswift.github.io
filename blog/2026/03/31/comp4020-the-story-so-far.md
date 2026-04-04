---
title: "COMP4020: the story so far"
description: "A catch-up post for the COMP4020 Agentic Coding Studio blog series---what the
  course is, how it works, and what's still unresolved."
tags: [comp4020, teaching]
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

I've written eight posts now about a course that doesn't start until July, and
it occurs to me that someone stumbling onto one of the later entries might
reasonably wonder what on earth I'm on about. So here's the quick version.

## The course

[COMP4020/8020 Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/)
is a new ANU course for Semester 2, 2026. The pitch: LLM-based coding agents
(e.g. [Claude Code](https://docs.anthropic.com/en/docs/claude-code)) are
genuinely powerful for web development, so let's teach students to use them
well---not by lecturing about prompting techniques, but by having them build and
deploy multiple working web prototypes over a semester. The course trains
judgement: when producing code is cheap, knowing whether it's _worth_ producing
is the whole game.

## The studio model

The
[distinctive design choice](/blog/2026/02/20/comp4020-the-core-mechanic/)---and
the thing I'm most excited about---is borrowing the crit model from art school.
Each week follows the same cycle:

1. students receive a **provocation** (an open-ended brief)
2. they build a working web prototype before their next studio session
3. in the session (~20 students per group), everyone interacts with each other's
   running apps, followed by a tutor-facilitated discussion

The crit covers both the product _and_ the agentic process that produced it. How
did you use the agent? Where did you have to intervene? What did you learn about
working this way?

I ran a similar model for years in the ANU Laptop Ensemble course---swap "web
prototype" for "musical instrument" and "agentic workflow" for "sonic palette"
and you're most of the way there.

## Reflective practice

To scaffold the crits---and because Computing students aren't used to ripping
each other's work apart the way art students are---each week students answer
[three questions](/blog/2026/03/26/comp4020-the-weekly-questions/) in
280-character "skeet" format:

- **Why this?** Not "what does it do" (we can see that) but what were you going
  for?
- **What made it better?** Which feedback loops---agent, human,
  community---actually moved you forward?
- **Any good?** The hardest one, and the most important: quality judgement,
  taste, and where you'd take it next.

The constraint forces clarity. If you can't compress your reflection into 280
characters, you probably haven't found the actual insight yet. The skeets follow
a staged visibility model---private until your crit, group-visible during, fully
open after---to prevent anchoring.

## Infrastructure as pedagogy

The [technical setup](/blog/2026/03/05/comp4020-safety-yolo-and-the-open-web/)
is designed so that students can let agents run freely without risk. Each week,
they work in a fresh, isolated cloud VM (something like a
[Fly.io Sprite](https://fly.io/docs/sprites/))---nothing personal on it, easy to
snapshot, easy to tear down. They run Claude Code in YOLO mode with no approval
prompts, push their code to a class GitLab server where CI smoke checks verify
the basics, and every prototype ends up live on the open web by default. Peers
don't review each other's code---they use each other's running apps.

This ties into the course's commitment to
[radical openness](/blog/2026/03/18/radical-openness/): students can see each
other's source repos, clone them, poke around, and remix each other's work. One
of the weekly provocations will probably require exactly that---take someone
else's previous prototype and build on it. The idea is that openness accelerates
learning in the same way it does in open source: you get better faster when you
can see how other people solved the same problem.

## The theory (such as it is)

Here's the honest part: nobody really knows the right way to do agentic coding
yet. I surveyed
[the emerging landscape](/blog/2026/03/30/comp4020-whats-the-theory-here/)---Regehr's
"zero degrees of freedom", Harper Reed's spec-driven development, Jesse
Vincent's Superpowers framework, the Deer Valley retreat consensus, Geoffrey
Huntley's [Ralph Loop](https://ghuntley.com/loop/)---and the
picture is of a field still finding its footing. Part of what excites me about
COMP4020 is that it's a distributed experiment: 100--200 students road-testing
these nascent theories and reporting back on what actually works.

## Open challenges

A few things I'm still wrestling with:

**Tool access.** Getting ~200 students onto frontier coding agents is a genuine
[logistics problem](/blog/2026/02/17/comp4020-sharp-tools/). Sponsored seats
from Anthropic or similar would be ideal; self-hosting open-weight models via
vLLM is the fallback. Neither is straightforward at this scale.

**The studio agent.** I've been exploring the idea of
[enrolling a persistent AI agent](/blog/2026/03/30/comp4020-agents-in-the-classroom/)
as a course participant---building prototypes, writing skeets, observing
patterns across the cohort. The question mark in that post's title is
load-bearing. The pedagogical possibilities are genuinely interesting (a
baseline, a mirror, a pattern observer at scale), but the "dead classroom" risk
is real and I haven't decided whether to actually do it.

**Assessing taste.** The course's core thesis is that judgement and taste are
the skills that matter most when code generation is cheap. But how do you assess
taste at scale, fairly, across ~200 students? The weekly skeets and studio crits
give tutors a lot to work with, but it's still qualitative assessment of a
quality that's hard to define.

**Transfer from art school.** The crit model works beautifully in art and music
education. Whether it transfers to CS students who've never done anything like
it is an open question. I think it will---my colleague Charles Martin has scaled
the studio crit model to large cohorts in his
[Sound and Music Computing](https://comp.anu.edu.au/courses/comp4350/) course
(formerly the _ANU Laptop Ensemble_), which gives me confidence it can work at
200 students too.

## The series so far

If you want the full picture, here's the reading order:

1. [Rapid Prototyping for the Web](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/)---the
   founding post, course description and learning outcomes
2. [Sharp tools](/blog/2026/02/17/comp4020-sharp-tools/)---the tool access
   problem
3. [The core mechanic](/blog/2026/02/20/comp4020-the-core-mechanic/)---the
   weekly loop and studio crit model
4. [Safety, YOLO, and the open web](/blog/2026/03/05/comp4020-safety-yolo-and-the-open-web/)---cloud
   VMs and infrastructure
5. [Radical openness](/blog/2026/03/18/radical-openness/)---sharing source code,
   deployed apps, and remixing each other's work
6. [The weekly questions](/blog/2026/03/26/comp4020-the-weekly-questions/)---reflective
   practice and skeets
7. [What's the theory here?](/blog/2026/03/30/comp4020-whats-the-theory-here/)---a
   survey of emerging agentic coding theories
8. [Agents in the classroom?](/blog/2026/03/30/comp4020-agents-in-the-classroom/)---the
   studio agent idea

The course starts in July. More posts to come as I figure out the rest.
