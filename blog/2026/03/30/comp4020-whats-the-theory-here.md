---
title: "The road to COMP4020: what's the theory here?"
description: "There are lots of nascent theories for agentic coding---here's a survey, and a plan to test them with 200 students."
published: false
tags: [comp4020]
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

I was chatting with the CIO of a government agency yesterday and they asked
about this course. They're wresltling with this very issue: in the age of
agentic coding agents, how do I structure my teams, development workflows and QA
processes?

The answer which I gave him, which I believe to be true in my bones, is that
nobody really knows for sure. But a lot of folks are trying to figure it
out---some quietly with their organisations, some very loudly on (ugh!)
LinkedIn, and lots in between[^loudly].

The question was really one of _theory_; while there are many in the hard
sciences that would criticis sotware development/engineering as having a
lamentably loose proof relationship between the theory (agile! scrum! 10x
developers!) and what works in practice, at least there are theories about what
works and what doesn't, and there's enough agreement about what these courses
are for people to write textbooks and run university degrees. But since Claude
Code was released in May 2025, you can feel the ground shifting.

Some of the below are pure "this worked for me, ymmv". Others are (porportedly)
Grand Unified Theories for the next phase of software engineering. Some are just
written manifestos, others are real CLI tools you can install and try right
away.

- the
  [_zero degree-of-freedom_ approach](https://john.regehr.org/writing/zero_dof_programming.html)
- [Agentic Engineering](https://simonwillison.net/guides/agentic-engineering-patterns/)
- [Chainlink](https://github.com/dollspace-gay/chainlink)
- [Deciduous](https://notactuallytreyanastasio.github.io/deciduous/)
- [Gas Town](https://github.com/steveyegge/gastown)
- there are lots of other reflections on the way forward by luminaries like
  [Andrej Karpathy](https://x.com/karpathy/status/1886192184808149383),
  [Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey),
  [Armin Ronacher](https://lucumr.pocoo.org/2025/6/12/agentic-coding/),
  [Donald Knuth](https://www-cs-faculty.stanford.edu/~knuth/papers/claude-cycles.pdf),
  [Terry Tao](https://terrytao.wordpress.com/2025/11/05/mathematical-exploration-and-discovery-at-scale/)
  and many more.

So the issue isn't so much that there's _no_ theory for Agentic Coding, but
there are lots of nascent (and unverified) theories and it's hard to know which
ones are legit.

But I think this is an opportunity for my class; I'll have 100-200 (maybe more!
estimating student numbers is hard) switched-on final-year and postgraduate
students to try out these theories and see what works. One of the [weekly
provocations](/blog/2026/02/20/comp4020-the-core-mechanic/) is explicitly about
that---finding one theory, using it to build a prototype, and reporting the
reports back to the class.

What will we find? Who knows? The models will also be six months further on by
the end of the course, so the strengths/weaknesses and bottlenecks may change
shift further from where they are now. But I'll share the results of this
experiment on this blog---stay tuned.

[^loudly]:
    I mean, here I am
    [writing a blog series about this course](/blog/tag/comp4020/), so I can't
    exactly claim to be one of the quiet ones.
