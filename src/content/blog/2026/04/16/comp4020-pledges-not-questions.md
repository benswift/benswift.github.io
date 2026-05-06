---
title: "The road to COMP4020: pledges, not questions"
description: "Replacing two of the three weekly reflection questions with falsifiable
  pledges, and using a cross-eval matrix to find the interesting disagreements."
tags: [comp4020]
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/). This one is a direct
revision of [the weekly questions](/blog/2026/03/26/comp4020-the-weekly-questions/)
post from a few weeks ago---prompted by a conversation I had this morning with
[Lorenn Ruster](https://lorenn.medium.com/dignity-in-tech-phd-origin-story-5b2d47147825)
about her work on responsibility pledges and dignity-centred reflective practice.

:::

A month ago I [landed on three questions](/blog/2026/03/26/comp4020-the-weekly-questions/)
that students in COMP4020 would answer each week alongside their prototype:
_Why this?_ (intentionality), _What made it better?_ (feedback loops), and _Any
good?_ (judgement). The idea was to scaffold the weekly
[studio crit](/blog/2026/02/20/comp4020-the-core-mechanic/) so that students
arrived having already done some thinking, rather than fumbling to figure out
what they thought in real time.

I still believe in the scaffold, but the questions weren't quite right. "Any
good?" was the weakest of the three: the vaguest, and the one students would
struggle with most. "Why this?" was fine in isolation, but it turned out to
overlap with something better. And "What made it better?" was pointing at the
right idea but phrased too vaguely, inviting a list of incremental improvements
when what I really wanted was the singular breakthrough.

Lorenn's work is what unstuck the design. She's a recent PhD graduate from the
[School of Cybernetics](https://cybernetics.anu.edu.au/) whose research focuses on
closing the gap between responsible AI principles and actual practice. Her
[MISQE paper with Katherine Daniell](https://aisel.aisnet.org/misqe/vol24/iss2/6/)
describes how two organisations operationalised responsible AI by crafting
_responsibility pledges_: specific commitments embedded in routine practice,
not lofty principles pinned to a wall. Her
[dignity-centred reflective practice work](https://aisel.aisnet.org/acis2023/25/)
showed that even in fast-moving startup contexts, structured reflection built
around concrete commitments actually stuck. People integrated it into their
routines, which is exactly what I need for a ten-week course with a new
prototype every week.

What makes pledges more useful than questions is that they're
_testable_. "Any good?" invites a shrug. A pledge like "this prototype will show
its reasoning before taking any action on the user's behalf" invites scrutiny:
did it, or didn't it?

So here's the shape of it. Each week, alongside their prototype, students
submit three pledges and answer one question.

The **pledges** take the form "This prototype will..." or "This prototype will
not...": specific, falsifiable commitments about what the prototype does and
what trade-offs it makes. Students write fresh pledges each week, though
they're free to carry forward ones they still believe in. The format matters:
these need to be concrete enough that someone else could check the source code
and the deployed app and say whether the pledge was honoured.

Some examples of what I mean:

- "This prototype will show its reasoning before taking any action on the user's behalf"
- "This prototype will not store any data it doesn't need to function"
- "This prototype will fail visibly rather than silently when the API is down"
- "This prototype will work without JavaScript for its core reading experience"

And here's what I _don't_ mean: "I pledge to be ethical", "This prototype
respects human dignity", "I will consider the user." These sound nice but
they're not evaluable. You can't look at a codebase and tell me whether it
"considers the user." You _can_ tell me whether it stores data it doesn't need.

I considered other numbers---Donna Hicks's
[dignity model](https://www.amazon.com/Dignity-Essential-Role-Resolving-Conflict/dp/0300188056)
has ten elements, the
[Holberton-Turing Oath](https://github.com/Holberton-Turing/oath/blob/master/The_Holberthon-Turing_Oath.md)
has thirteen, most organisational AI principles land around five to seven. But
those are comprehensive frameworks meant to cover everything. Three pledges for
a specific weekly prototype is about right: enough to cover meaningfully
different dimensions of the work, few enough that each one gets genuine thought.
(I originally considered keeping the 280-character skeet format from the earlier
design, but dropped it---the pledges need to be specific enough to be
evaluable, and character limits would work against that.)

That's three pledges. The fourth weekly deliverable is a single question, and
it's this: _What was the aha moment?_ This replaces the old "What
made it better?" with something more pointed. I don't want a list of things
that helped. I want the singular breakthrough that turned the project from
stuck to working. It might be switching tech stacks, or a blog post that
reframed the problem, or a tweak to the agentic coding harness, or a
particular prompting angle you tried in a fresh Claude Code session, or a
conversation with a friend who pointed out you were solving the wrong problem.
The point is to identify _the_ thing, not _a_ thing.

Over ten weeks, with twenty students per crit group, that's roughly two hundred
documented aha moments---a browsable catalogue of "things that actually work
when you're building with AI agents." I'd read that catalogue even if I wasn't teaching
the course.

I did consider other framings before getting here. I thought about adding a
fourth "pledge" question on top of the existing three, or reframing all three
questions through Lorenn's dignity lens, or replacing only "Any good?" and
leaving the other two untouched. The problem with keeping "Why this?" is that
the pledges already absorb it. A pledge like "this prototype will surface your
browser fingerprint in a way you didn't ask for, to show how little privacy you
actually have" _tells_ you why the student built what they built. The
intentionality is baked into the commitment. And the problem with keeping all
three questions and adding pledges on top is that it's just too much weekly
overhead alongside the prototype work itself.

I want to head off a concern I had myself about all this: that the word
"pledge" creates a performative do-gooder dynamic where students compete to
write the most virtuous-sounding commitments and avoid anything spicy. That would be a
disaster for this course. The weekly
[provocations](/blog/2026/02/20/comp4020-the-core-mechanic/) are designed to
invite subversive, experimental, even uncomfortable responses. These prototypes
are closer to art projects than pitch decks for a startup accelerator.

A pledge in this context isn't "I promise to be good." It's "here's what I'm
committing this prototype to do, and you can hold me to it." That includes
commitments to provoke or to expose something uncomfortable:

- "This prototype will surface your browser fingerprint in a way you didn't ask for, to show you how little privacy you actually have"
- "This prototype will deliberately exclude power users to find out what happens when software optimises for beginners only"
- "This prototype will feel slightly wrong to use, on purpose"

A student building something deliberately transgressive should be _more_ able to
write sharp pledges, not less, because they've already thought about what
reaction they're trying to provoke and what trade-offs they're consciously
making. The pledge isn't a moral filter; it's a demand for specificity about
what you're actually doing and why.

Once the pledges are written, they become the raw material for the crit
itself. Each crit group has about twenty students, each submitting three
pledges. That's sixty pledges per week, and twenty prototypes. What happens if
you evaluate every prototype against every individual pledge?

A 20×60 matrix, each prototype scored against each pledge, is far too many
evaluations for humans (twelve hundred cells) but straightforward for an LLM
with access to the source code and the deployed app. The raw matrix isn't what
matters, though. What matters is what clusters out of it:

_Universally honoured pledges_---ones every prototype satisfies. These are
probably too vague or too easy. Worth interrogating: is this pledge actually
saying anything, or is it the equivalent of "I pledge to be ethical"?

_Universally broken pledges_---ones nobody's prototype satisfies. Either the
pledge is unrealistic given a one-week build, or it's pointing at a genuine
blind spot the whole group shares.

_Controversial prototypes_---ones that satisfy some pledges and violate others.
These are where the crit gets good. The prototype is
making a trade-off that some students' values endorse and others reject.

_Controversial pledges_---ones where the group splits on whether a given
prototype honours them. This means the pledge is ambiguous, or students
interpret "in accord" differently. Also worth pulling apart.

The facilitator doesn't need to fish for tension in the crit, since the matrix
has already found it. "Your prototype broke thirty-eight of the sixty pledges
in the room. Let's talk about why." Or: "Everyone's prototype honoured this
pledge. Does that mean it's a good pledge, or does it mean none of you were
ambitious enough?"

The matrix is a conversation starter, not a verdict. Showing the LLM's
reasoning alongside each judgement means students can push back on it, and
arguing about whether the evaluator got it right is itself a productive crit
conversation.

The obvious risk with any of this is ethics washing. There's a well-documented
[problem in the broader pledge literature](https://www.aiethicist.org/pledges)
with what gets called that name: organisations issuing lofty commitments that
look good in a press release and change nothing in practice. Student pledges
could easily go the same way: three nice-sounding sentences, duly submitted
each Monday, utterly disconnected from the prototype they accompany.

The cross-eval is one defence: it makes pledges _testable_. A vague pledge like
"this prototype will be fair" gets exposed the moment an LLM tries to evaluate
it against a codebase and can't produce a clear answer. If your pledge can't
generate a yes-or-no verdict, it probably isn't saying anything.

But the subversive prototypes are the other defence, and maybe the more
important one. A deliberately provocative prototype stress-tests
whether the class's pledges are thoughtful or just pious. If someone builds
something that intentionally violates privacy to make a point about
surveillance, and that prototype breaks forty out of sixty pledges,
that's not a failure but a fantastic crit discussion. "You all pledged that
software should respect user consent. This prototype deliberately violates it.
Is it irresponsible, or is it the most responsible prototype here, because it's
the only one that made you _feel_ what users actually experience?" You can't get
a conversation like that from "any good?"

None of this works, of course, if students don't know how to write good
pledges in the first place. The first couple of weeks need to model it
explicitly.

In week one, I'd write pledges for a demo prototype and walk through my
reasoning in front of the class: why this pledge and not that one, what makes
it evaluable, what trade-off it encodes. In week two, students write their own
and see the cross-eval matrix for the first time. The facilitation question
becomes: "whose prototype broke your pledge, and do you think that's a
problem?" By week three or four, the scaffolding should be unnecessary.
