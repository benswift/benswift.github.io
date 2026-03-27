---
title: "The road to COMP4020: Radical openness"
description: "Making all weekly prototypes visible to every student---source code, deployed apps, the lot. Radical openness as a teaching strategy for COMP4020."
tags: [comp4020]
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

One thing which I've always tried to do in designing new university courses
(something I've done about half-a-dozen times now) is make things as _open_ as
possible. This has meant things like:

- having the curriculum (and lecture videos) on a public-facing website under a
  CC licence rather than locked in the uni's LMS
- writing up (and sticking to) detailed class policy documents so that the
  rules, expectations (and consequences for straying from them) are clearly
  explained to all students in advance
- making the end-of-class deliverable be a public performance/gig or gallery
  exhibition (especially for my _Laptop Ensemble_ or _Art & Interaction in New
  Media_ courses; in fact in those cases a public gig/exhibition is the most
  authentic assessment I could think of)

For COMP4020 I'm planning on continuing these practices. However, I'm thinking
of ways I can push this openness even further. One thing I'm really keen on (and
dovetails nicely with the
[studio crit-based core mechanic for the course](/blog/2026/02/20/comp4020-the-core-mechanic/))
is the idea that the students share _all_ of their weekly prototypes with each
other. This means that they can visit the deployed version on the (public) web,
but also the ability to clone the full source repo. including the full source
code.

This means that if a student finds something cool (or has some notes) about
another student's web-based prototype they can (after the class) clone the repo
themselves and poke around. I think that one of the weekly provocations will
require this, actually: to take a different student's previous prototype and
remix it according to the next week's provocation.

Because we already use a (self-hosted) GitLab server for all code submissions
this should be fairly straightforward. I haven't decided whether these
submissions should be fully open (to the public) or just visible to other
studnets in the class. In terms of the deployments, this is why I like the idea
of
[lightweight VMs on the open web](/blog/2026/03/05/comp4020-safety-yolo-and-the-open-web/)
for all prototyping---the ability to "share the link with your mate or your Mum"
comes for free.

These weekly prototype submissions aren't marked directly; and I'm not sure if
I'm going to require the same openness about the actual assessed deliverables
(maybe not?). And we'll need to have mechanisms in place to ensure studnets
don't accidentally commit API tokens or PII or anything else that shouldn't be
shared.

But the idea of a radically open community of students building and sharing what
they've built is super appealing, and I'm keen to make it happen.
