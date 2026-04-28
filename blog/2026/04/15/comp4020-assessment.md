---
title: "COMP4020: assessment"
description: "What does a student hand in for an agentic coding course---and how do I make
  that artefact worth more than the grade itself?"
tags: [comp4020, teaching]
image: /assets/images/posts/comp4020-assessment.svg
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

The assessment challenges in an agentic coding course aren't the same as the
ones
[causing much hand-wringing in other areas of higher education](https://nymag.com/intelligencer/article/openai-chatgpt-ai-cheating-education-college-students-school.html). The obvious
framing---"how do we stop students cheating with AI?"---misses what COMP4020 is
actually for. The course isn't trying to produce students who can code without
AI; it's trying to produce students who can build _good_ software _with_ AI,
which is a different skill. So the question I'm actually trying to answer is:
what artefacts can/should we assess to determine attainment of the course
learning outcomes when producing code itself is cheap?

I want the assessed artefact to do three things. It should be _authentic_ to
what the student actually built---tightly coupled to the work itself, not some
abstracted written reflection or traditional exam that drifts away from the
thing the course is about. It should require _human_ care and effort to do well;
a one-shottable assessment fails to measure the thing the course is actually
about, which is judgement: when to let the agent run, when to intervene or throw
the whole thing away and start again, and how best to scaffold all these things
in a co-operative human-agent system. A submission anyone could generate
by pasting the prompt into Claude and hitting enter once hasn't told us anything
useful. And---this one's the most fun to think about---it should have
_usefulness beyond the course grade_. Ideally the student would want to keep it,
share it, put it on their CV, post it to
[Hacker News](https://news.ycombinator.com/). The grade becomes a side-effect of
making something genuinely useful to somebody.

Concretely, the course will have three assignments of increasing scope (static
site, CRUD app, real-time app), and for each one students will hand in a
bundle of four things: the git repo itself (source, Docker-based build and
deploy workflow, `CLAUDE.md` and other agent files, `README.md`); the full
Claude Code session logs (the `.jsonl` files from `~/.claude/projects/...`), a
complete auditable record of the agentic workflow that produced the thing; a
short, slick, launch-style product video of the kind you'd put at the top of a
landing page to show what the app does; and a longer "behind-the-scenes"
workflow video---more reflective, "here's how I actually built this, including
the bits that went wrong", the sort of video that would generate genuine
discussion on Hacker News or r/programming about agentic coding best
practices.

:::info

The four COMP4020 learning outcomes. Students will be able to:

1. design, build and test full-stack web applications using a rapid-prototyping
   process
2. describe the components of a Large Language Model interface for code
   generation
3. design and evaluate different LLM agent workflows for software development
4. apply principles from the scholarly literature to work-in-progress and
   finalised software prototypes

:::

The two videos do different work. The product video exists to demonstrate that
the thing _works_---that the student can ship something polished. The BTS video
is where most of the real assessment happens, and where the "useful beyond the
grade" criterion kicks in hardest; if these videos are any good, they're a
contribution to the wider conversation about how to build software with agents.
The four items also map onto the course's four learning outcomes unevenly: the
product video and the working repo cover LO1 (design, build, test full-stack web
apps); the BTS video backed by the JSONL logs covers LO3 (design and evaluate
LLM agent workflows) and LO4 (apply scholarly principles to the prototypes); LO2
(describe the components of an LLM interface for code generation) is the gap I
haven't yet closed, and probably sits in a separate written component or threads
through the BTS commentary ("I used a subagent here because...").

The JSONL logs are the sneaky part. They're a complete record of every prompt,
every tool use, every back-and-forth, which makes them dense and hard to read
end-to-end; nobody's going to wade through hundreds of megabytes for every
submission. That's fine, because the logs exist as _evidence_. They make every
claim in the BTS video auditable, and they make one-shotting visibly obvious (a
log containing a single prompt and a single response is telling us something).
They also open up some interesting possibilities on top of that. An
[LLM-as-judge](/blog/2026/03/30/comp4020-whats-the-theory-here/) could scan them
for specific workflow patterns a student claims to have used. Aggregated across
the cohort, with consent and anonymisation, they become a genuine research
corpus. And requiring them forces students to practise good secrets hygiene from
day one---no credentials in prompts, no API keys pasted into chat---which I'd
want them doing regardless of how I assessed them. I'll train the students in
this, and give them tooling to help.

There's plenty still open. The rubric is the biggest one: how do you actually
_grade_ a BTS video? What
distinguishes a good one from a glib one? I have intuitions---genuine engagement
with trade-offs, specific references to what went wrong, connections to the
scholarly material, evidence of iteration rather than single-shot
prompting---but I don't have a scheme I'd trust yet. Related: what stops the BTS
video itself being [LLM-generated slop](https://simonwillison.net/2024/May/8/slop/)? The JSONL logs are part of the answer
(it's hard to reflect plausibly on workflow choices the logs show you didn't
make), though they're probably not the whole answer. Voice-and-face-on-camera
helps, though I'm wary of mandating that and creating accessibility problems.

LO2 is unresolved, as I've noted. I suspect it won't resolve properly until I've
drafted the lecture material and can see what needs assessing in isolation from
the prototypes.

And there's the broadest question of all. There's a
[whole discourse right now about whether AI-assisted work is meaningfully assessable _at all_](https://postplagiarism.com/2024/08/21/intro/),
about integrity, about what a degree even signals when agents can produce code
that looks like what a student would produce. I keep going back and forth on whether
to engage with that explicitly in the course materials, or whether to let the
positive proposal do the arguing. For now I'm leaning toward the latter---ask me
again next month.

As with
[everything else in this series](/blog/2026/03/31/comp4020-the-story-so-far/),
if you're teaching something similar and have made different choices, I'd
genuinely like to hear about them.
