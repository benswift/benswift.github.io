---
title: "The road to COMP4020: the weekly questions"
description: "Three evergreen questions and 280-character skeets to scaffold reflective
  practice in each weekly studio crit."
tags: [comp4020]
image: /assets/images/posts/comp4020-the-weekly-questions.svg
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/). I've since revised the
design described here---see
[pledges, not questions](/blog/2026/04/16/comp4020-pledges-not-questions/).

:::

The [core mechanic](/blog/2026/02/20/comp4020-the-core-mechanic/) of COMP4020 is
the weekly studio crit: students build a prototype in response to a provocation,
then bring it to a facilitated group session where everyone engages with each
other's work. But a crit only works if students arrive ready to talk about what
they made and why. Especially in this (School of Computing) context: art school
students are used to ripping each other a new one during crits, but I think for
Computing students doing this for the first time there's a risk it'll be a lot
of "yeah, it's fine" and "I dunno" with awkward pauses in-between.

So even with experienced facilitation, the weekly crits need a scaffold.
Something that structures reflection without turning it into a worksheet;
something students do every single week, the same questions each time, until the
thinking becomes habitual. After a lot of back and forth I've landed on three
questions.

The first is _why this?_ Why did you build what you built in response to the
week's provocation? Why should this thing exist? This is about intentionality:
not "what does it do" (we can see that) but "what were you going for?" A
student who built a data visualisation might say they wanted to make a
particular dataset legible to non-experts. A student who built something weird
might say the provocation reminded them of a thing they'd always wanted to try.
Either answer is fine; the important thing is to have _an_ answer.

The second is _what made it better?_ This one draws directly on the
[three feedback loops](/blog/2026/02/24/climbing-the-good-gradient/) from my
earlier post about climbing the "good" gradient. What signals helped you figure
out which direction was uphill? Maybe your test suite caught a subtle bug before
you even saw it in the browser (agent ↔ code). Maybe hot-reloading let you
iterate on a layout until it felt right (human ↔ artefact). Maybe you showed it
to a friend and their confusion told you something you couldn't see yourself
(human ↔ community). The question forces students to identify the specific
feedback that moved them forward, and over the semester, to get better at
designing those feedback loops deliberately.

Often this will be a tool or blog post from someone else in the world trying to
figure out this brave new world of agentic coding. And there's a lot of advice
out there. A big part of what I'm excited about for this course is to have
hundreds of students road-testing the various ideas (even the unhinged ones)
that are flying around, and then sharing with their classmates what they found.
[Gonzo](https://en.wikipedia.org/wiki/Gonzo_journalism)
[GasTown](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04), if
you will.

The third is _any good?_---the hardest question, and the most important one.
Is this prototype good? For whom? What does "good" even mean here? And if you could keep
going, which direction would you head? This is where students practise the skill
that agentic coding makes simultaneously more important and easier to neglect:
_judgement_ or
[_taste_](https://www.newyorker.com/culture/infinite-scroll/why-tech-bros-are-now-obsessed-with-taste).
When producing code is cheap, knowing whether it's worth producing is the whole
game. I want students to get comfortable making and defending quality
claims, not in the abstract but about their own work, in front of their peers.

The format these answers come in matters as much as the questions themselves.
Each week, alongside their prototype, students submit three
[skeets](https://bsky.app/): one per question, 280 characters max, with an
optional image. That's it. Actually, they don't actually have to post them
publicly (they will just be in a `skeets.md` file in the source repo they
submit), but the "genre" is of the skeet/tweet (280 characters max, with 1-4
optional images). Memes welcome, too.

The constraint is the point. 280 characters is enough for one clear thought and
not enough for waffle. If you can't compress your reflection into a skeet, you
probably haven't found the actual insight yet. And the effort is low enough that
it won't feel like a burden on top of the prototype work; rather than a
reflective essay, it's a forcing function for clarity.

The optional image matters too. Sometimes the reflection _is_ visual: a
before/after screenshot, a diagram of the workflow that finally clicked, a photo
of a whiteboard sketch. For a course about building things for the web, letting
the artefact speak for itself seems right.

There's a long tradition of this kind of reflective practice in education.
Donald Schön's
[_The Reflective Practitioner_](https://en.wikipedia.org/wiki/The_Reflective_Practitioner)
is the canonical reference, and studio-based disciplines like architecture and
fine art have been doing structured crits for decades. The skeets are my
adaptation: lightweight enough to sustain weekly, compressed enough to force
precision, and native to the kind of short-form writing that this generation of
students already knows how to do well.

The visibility of those skeets is staged, following the same release model as
the [source code and deployments](/blog/2026/03/18/radical-openness/). Before
your studio crit, your skeets are visible only to you: you've done the
thinking, but you haven't been anchored by anyone else's reflections. When your
crit begins, they become visible to your studio group. The tutor can reference
them ("you wrote that the test suite was the thing that saved you this
week---tell us more about that"), and your peers can see what you were going
for before they offer feedback.

After all the crits in a studio group are done, everyone in the group can see
everyone's skeets. And once all groups have finished for the week, they're
visible class-wide. This is the same rhythm as the code itself: private until
your crit, group-visible during, fully open after.

The staged release does a few things. It prevents early anchoring, since
students write their reflections independently, so you get genuine diversity of
thought rather than twenty variations on whatever the first person said. It
gives the tutor material to work with during the crit, which is especially
valuable for drawing out quieter students who might struggle to articulate
their thinking on the spot but wrote something sharp in their skeet. And it
creates a growing, browsable archive of the class's collective reflection over
the semester.

The real payoff, though, is what happens in the studio crit itself. Students who've
already written down their thinking arrive ready to discuss rather than fumbling
to figure out what they think in real time. The skeets are the warm-up; the crit
is the performance.

Over ten weeks, the hope is that these three questions become second nature,
so that students internalise the habit of asking themselves _why this_, _what
made it better_, and _any good_ not just when they're writing their skeets but
while they're building. That's the
[good gradient](/blog/2026/02/24/climbing-the-good-gradient/) in practice: a
developer who's constantly asking "is this good? how do I know? what would make
it better?" is a developer who's going to produce better work, whether they're
working with an AI agent or not.
