---
title: "Seeing AI tasks through a TAM lens"
tags:
  - ai
---

When it comes to AI adoption research, we keep asking "do you use ChatGPT?" when
we should be adding "for which specific tasks?"

::: info UPDATE 18 Nov 2025

An earlier version of this post used the term "helpfulness" for one of the axes
of this framework, but I've changed it (and the surrounding prose) to
"efficiency" because on reflection I think "helpfulness" conflated the "makes me
faster" and "is good for human flourishing" questions too much.

:::

The
[Technology Acceptance Model](https://en.wikipedia.org/wiki/Technology_acceptance_model)
(TAM) has been successfully applied to understand LLM
adoption---[surveys of hundreds of users](https://www.tandfonline.com/doi/full/10.1080/10447318.2024.2314358)
confirm that perceived usefulness and ease of use predict whether people adopt
these tools. But these studies treat adoption as a technology-level decision
rather than examining the specific _tasks_ where these things are useful.

A researcher might find an LLM invaluable for literature search but useless for
theoretical analysis. A journalist might rely on it for drafting routine updates
but avoid it for investigative work. A disinfo actor will gladly use it to
["flood the zone"](https://www.mediamatters.org/steve-bannon/misinformer-year-steve-bannons-flood-zone-shit-approach-destroying-american-democracy),
but not for writing to their loved ones. The same person using the same model
would give very different answers to the "are LLMs useful" depending on the task
at hand.

So I propose a different framework[^branding]: treat each (user, model, task)
triple as its own thing, mapped onto a two-dimensional plane. There are two
orthogonal axes:

**Familiarity**: how much you've actually used this specific model for this
specific task. Ranges from "never tried" to "extensive experience". This only
moves in one direction---you can't become less familiar with something you've
tried.

**Efficiency**: whether using the model actually helps you get the task done
faster. Ranges from actively slowing you down through making no real difference
to genuinely speeding you up. This corresponds to TAM's "perceived usefulness"
but evaluated task-specifically and focused on time/effort rather than moral
dimensions[^ethics]. Crucially, this assessment can change as familiarity
increases---a tool that initially seems fast might prove time-consuming once you
factor in error correction, or initial setup overhead might give way to genuine
productivity gains. And there's always going to be noise (stochastic parrots and
all that) so it's really just an "in general" judgement.

The same user with the same AI model might simultaneously occupy multiple zones
depending on task. And importantly, there's a substantial neutral zone in the
middle---tasks where using the tool takes about as much time and effort as doing
it yourself.

<svg width="100%" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Background zones -->
  <rect x="50" y="50" width="250" height="133" fill="#e8f5e9" opacity="0.5"/>
  <text x="175" y="110" text-anchor="middle" font-size="14" fill="#2e7d32" font-weight="600">Early positive</text>
  <text x="175" y="128" text-anchor="middle" font-size="12" fill="#2e7d32">impression</text>
  
  <rect x="300" y="50" width="250" height="133" fill="#a5d6a7" opacity="0.7"/>
  <text x="425" y="110" text-anchor="middle" font-size="14" fill="#1b5e20" font-weight="600">Proven</text>
  <text x="425" y="128" text-anchor="middle" font-size="12" fill="#1b5e20">integration</text>
  
  <rect x="50" y="183" width="250" height="134" fill="#fff3e0" opacity="0.5"/>
  <text x="175" y="243" text-anchor="middle" font-size="14" fill="#e65100" font-weight="600">Neutral zone</text>
  <text x="175" y="261" text-anchor="middle" font-size="12" fill="#e65100">(premature/speculative)</text>
  
  <rect x="300" y="183" width="250" height="134" fill="#ffe0b2" opacity="0.7"/>
  <text x="425" y="243" text-anchor="middle" font-size="14" fill="#e65100" font-weight="600">Neutral zone</text>
  <text x="425" y="261" text-anchor="middle" font-size="12" fill="#e65100">(informed)</text>
  
  <rect x="50" y="317" width="250" height="133" fill="#ffebee" opacity="0.5"/>
  <text x="175" y="377" text-anchor="middle" font-size="14" fill="#c62828" font-weight="600">Premature</text>
  <text x="175" y="395" text-anchor="middle" font-size="12" fill="#c62828">rejection</text>
  
  <rect x="300" y="317" width="250" height="133" fill="#ef9a9a" opacity="0.7"/>
  <text x="425" y="377" text-anchor="middle" font-size="14" fill="#b71c1c" font-weight="600">Informed</text>
  <text x="425" y="395" text-anchor="middle" font-size="12" fill="#b71c1c">rejection</text>
  
  <!-- Axes -->
  <line x1="50" y1="450" x2="550" y2="450" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="50" y1="450" x2="50" y2="50" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow markers -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#333" />
    </marker>
  </defs>
  
  <!-- Axis labels -->
  <text x="300" y="485" text-anchor="middle" font-size="16" font-weight="600">Familiarity →</text>
  <text x="25" y="250" text-anchor="middle" font-size="16" font-weight="600" transform="rotate(-90, 25, 250)">Efficiency →</text>
  
  <!-- Grid lines -->
  <line x1="300" y1="50" x2="300" y2="450" stroke="#999" stroke-width="1" stroke-dasharray="5,5"/>
  <line x1="50" y1="183" x2="550" y2="183" stroke="#999" stroke-width="1" stroke-dasharray="5,5"/>
  <line x1="50" y1="317" x2="550" y2="317" stroke="#999" stroke-width="1" stroke-dasharray="5,5"/>
</svg>

## The zones

**High familiarity, speeds you up** (upper right): This is the good place.
You've got extensive experience, you've developed effective prompting
strategies, you understand the limitations, and you've integrated it into your
workflow in ways that genuinely save time. This might be generating first drafts
of routine correspondence that need minimal editing. For me (an academic AI
researcher and software developer) things like writing scripts to automate
repetitive tasks and generating boilerplate code are in this bucket.

**High familiarity, no difference or slows you down** (middle/lower right):
Informed rejection. You haven't simply failed to try---you've engaged
extensively and concluded it doesn't actually save time, or actively wastes it.
You've hit the model's limitations repeatedly enough to form a stable
assessment.

The neutral zone is interesting---tasks where using the tool takes about as much
time and effort as doing it yourself, so you might use it or might not depending
on mood (or whether you're paying for it or you're being
[subsidised by Silicon Valley VCs](https://www.wheresyoured.at/why-everybody-is-losing-money-on-ai/)).
A researcher editing AI-generated literature summaries that need as much work to
fix as they would to write from scratch. A designer tweaking AI-generated
layouts that never quite capture the intended aesthetic and require just as much
time to correct as to create manually.

The genuinely slowing-you-down zone includes complex reasoning tasks,
fact-checking mission-critical information, or creative work requiring genuine
originality where the tool actively wastes your time with output that needs
extensive correction or produces misleading results you have to untangle. In my
use of Claude Code (and friends) some coding tasks fall into this for
sure---they add technical debt that takes longer to fix than writing correctly
from scratch.

**Low familiarity, speeds you up** (upper left): Early positive impression.
You've tried it once or twice and it seemed to save time, but you haven't
encountered edge cases or the full overhead of error correction. This zone is
unstable---continued use drives rightward along the familiarity axis, but
efficiency might shift up or down as experience accumulates and you discover
hidden time costs.

**Low familiarity, no difference or slows you down** (middle/lower left):
Premature rejection or speculative avoidance. Either you tried it once, found it
took just as long or longer, and gave up, or you suspect the model can't handle
it efficiently based on general reputation. Unlike informed rejection, these
assessments are speculative rather than experiential.

## Why this matters

Consider an academic researcher (hey---I write what I know). I might map my
experience like this:

- _vibecoding all the things_: upper right---see elsewhere on my blog, but I've
  overall seen an increase in my productivity, genuinely getting more done
  faster
- _literature search and summarisation_: upper right---proven to save time
  finding relevant papers quickly
- _drafting standard email responses_: upper right---saves time, works
  consistently with minimal editing needed
- _generating first drafts of "methods sections"_: middle right---tried
  extensively, but I end up rewriting so much it takes about the same time as
  writing from scratch
- _writing out core/key arguments_: lower right for sure---consistently produces
  superficial output that takes longer to fix than to write properly in the
  first place

Technology-level TAM would aggregate these into a single "perceived usefulness"
score for "LLMs in academic research". But that obscures the actual pattern:
which is much lumpier and task-dependent, with some tasks genuinely saving time
and others actively wasting it.

The framework also explains why people's assessments differ so dramatically.
We're often arguing about different tasks while thinking we're arguing about the
same technology. When someone says "LLMs are transformative for writing" and
someone else says "they're useless"---they might both be right, just talking
about different writing tasks with genuinely different time costs.

This matches what
[recent meta-analyses](https://www.nature.com/articles/s41562-024-02024-1) have
found: human-AI combinations perform significantly differently depending on task
type, with performance losses in decision-making tasks but gains in content
creation tasks. The tool's utility is fundamentally task-dependent. Which really
shouldn't surprise anyone, but here we are.

## The transformation/automation/magnification thing

You've probably seen people claim AI will "transform" work in their domain. Most
"transformation" claims turn out to be:

- **automation** of tasks already in the upper-right quadrant (where the tool
  genuinely speeds you up on familiar tasks, and/or can be used to write a
  script to fully automate a task)
- **magnification** of existing patterns (making fast workers slightly faster,
  inefficient workers slightly more inefficient)
- **wishful thinking** about tasks currently in the lower quadrants,
  particularly by folks selling AI tools

Real transformation would mean moving tasks between zones in systematic ways.
That might happen---models improve, prompting strategies evolve---but it's an
empirical question, not a foregone conclusion.

And let's be honest about the neutral zone. A lot of supposed "AI-assisted" work
actually lives here---using the tool because it's there, because everyone else
is, because it feels like you should, even when it's not actually saving time.

## What to do with this

For users: instead of asking "should I use ChatGPT?", ask "for which specific
tasks does it actually save me time after sufficient practice?" This encourages
experimentation while validating informed rejection.

Different zones need different strategies:

- upper-right tasks deserve workflow integration and continued refinement to
  maximise time savings
- middle-right neutral tasks might warrant periodic re-evaluation as models
  improve, or just accepting they're optional time-wise
- lower-right time-wasting tasks probably aren't worth more effort unless models
  substantially improve their speed/accuracy trade-offs
- upper-left tasks need systematic testing to see if initial time savings hold
  up under regular use
- lower-left tasks might benefit from one serious attempt with better prompting
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

The two dimensions do miss important factors---confidence, cost, and especially
ethics/responsible use questions[^ethics]. The discrete task framing might
obscure the fluid, exploratory way people actually interact with LLMs. The
familiarity axis collapses several concepts: frequency of use, diversity of use
cases, quality of prompting strategies.

But even a simplified framework beats treating adoption as a binary
technology-level decision. At minimum, it captures the obvious truth that your
relationship with these tools is task-specific, and aggregating across tasks
obscures more than it reveals.

The real test will be whether thinking in these terms helps you make better
decisions about where to invest effort learning these tools. For me, it's been
clarifying---it legitimises informed rejection (neo-luddism) while encouraging
strategic experimentation, and it helps me recognise when I'm in that neutral
zone where using the tool is more about performance than productivity.

Your mileage may vary.

[^branding]:
    The framework doesn't have a name, because I'm bad at branding... hmm.

[^ethics]:
    The moral/ethical dimension matters enormously---things like
    [digital phrenology](https://gizmodo.com/were-doing-ai-phrenology-again-2000553600)/[racism](https://hai.stanford.edu/news/covert-racism-ai-how-language-models-are-reinforcing-outdated-stereotypes)
    and racism aren't just inefficient, they're harmful. But that's orthogonal
    to the speed/efficiency question. A tool can be both fast and unethical, or
    slow and ethical. The framework deliberately focuses on the pragmatic "does
    this save me time?" dimension while acknowledging that ethics is a separate,
    crucial consideration. If you like, add a third "is it good for human
    flourishing" dimension.
