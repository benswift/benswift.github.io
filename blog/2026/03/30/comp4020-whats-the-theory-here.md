---
title: "The road to COMP4020: what's the theory here?"
description: "There are lots of nascent theories for agentic coding---here's a survey, and
  a plan to test them with 200 students."
tags: [comp4020]
image: /assets/images/posts/comp4020-whats-the-theory-here.svg
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

I was chatting with the CIO of a government agency last week and they asked
about this course. They're wrestling with this very issue: in the age of agentic
coding agents, how do I structure my teams, development workflows and QA
processes?

The answer which I gave him, which I believe to be true in my bones, is that
nobody really knows for sure. But a lot of folks are trying to figure it
out---some in private conversations inside their organisations, some very
loudly on (ugh!) LinkedIn, and lots in between[^loudly].

The question was really one of _theory_; while there are many in the hard
sciences that would criticise software development/engineering as having a
lamentably loose proof relationship between the theory (agile! scrum! 10x
developers!) and what works in practice, at least there are theories about what
works and what doesn't, and there's enough agreement about what these courses
are for people to write textbooks and run university degrees. But since Claude
Code was released in May 2025, you can feel the ground shifting.

Here's my attempt at a survey. Some of these are genuinely impressive; others
I'm still not sure about. I've split them into rough categories, though there's
plenty of overlap---the best frameworks come with tools, and the best tools
embody a theory about how work should flow.

:::info

None of the resources below are "getting started" guides---if you haven't
actually used any of these tools yet, each vendor has official onboarding docs:
[Claude Code](https://code.claude.com/docs/en/quickstart),
[Codex CLI](https://developers.openai.com/codex/quickstart),
[Gemini CLI](https://geminicli.com/docs/get-started/), and
[GitHub Copilot CLI](https://github.com/github/copilot-cli-for-beginners).
These are practical "here's how to install and use our thing" resources, not
theories about how agentic coding _should_ work---but they're worth running
through before diving into the methodological debates below.

:::

### Frameworks and methodologies

These are the structured approaches---the ones with a name, a thesis, and
(usually) a manifesto. They're trying to answer "how _should_ we work with
agents?" rather than just "how _do_ we work with agents?"

- John Regehr's
  [_zero degree-of-freedom_ approach](https://john.regehr.org/writing/zero_dof_programming.html)---constrain
  the agent so tightly that there's only one correct output
- Simon Willison's
  [Agentic Engineering](https://simonwillison.net/guides/agentic-engineering-patterns/)
  guide---ongoing, "kind of book-shaped", and probably the most comprehensive
  single resource right now
- [spec-driven development](https://harper.blog/2025/04/17/an-llm-codegen-heros-journey/)---Harper
  Reed's "hero's journey" post is the canonical intro, and the thesis is blunt:
  "the spec is the godhead"
- Jesse Vincent's [Superpowers](https://github.com/obra/superpowers)---enforces
  mandatory design, planning, and TDD via composable markdown "skills" that you
  bolt onto your agent
- Anthropic's own practices, documented in their
  [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
  guide and the
  [how Anthropic teams use Claude Code](https://claude.com/blog/how-anthropic-teams-use-claude-code)
  blog post
- Birgitta Böckeler's
  [harness engineering](https://martinfowler.com/articles/harness-engineering.html)---a
  framework of "guides" (feedforward controls) and "sensors" (feedback controls)
  for steering coding agents toward better output while reducing human
  supervision
- the Deer Valley retreat consensus, written up by
  [Martin Fowler](https://martinfowler.com/bliki/FutureOfSoftwareDevelopment.html)---about
  50 luminaries (Beck, Yegge, Gene Kim, etc.) locked in a room hashing out the
  future of software development. Chad Fowler's framing: "the rigour has to go
  somewhere"

### Tools

Things you can actually `pip install` or `npm install` and try right now. These
overlap with the frameworks above---the best tools are opinionated about
workflow.

- [Deciduous](https://notactuallytreyanastasio.github.io/deciduous/)---decision
  trees for AI coding agents, so your agent's choices are queryable and
  persistent
- [Chainlink](https://github.com/dollspace-gay/chainlink)---a CLI issue tracker
  designed specifically for AI agent workflows
- [Gas Town](https://github.com/steveyegge/gastown)---Steve Yegge's multi-agent
  orchestrator for running 20--30 Claude Code instances in parallel (named after
  Mad Max, naturally)
- GitHub's [spec-kit](https://github.com/github/spec-kit)---an official toolkit
  for spec-driven development, agent-agnostic
- [Plandex](https://github.com/plandex-ai/plandex)---plan-first CLI agent with
  version-controlled plans and a sandbox for reviewing diffs before applying
- Jeremy Howard's
  [Solveit](https://www.answer.ai/posts/2025-10-01-solveit-full.html)---explicitly
  "the opposite of vibe coding", all about small steps and deep understanding

### Reflections from practitioners

And then there's the "I tried it and here's what I think" genre. These are
valuable precisely because the authors have enough credibility and experience to
say something beyond "wow, cool"---though several of them do also say "wow,
cool".

- [Andrej Karpathy](https://x.com/karpathy/status/1886192184808149383) coined
  "vibe coding" and later refined his thinking toward "agentic engineering"
- [Ryan Dahl](https://x.com/rough__sea/status/2013280952370573666) (Node.js,
  Deno) declared "the era of humans writing code is over"---2.3 million views
  and counting
- [Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey)
  documented the full arc from scepticism to productive use
- [Charity Majors](https://charitydotwtf.substack.com/p/2025-was-for-ai-what-2010-was-for)
  argues 2025 was for AI what 2010 was for cloud---but writing code was always
  the easy part; observability and ops are where it gets real
- [Armin Ronacher](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)---practical
  agentic coding recommendations from the Flask/Sentry creator
- [Maggie Appleton](https://maggieappleton.com/gastown) on agent orchestration
  patterns and why design and critical thinking are the new bottlenecks, not
  code generation
- [Cassidy Williams](https://cassidoo.co/post/vibe-coding-yawn/) found vibe
  coding effective but joyless---"there's no 'YAY I am a GENIUS' feeling"
- [Kent Beck](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent)
  on TDD as counterbalance to AI agents ("agents keep trying to delete tests to
  make them pass")
- [antirez](https://antirez.com/news/154) (Redis creator) on "automatic
  programming" vs vibe coding---"LLMs are good amplifiers and bad one-man-band
  workers"
- [Jeremy Howard](https://www.answer.ai/posts/2025-10-01-solveit-full.html)---sceptical
  of autonomous agents, built Solveit as the antidote
- [Paige Bailey](https://softwareengineeringdaily.com/2025/01/09/ai-developer-tools-at-google-with-paige-bailey/)
  on AI developer tools at Google and why Gemini 3 is built for "acting and
  coding", not just chatting
- [DHH](https://world.hey.com/dhh/promoting-ai-agents-3ee04945) flipped from
  sceptic to enthusiast and made it look dramatic
- [Donald Knuth](https://www-cs-faculty.stanford.edu/~knuth/papers/claude-cycles.pdf)
  opened with "Shock! Shock!" after Claude solved an open graph theory problem
  he'd been working on for weeks
- [Terry Tao](https://terrytao.wordpress.com/2025/11/05/mathematical-exploration-and-discovery-at-scale/)
  on AI-assisted mathematical exploration at scale

So the issue isn't so much that there's _no_ theory for Agentic Coding, but
there are lots of nascent (and unverified) theories and it's hard to know which
ones are legit.

But I think this is an opportunity for my class; I'll have 100-200 (maybe more!
estimating student numbers is hard) switched-on final-year and postgraduate
students to try out these theories and see what works. One of the
[weekly provocations](/blog/2026/02/20/comp4020-the-core-mechanic/) is
explicitly about that---finding one theory, using it to build a prototype, and
reporting the reports back to the class.

What will we find? Who knows? The models will also be six months further on by
the end of the course, so the strengths/weaknesses and bottlenecks may shift
further from where they are now. But I'll share the results of this experiment
on this blog---stay tuned.

[^loudly]:
    I mean, here I am
    [writing a blog series about this course](/blog/tag/comp4020/), so I can't
    exactly claim to be one of the quiet ones.
