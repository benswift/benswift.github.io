---
title: 'The road to COMP4020: climbing the "good" gradient'
tags: [comp4020, teaching]
---

::: info

This post is part of a series I'm writing as I develop
[COMP4020/8020: Rapid Prototyping for the Web](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web).
See [all posts in the series](/blog/tag/comp4020).

:::

Designing any class involves a tension between teaching abstract (and hopefully
timeless) principles and concrete skills. As an educator (especially in a
tertiary setting) it's easy to jump to saying the abstract principles are key;
but even here
[experts can disagree](https://bsky.app/profile/shriram.bsky.social/post/3mf7i5vur5s2r).

I feel this tension especially in the design of COMP4020. Not just for
philosophical/pedagogical reasons, but also because with this stuff things are
changing _so fast_ (the og terminal-based agentic coding tool wasn't even
released a year ago). In planning for a class that doesn't start for five months
it seems foolish to index too heavily on the specifics of which
tools/models/workflows are working best right now.

I don't think this is because I think the abstract/timeless is better or more
pure than the concrete. But for now it's where my focus is.

One thought that I keep returning to as an increasingly heavy user of agentic
coding tools (I'm at
[level 6](https://justin.abrah.ms/blog/2026-01-08-yegge-s-developer-agent-evolution-model.html)
with a bullet) is that producing stuff is easy, knowing whether said stuff is
**good**[^good] is still hard. The best stuff I've read and seen on effective
use of coding agents all tackles the slippery question of how to define what
**good** is, and how to ascend the **good** gradient from the current state of
the code.

[^good]:
    I don't want to go down the full Platonic rabbit hole, but the discerning
    reader will pick up what I'm putting down here.

With that in mind, and also referencing my "weekly crit sessions"
[core mechanic post](/blog/2026/02/20/comp4020-the-core-mechanic), I think the
core principles I want to teach are around designing feedback loops (at multiple
scales) to help guide us towards the good. If **good** is a scalar field over
the space of possible codebases, then ∇**good**---the direction of steepest
ascent---is **the better**. And the feedback loops are how we compute it.

In particular, there are three important feedback loops in agentic coding:

1. the loop between the code and the harness (e.g. Claude Code); this is tight,
   and only occasionally requires human intervention

2. the loop between the human developer and the software artefact; how quick and
   easy is it to see the WIP in a web browser, to compare different alternative
   designs or approaches etc. and then to make (considered) changes to the code
   and see their effects

3. the loop between the human developer and their software and the "community of
   use" in which it will be deployed, shared and enjoyed

<svg class="feedback-loops" width="100%" viewBox="0 0 500 480" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer ring: human ↔ community -->
  <path d="M 452 256 C 458 138, 372 54, 248 58 C 124 62, 44 142, 48 262 C 52 382, 132 466, 252 468 C 372 470, 446 376, 452 256 Z"
        class="ring ring-outer" fill="none" stroke-linecap="round" stroke-linejoin="round"
        transform="rotate(1.5, 250, 260)"/>
  <!-- Middle ring: human ↔ artefact -->
  <path d="M 384 254 C 388 176, 330 124, 252 120 C 174 116, 114 180, 118 260 C 122 340, 178 398, 254 402 C 330 406, 380 334, 384 254 Z"
        class="ring ring-middle" fill="none" stroke-linecap="round" stroke-linejoin="round"
        transform="rotate(-1, 250, 260)"/>
  <!-- Inner ring: agent ↔ code -->
  <path d="M 314 256 C 316 224, 288 196, 252 194 C 216 192, 186 226, 188 260 C 190 294, 218 324, 252 326 C 286 328, 312 288, 314 256 Z"
        class="ring ring-inner" fill="none" stroke-linecap="round" stroke-linejoin="round"
        transform="rotate(2, 250, 260)"/>
  <!-- Labels in top bands between rings -->
  <text x="250" y="96" text-anchor="middle" font-size="15" class="loop-label label-outer"
        transform="rotate(-0.8, 250, 96)">human ↔ community</text>
  <text x="250" y="168" text-anchor="middle" font-size="15" class="loop-label label-middle"
        transform="rotate(1.2, 250, 168)">human ↔ artefact</text>
  <text x="250" y="264" text-anchor="middle" font-size="15" class="loop-label label-inner"
        transform="rotate(-0.5, 250, 264)">agent ↔ code</text>
</svg>

None of these ideas are new, either in software development (Steve Tanimoto,
Bret Victor, and _many others_ have made similar points). Heck, I work at a
School of Cybernetics---so good'ol Norbert and Margaret would be nodding sagely
along with my musings about feedback-driven behaviour.

But it'll be a helpful
way<sup>[[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed)]</sup>
of structuring the actual nuts-and-bolts of teaching students how to use these
tools effectively, whatever the SoTA is in July-Nov 2026. For example:

- level 1 is where type systems, linters, automated testing, etc lives;
  scaffolding in or around your codebase to give the agent direct and instant
  feedback about whether their changes are good

- level 2 is where browser and hot-reloading and stuff like REPLs (because
  lispers have always been right about that) comes in; when the coding agent
  comes back to you and says "Done! What do you think?" you need to be able to
  poke around and see whether it's good and what direction to prompt it in next
  to get there

- level 3 is where the weekly crit sessions shine; software doesn't exist in
  isolation, and whether your web app is good requires an understanding of (and
  feedback from) a community of taste and practice whose opinions and feedback
  you care about (and also an instructor who will assess it; but I hope that
  students make good things because good and beautiful things should exist, not
  just so they'll get a good grade)

I'm even thinking about structuring the syllabus around these levels; not that
we'd do all level 1, then all level 2, then all level 3, but that at least the
lectures and other readings would make clear where the different things we were
studying fit into this broader framework.

<!-- styles for the feedback loops SVG (light/dark mode) -->
<style scoped>
.feedback-loops {
  .ring { stroke-width: 2.5; }
  .ring-outer { stroke: #6366f1; }
  .ring-middle { stroke: #2a9d8f; }
  .ring-inner { stroke: #e07050; }
  .loop-label { font-weight: 600; }
  .label-outer { fill: #4f46e5; }
  .label-middle { fill: #1f7a6f; }
  .label-inner { fill: #c85a3a; }

  .dark & {
    .ring-outer { stroke: #a5b4fc; }
    .ring-middle { stroke: #80cbc4; }
    .ring-inner { stroke: #ffab91; }
    .label-outer { fill: #a5b4fc; }
    .label-middle { fill: #80cbc4; }
    .label-inner { fill: #ffab91; }
  }
}
</style>
