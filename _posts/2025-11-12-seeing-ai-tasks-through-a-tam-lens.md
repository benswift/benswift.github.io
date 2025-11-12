---
title: Seeing AI tasks through a TAM lens
tags: ai
---

Here's something that's been bugging me about AI adoption research: we keep
asking "do you use ChatGPT?" when we should be asking "for which specific
tasks?"

The
[Technology Acceptance Model](https://en.wikipedia.org/wiki/Technology_acceptance_model)
(TAM) has been successfully applied to understand LLM adoption---surveys confirm
that perceived usefulness and ease of use predict whether people adopt these
tools. But here's the problem: these studies treat adoption as a
technology-level decision rather than examining the specific tasks where these
tools actually prove valuable.

This misses something fundamental. A developer might find an LLM invaluable for
generating boilerplate code but useless for architectural decisions. The same
person using the same model occupies very different positions depending on the
task at hand.

So here's a different framing: treat each (user, model, task) triple as its own
thing, mapped onto a two-dimensional plane.

## The framework

Two orthogonal axes:

**Familiarity**: how much you've actually used this specific model for this
specific task. Ranges from "never tried" to "extensive experience". This only
moves in one direction---you can't become less familiar with something you've
tried.

**Helpfulness**: whether the model is actually useful for that task. Ranges from
harmful through neutral to helpful. This corresponds to TAM's "perceived
usefulness" but evaluated task-specifically. Crucially, this assessment can
change as familiarity increases---early positive impressions might fade, or
initial frustrations might give way to appreciation.

This creates four quadrants where the same user with the same model might
simultaneously occupy all of them depending on which tasks we examine.

### The four quadrants

**High familiarity, helpful** (upper right): Proven integration. You've got
extensive experience, you've developed effective prompting strategies, you
understand the limitations, and you've integrated it into your workflow. Using
an LLM to generate boilerplate code or draft routine email responses lives here.

**High familiarity, unhelpful** (lower right): Informed rejection. You haven't
simply failed to try---you've engaged extensively and concluded it doesn't work.
You've hit the model's limitations repeatedly enough to form a stable negative
assessment. This might include complex reasoning tasks, fact-checking
mission-critical information, or creative work requiring genuine originality.

**Low familiarity, helpful** (upper left): Early positive impression. You've
tried it once or twice with good results but haven't encountered edge cases.
This quadrant is unstable---continued use drives rightward along the familiarity
axis, but helpfulness might shift up or down as experience accumulates.

**Low familiarity, unhelpful** (lower left): Premature rejection or speculative
avoidance. Either you tried it once, had a poor experience, and gave up, or you
suspect the model can't handle it based on general reputation. Unlike informed
rejection, these assessments are speculative rather than experiential.

## Why this matters

Consider code review. I might map my experience like this:

- **Catching obvious bugs**: upper right---proven useful
- **Suggesting refactorings**: middle right---familiar but hit-or-miss
- **Architectural feedback**: lower right---tried extensively, consistently
  superficial
- **Performance optimization**: lower left---tried once, suggestions were wrong

Technology-level TAM would aggregate these into a single "perceived usefulness"
score for "LLMs in code review". But that obscures the actual pattern: selective
integration based on task-specific evaluation.

The framework also explains why people's assessments differ so dramatically.
We're often arguing about different tasks while thinking we're arguing about the
same technology. When someone says "LLMs are transformative for writing" and
someone else says "they're useless"---they might both be right, just talking
about different writing tasks.

## The transformation/automation/magnification thing

You've probably seen people claim AI will "transform" work in their domain. The
framework helps cut through this. Most "transformation" claims turn out to be:

- **Automation** of tasks already in the upper-right quadrant (where the tool
  genuinely helps with familiar tasks)
- **Magnification** of existing patterns (making good writers slightly better,
  bad writers slightly worse)
- **Wishful thinking** about tasks currently in the lower quadrants

Real transformation would mean moving tasks between quadrants in systematic
ways. That might happen---models improve, prompting strategies evolve---but it's
an empirical question, not a foregone conclusion.

## What to do with this

For users: instead of asking "should I use ChatGPT?", ask "for which specific
tasks have I found it helpful after sufficient trial?" This encourages
experimentation while validating informed rejection.

Different quadrants need different strategies:

- Upper-right tasks deserve workflow integration
- Lower-right tasks might warrant periodic re-evaluation as models improve
- Upper-left tasks need systematic testing to see if initial promise holds
- Lower-left tasks might benefit from one serious attempt with better prompting
  before abandoning them

For researchers: adopt task-level analysis. Ask participants to identify
specific tasks, plot them on this plane, track how positions change over time.
This would reveal patterns currently hidden by aggregation.

## Caveats

This framework simplifies reality. The two dimensions might miss important
factors---confidence, cost, ethics. The discrete task framing might obscure the
fluid, exploratory way people actually interact with LLMs. The familiarity axis
collapses several concepts: frequency of use, diversity of use cases, quality of
prompting strategies.

But (you can probably tell there was going to be a 'but' somewhere) even a
simplified framework beats treating adoption as a binary technology-level
decision. At minimum, it captures the obvious truth that your relationship with
these tools is task-specific, and aggregating across tasks obscures more than it
reveals.

The real test will be whether thinking in these terms helps you make better
decisions about where to invest effort learning these tools. For me, it's been
clarifying---it legitimizes informed rejection while encouraging strategic
experimentation. Your mileage may vary.
