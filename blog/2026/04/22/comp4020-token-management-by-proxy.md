---
title: "The road to COMP4020: token management by proxy"
description:
  "Designing a proxy to sit between students and the Claude API: per-student
  quotas, full-traffic logging, and a safety net for leaked keys."
tags: [comp4020]
image: /assets/images/posts/comp4020-token-management-by-proxy.svg
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/). This one is a direct
follow-up to
[managing the strategic token reserve](/blog/2026/03/27/managing-the-strategic-token-reserve/)---now
that
[Anthropic have come to the party](/blog/2026/04/02/anthropic-comes-to-the-party/),
we can design the quota-enforcement tooling against the actual controls their
API provides.

:::

So: we have a $500k pool of Claude credits sitting behind a workspace-level API
key, and we have ~200 students who need to share that pool without eating each
other's lunch. The Anthropic
[Admin API](https://platform.claude.com/docs/en/build-with-claude/administration-api)
will get us part of the way---you can create and revoke keys programmatically,
set monthly workspace spend caps in the Console, pull usage reports---but the
controls are too coarse for what we actually want to do: per-student weekly
token allocations with predictable resets and optional carryover, an audit log
with
enough detail to give the course policy around token use some actual teeth, and
a safety net that catches leaked API keys in plaintext before they escape onto
the open internet.

The only way to get all of that is to put a proxy between the students' Claude
Code sessions and the Anthropic API, and enforce the class-specific policy
there. Happily, the School of Computing's infrastructure team has signed on to build
it and host it on their own infrastructure---this isn't a solo project, and the
scope gets a lot more realistic with their help. The thing has four jobs.

**Authentication and transparent passthrough.** One real Anthropic API key (tied
to our COMP4020 workspace) on the egress side. On the ingress side, each student
has their own virtual API key---issued by us, revocable by us, completely
separate from Anthropic's auth system. Students point their Claude Code config
at the proxy with their virtual key; from their side, it looks like the
Anthropic API. Claude Code talks to `/v1/messages` and gets native
Anthropic-shaped responses back; streaming, tool use, and prompt caching all
work unmodified.

**Per-student quotas with time-based reset.** The proxy counts tokens against
each student's allocation, stops serving requests when they hit their limit, and
resets on whatever cadence we settle on---probably weekly, probably with some
carryover, but that's still
[an open question](/blog/2026/03/27/managing-the-strategic-token-reserve/).

**Full-traffic logging to a local database.** Every request, every response,
tied to the student identity that the virtual key resolves to. This is the
foundation for the audit trail and (with consent) the research corpus, which
I'll come back to.

**Leaked-credential detection.** If a student pastes their virtual key into a
prompt---or any secret matching a known pattern like `sk-ant-api...`---the proxy
detects it, auto-suspends the offending key, and alerts us. Accidents happen,
especially when students are new to agentic workflows. Better to catch them
before the key ends up in a public GitLab repo.

Of those four jobs, the logging is the piece that takes the most thought,
because it cuts in a few directions at once. The simple answer is that it's the
enforcement mechanism. Course policies---use only for coursework, no on-selling,
no harassment, no circumventing academic integrity---are only as real as our
ability to check that they're being honoured. Students will be told this
explicitly, at the start of the course: traffic through the class proxy is
logged. If they want to use Claude Code outside class for personal projects,
nothing stops them; that's their business, on their own Anthropic key, not ours.

It also dovetails with the
[assessment design](/blog/2026/04/15/comp4020-assessment/) I wrote about last
week. Students are already handing in their Claude Code JSONL session logs as
part of each assignment---those logs live on the student's machine and capture
the full local harness state (their `CLAUDE.md`, subagent dispatches, slash
command expansions, and so on). The proxy-side logs are a server-side
counterpart. They don't replace the JSONL logs, but they do make certain claims
checkable that the client-side logs alone don't. A student can't quietly delete
a JSONL and tell me a different story about what happened; the proxy saw the
traffic.

With consent and anonymisation, aggregated proxy logs also become a research
corpus. What does the token-usage curve look like across a 200-student cohort
working on the same weekly provocation? When do students hit context limits?
What does session activity look like in the hours right before the
[aha moment](/blog/2026/04/16/comp4020-pledges-not-questions/)?

That leaves one practical question: how much of this do we actually have to
build from scratch? [LiteLLM](https://docs.litellm.ai/) is the obvious candidate---the
[Claude Code docs themselves point at it](https://code.claude.com/docs/en/llm-gateway)
as a supported LLM gateway. It's MIT-licensed, self-hostable, and Python.
Virtual keys, spend tracking, and Postgres-backed logging are all first-class.
More importantly, there's an Anthropic-native passthrough at
`/anthropic/v1/messages` that lets Claude Code talk the native protocol rather
than being coerced through an OpenAI-compatible translation layer. That last bit
matters more than it sounds---a proxy that makes Claude Code work _almost_ like
the real thing is worse than no proxy at all.

For roughly 80% of the brief, it's a drop-in: virtual key CRUD via
`/key/generate`, `/key/block`, `/key/delete`; the Anthropic-native passthrough;
dollar-denominated budgets with `budget_duration` set to "7d" or "1mo" that
reset automatically; and a `LiteLLM_SpendLogs` Postgres table capturing
per-request metadata.

The remaining 20% is where it gets interesting, because it's the class-specific
policy stuff that probably _should_ be ours:

- **Carryover.** LiteLLM resets budgets cleanly at the end of each period with
  no rollover. That's a small amount of bookkeeping in a custom hook.
- **Full prompt and response bodies in the logs.** The default
  `LiteLLM_SpendLogs` table records metadata and token counts, not bodies.
  Getting full transcripts means wiring up a `CustomLogger` callback that writes
  to our own Postgres---which we probably want anyway, so not really a cost.
- **Secret detection with auto-block.** This is the real gotcha. LiteLLM's
  `hide-secrets` guardrail is Enterprise-only, only fires on their unified
  `/v1/messages` path (not the `/anthropic/*` passthrough we need for Claude
  Code), and even there it's non-streaming-only. Since Claude Code streams,
  effectively _none_ of LiteLLM's built-in secret scanning applies. A custom
  pre-call hook that inspects the prompt, calls `/key/block` on match, and fires
  an alert---that's a couple of hundred lines of Python. Absolutely doable, but
  unavoidable.

Bottom line: LiteLLM for the plumbing, custom hooks for the policy. The
alternative---hand-rolling the whole thing in, say, Elixir or Go---would mean
reimplementing the virtual-key lifecycle, the Anthropic passthrough, the spend
accounting, and the admin endpoints. That's not work anyone wants to sign up
for when a reasonable baseline already exists. The plan is to start with
LiteLLM and write the class-specific bits on top, falling back to hand-rolling
only if we hit a wall we can't climb with a custom callback.

A few things I'm still thinking through:

- **Auth UX.** The default story is virtual keys---issue one per student, paste
  it into Claude Code config, done. But it'd be nicer if students could
  authenticate through ANU's SSO with their standard uni creds, so that key
  issuance and revocation piggyback on an identity system we already trust.
  LiteLLM supports SSO for its admin UI, but the per-user API auth is still
  token-based, and Claude Code expects an API key anyway. So some kind of token
  still has to land on the student's laptop. The question is what the cleanest
  hand-off looks like for both students and convenors: log in via SSO, get a
  virtual key back, paste it in once and forget? Something more automated?
- **How do students see their own quota?** Max-plan users of Claude Code get a
  native "x% of quota remaining, resets at HH:MM" display; I'd love to piggyback
  on that if there's any way to inject the right headers off our proxy to make
  that UI light up. Failing that, an endpoint students can hit from the CLI, or
  a dashboard in a browser, will do. Either way, I want them watching their own
  token-burn rate as they work---if I'm going to teach them about agentic
  coding, the feedback loop has to be tight.
- **What's the recovery path when a student runs out of tokens at 11pm the night
  before a deadline?** A manual override via our admin tooling is fine for the
  rare case, but I don't want to normalise "I ran out, bail me out"---the whole
  point of a quota is to teach that tokens are a finite resource.
- **When does the proxy itself become teaching material?** It's a small,
  well-scoped piece of infra that students could plausibly build something
  analogous to in a few weeks---per-user quotas, DB-backed logs, a webhook-style
  callback. I'm tempted to use it as a demo artefact in lectures.

No doubt more questions will surface once the team sits down to actually build
the thing.
