---
title: "The road to COMP4020: the core mechanic"
tags: [comp4020, teaching]
---

::: info

This post is part of a series I'm writing as I develop
[COMP4020/8020: Rapid Prototyping for the Web](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web).
See [all posts in the series](/blog/tag/comp4020).

:::

Game designers talk about "the core mechanic"---the one repeating loop that
players engage with over and over, the thing that has to feel _right_ or nothing
else matters. In COMP4020, (the plan is) that loop is the weekly studio session.

## The loop

Each week (apart from the first and the last) follows the same cycle. There's a
lecture and office hours and the usual stuff as well, but this is the heart of
the course:

1. students receive a **provocation**---a brief, open-ended prompt that they
   respond to by building a working web-based prototype, due before their next
   studio session
2. a set of automated CI smoke checks verify that each prototype basically works
   (does it 200 OK on a few pre-agreed routes? does the build pass? whatever
   makes sense for that stage of the course)
3. in the studio session itself, students interact with each other's prototypes,
   followed by a tutor-facilitated feedback session covering the prototype
   itself, the agentic development process behind it, and what the student was
   going for in light of the provocation

Provocation, prototype, feedback; repeat for ten weeks.

## The art-school model

This is basically an
[art-school crit](https://en.wikipedia.org/wiki/Critique#Art_and_design) adapted
for software. Students bring their work-in-progress, the group engages with it,
and then there's a structured conversation about what's working, what isn't, and
why. It's a model that privileges _making_ over _talking about making_, and it
treats the artefact---the actual running prototype---as the centre of the
discussion.

I've run this kind of studio model before, in the **ANU Laptop Ensemble** course
(which evolved into
[Sound and Music Computing](https://programsandcourses.anu.edu.au/2026/course/COMP4350)
under the awesome [Charles Martin](https://charlesmartin.au/)). In that course,
students brought their sonic creations each week, performed them for each other,
and gave feedback in a facilitated session, which included remixing and building
upon all the pre-prepared submissions. The parallels are pretty direct---swap
"musical instrument" for "web prototype" and "sonic palette" for "agentic
workflow" and you're most of the way there.

The model can be intimidating at first. From week two onwards, students are
simultaneously showing their own work-in-progress _and_ giving feedback on
others'. But COMP4020 will have later-year students, and with careful
facilitation it I reckon it'll work really well. The awkwardness fades fast, and
what replaces it is a genuine community of practice---people who share a
vocabulary, who've seen each other's failures and successes, and who can have
informed conversations about what "good" looks like (because that's the key
question in this type of agentic software development course).

## Studio groups

Each studio group will have around 20 students, led by an experienced
tutor.[^tutor] The tutor's job isn't just to run the session---they're the one
doing the facilitation that makes the whole thing work. They need to know when
to push, when to let a conversation breathe, and when to redirect a critique
that's veering into unhelpful territory.

[^tutor]:
    "Tutor" in the Australian university sense---usually a PhD student who leads
    small-group teaching sessions.

There'll also be a small, marked-in-class component assessed by the tutor each
week. Nothing worth a huge amount---just enough so that students have skin in
the game. The point isn't to create anxiety; it's to create _investment_. If you
know you're going to demo your work and discuss your process, you'll actually do
the work (a point which I've seen successfully validated across several years of
Laptop Ensemble courses). And if you're going to give feedback to someone else,
you'll engage with their prototype properly rather than just clicking through
it. And in general our students are cool and nice and can be trusted not to be
arseholes to each other.

## Process _and_ product

One thing I want to emphasise: the feedback covers both the prototype (the
product) and the agentic development process that produced it. This maps onto
the week's lecture content, where students learn about different aspects of
working with LLM agents for software development.

So the studio session isn't just "does your app work?"---it's "how did you get
here, what did you try, what did the agent do well, where did you have to
intervene, what infrastructure/harness did you need to build around it, and what
would you do differently?" The goal is for students to develop a sophisticated,
critical understanding of agentic software development through repeated practice
and reflection, not just through reading about it.

The hope is that over these weeks the class collectively builds a shared
understanding of what good agentic software development looks like---both in
terms of the process and the resulting prototypes.

## Some provocations I'm tossing around

The course doesn't start until July, so I've got some time to flesh this out.
And I want these to be fun/thought-provoking. We have other (great!) courses for
building viable startups and software businesses; part of the point (and
opportunity) here is for students to do and make stuff that doesn't make sense
in a shark-tank-style business context.

Here are some ideas I've had. Honestly some of them I'm super excited about
while others are pretty... meh.

- build a blog (kindof boring, but might be the first one so they can use that
  for the rest of the course to share their reflective thoughts)

- pick an existing project and re-create it with a different tech stack (e.g.
  take a React app and re-create it as faithfully as possible in Vue)

- use a different students' previous submission as a starting port, pick a new
  feature to add and add it

- do something in the browser that Tim Berners Lee would disapprove of

- make a js/ts library with doco and how-to guides for both LLMs and humans

- build a thing (any thing) and then tell the story of it's development by
  dramatising the git history in the style of your favourite Hollywood director

- make and present a bunch of (code-based) visual identity elements, e.g. a
  brand identity and marketing website for a fictional product of your own
  invention

- create a prompt to make a simple html page which will be judged Elo-style
  against a rubric vs all others (we can then one-shot them in class and do the
  comparisons)

- build a website for a nightmare client, and develop an agentic workflow to
  ameliorate the difficulty of dealing with them somehow

- write a spec for evaluating a web protytype with an LLM

- use oblique strategies to implement a static website

- describe the uni system that you hate dealing with the most, and build a
  prototype for a replacement system that's just heaps more awesome

- write up a design brief for a simple website that you think is LLM/agent-proof
  (i.e. for which Claude Code wouldn't be useful at all)

- pick one of the crazier "agentic workflows" you can find online (e.g.
  [Gas Town](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04))
  and commit to it for a week to build something, then write up a blog post
  about it

- create the website for a public awareness campaign about the dangers of
  falling in love with chatbots

- create an online resource pack for an offline activity of your choosing

- create a datavis website for a dataset that you think should be better
  known/understood
