---
title: Seeing AI tasks through a TAM lens
tags: ai
---

Here's something that's been bugging me about AI adoption research: we keep
asking "do you use ChatGPT?" when we should be asking "for which specific
tasks?"

The
[Technology Acceptance Model](https://en.wikipedia.org/wiki/Technology_acceptance_model)
(TAM) has been successfully applied to understand LLM
adoption---[surveys of hundreds of users](https://www.tandfonline.com/doi/full/10.1080/10447318.2024.2314358)
confirm that perceived usefulness and ease of use predict whether people adopt
these tools. But here's the problem: these studies treat adoption as a
technology-level decision rather than examining the specific tasks where these
tools actually prove valuable.

This misses something fundamental. A researcher might find an LLM invaluable for
literature search but useless for theoretical analysis. A journalist might rely
on it for drafting routine updates but avoid it for investigative work. The same
person using the same model occupies very different positions depending on the
task at hand.

So I reckon we should use a different framing: treat each (user, model, task)
triple as its own thing, mapped onto a two-dimensional plane.

## The framework[^branding]

Two orthogonal axes:

**Familiarity**: how much you've actually used this specific model for this
specific task. Ranges from "never tried" to "extensive experience". This only
moves in one direction---you can't become less familiar with something you've
tried.

**Helpfulness**: whether the model is actually useful for that task. Ranges from
actively harmful through neutral to genuinely helpful. This corresponds to TAM's
"perceived usefulness" but evaluated task-specifically. Crucially, this
assessment can change as familiarity increases---early positive impressions
might fade, or initial frustrations might give way to appreciation.

This creates a space where the same user with the same model might
simultaneously occupy multiple zones depending on which tasks we examine. And
importantly, there's a substantial neutral zone in the middle---tasks where the
tool neither helps nor hurts, or at least where it's a real mixed bag.

### The zones

**High familiarity, helpful** (upper right): Proven integration. You've got
extensive experience, you've developed effective prompting strategies, you
understand the limitations, and you've integrated it into your workflow. For a
writer, this might be generating first drafts of routine correspondence. For a
teacher, creating quiz questions from course materials. For a developer,
generating boilerplate code.

**High familiarity, neutral/unhelpful** (middle/lower right): Informed
rejection. You haven't simply failed to try---you've engaged extensively and
concluded it doesn't work, or at best breaks even. You've hit the model's
limitations repeatedly enough to form a stable assessment.

The neutral zone here is particularly interesting---tasks where using the tool
takes about as much effort as doing it yourself, so you might use it or might
not depending on mood. A researcher editing AI-generated literature summaries
that need as much work to fix as they would to write from scratch. A designer
tweaking AI-generated layouts that never quite capture the intended aesthetic.

The genuinely unhelpful zone includes complex reasoning tasks, fact-checking
mission-critical information, or creative work requiring genuine originality
where the tool actively wastes your time or produces misleading output. In my
use of Claude Code (and friends) some coding tasks fall into this for
sure---they add technical debt that actually makes things worse. And obviously
there's cooked stuff like digital phrenology/racism.

**Low familiarity, helpful** (upper left): Early positive impression. You've
tried it once or twice with good results but haven't encountered edge cases.
This zone is unstable---continued use drives rightward along the familiarity
axis, but helpfulness might shift up or down as experience accumulates.

**Low familiarity, neutral/unhelpful** (middle/lower left): Premature rejection
or speculative avoidance. Either you tried it once, had a poor or meh
experience, and gave up, or you suspect the model can't handle it based on
general reputation. Unlike informed rejection, these assessments are speculative
rather than experiential.

## Why this matters

Consider an academic researcher (hey---I write what I know). I might map my
experience like this:

- **Literature search and summarisation**: upper right---proven useful for
  finding relevant papers quickly
- **Drafting standard email responses**: upper right---saves time, works
  consistently
- **Generating first drafts of methods sections**: middle right---tried
  extensively, but I end up rewriting so much it's neutral
- **Writing out core/key arguments**: lower right for sure---consistently
  superficial and misleading
- **Data analysis code review**: middle left---tried once, suggestions were
  hit-or-miss, haven't invested enough to know if better prompting would help
- **Grant writing**: lower left---suspect it can't capture the nuance, haven't
  really tried

Technology-level TAM would aggregate these into a single "perceived usefulness"
score for "LLMs in academic research". But that obscures the actual pattern:
selective integration based on task-specific evaluation.

The framework also explains why people's assessments differ so dramatically.
We're often arguing about different tasks while thinking we're arguing about the
same technology. When someone says "LLMs are transformative for writing" and
someone else says "they're useless"---they might both be right, just talking
about different writing tasks.

This matches what
[recent meta-analyses](https://www.nature.com/articles/s41562-024-02024-1) have
found: human-AI combinations perform significantly differently depending on task
type, with performance losses in decision-making tasks but gains in content
creation tasks. The tool's utility is fundamentally task-dependent.

## The transformation/automation/magnification thing

You've probably seen people claim AI will "transform" work in their domain. The
framework helps cut through this. Most "transformation" claims turn out to be:

- **Automation** of tasks already in the upper-right quadrant (where the tool
  genuinely helps with familiar tasks, and/or can be used to write a script to
  fully automate a task)
- **Magnification** of existing patterns (making good writers slightly better,
  bad writers slightly worse)
- **Wishful thinking** about tasks currently in the lower quadrants

Real transformation would mean moving tasks between zones in systematic ways.
That might happen---models improve, prompting strategies evolve---but it's an
empirical question, not a foregone conclusion.

And let's be honest about the neutral zone. A lot of supposed "AI-assisted" work
actually lives here---using the tool because it's there, because everyone else
is, because it feels like you should, even when it's not actually saving time or
improving quality. That's not transformation, that's theatre.

## What to do with this

For users: instead of asking "should I use ChatGPT?", ask "for which specific
tasks have I found it helpful after sufficient trial?" This encourages
experimentation while validating informed rejection.

Different zones need different strategies:

- Upper-right tasks deserve workflow integration and continued refinement
- Middle-right neutral tasks might warrant periodic re-evaluation as models
  improve, or just accepting they're optional
- Lower-right unhelpful tasks probably aren't worth more effort unless models
  substantially improve
- Upper-left tasks need systematic testing to see if initial promise holds
- Lower-left tasks might benefit from one serious attempt with better prompting
  before abandoning them

For researchers: adopt task-level analysis. Ask participants to identify
specific tasks, plot them in this space, track how positions change over time
(evaluate!). This would reveal patterns currently hidden by aggregation. Given
that
[individual performance gains from AI systems depend on task-technology fit](https://aisel.aisnet.org/ecis2020_rp/200/),
we need frameworks that capture this task-level variation.

## Caveats

All models are wrong, some are useful. Is this one useful? Maybe... I'm still
thinking it through.

The two dimensions do miss important factors---confidence, cost, ethics. The
discrete task framing might obscure the fluid, exploratory way people actually
interact with LLMs. The familiarity axis collapses several concepts: frequency
of use, diversity of use cases, quality of prompting strategies.

But even a simplified framework beats treating adoption as a binary
technology-level decision. At minimum, it captures the obvious truth that your
relationship with these tools is task-specific, and aggregating across tasks
obscures more than it reveals.

The real test will be whether thinking in these terms helps you make better
decisions about where to invest effort learning these tools. For me, it's been
clarifying---it legitimises informed rejection while encouraging strategic
experimentation, and it helps me recognise when I'm in that neutral zone where
using the tool is more about performance than productivity.

Your mileage may vary.

[^branding]:
    The framework doesn't have a name, because I'm bad at branding... hmm.
