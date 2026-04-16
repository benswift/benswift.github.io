---
title: "The road to COMP4020: managing the strategic token reserve"
description: "How to provision and manage AI token budgets for a class of agentic coding
  students."
tags: [comp4020]
image: /assets/images/posts/managing-the-strategic-token-reserve.svg
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

:::info

**Update:** the platform question is now settled---we're running on Anthropic's
Claude API. See
[Anthropic comes to the party](/blog/2026/04/02/anthropic-comes-to-the-party/).

:::

There's an oil crisis going on; you might have
[heard about it](https://theconversation.com/the-iran-war-has-triggered-a-fuel-price-rise-what-does-this-mean-for-australian-consumers-277605).
Australia (and I presume other countries too) are having to
[draw upon their strategic oil reserves](https://lighthouse.mq.edu.au/article/2026/march-2026/could-australia-run-out-of-petrol).

As I mentioned in my [sharp tools](/blog/2026/02/17/comp4020-sharp-tools/) post,
I want my students to have a proper token allocation. Not necessarily
[Jensen-level](https://www.cnbc.com/2026/03/20/nvidia-ai-agents-tokens-human-workers-engineer-jobs-unemployment-jensen-huang.html),
but enough that they can use CLI coding agents in anger without having to stop
all the time to wait for their token budget to reset. This is our Strategic
Token Reserve, and we want to ensure it's used equitably for all students.

My preferred option for doing this is just to have a big pool of tokens and
manage their use myself through the usual enterprise controls that the platforms
offer. Then, I can write tooling to manage it in a way that supports student
learning in the Agentic Coding Studio. Some things I'd want to be able to do
with this tool are:

- creating an API token to students as they enrol (and revoking if they drop out
  for whatever reason)
- setting (ideally platform-enforced) student token allocations (per course, per
  week, etc.) and reset periods
- reporting on actual token use: with breakdowns by student, studio crit group,
  and across the whole class, including stats on how often limits were being
  hit, etc.

I say "ideally" because the current state of the
[Admin API](https://docs.anthropic.com/en/docs/administration/administration-api)
doesn't quite get us there. The platform offers monthly spend caps per workspace
and per-minute rate limits, but nothing like "500k tokens per week per
student"---and even the spend caps can only be configured through the Console,
not via the API. The usage reporting side is solid, and you can create
workspaces and manage members programmatically, so the read side of this problem
is well covered. But the quota enforcement logic---polling usage, tracking
cumulative consumption per student per period, disabling and re-enabling API
keys when limits are hit---will need to live in our tooling. More infrastructure
on our side than I'd like, but not a dealbreaker.

Secret scanning (catching tokens accidentally committed and pushed to GitLab) is
handled separately via a GitLab push hook.

I have a few open questions, too:

- what should the limit be?
- how often should it reset?
- if students don't hit their allocation in one time period, should those extra
  tokens carry over?
- should students be allowed to use their allocation outside of class work? my
  gut feel is no, but that'll be hard to enforce
- what happens if a student runs out of tokens? especially if their quota won't
  reset until after their assignment deadline?

At a university-level, my colleague Alex Potanin and I would like to have
visibility on the same info across all the courses that are using these AI tools
(and there are a few at ANU, with more to come). Some sort of dashboard that we
can look at in our DEFCON-style bunker deep beneath the ANU[^bunker] as we train
our students in this brave new world of agentic coding.

## A (hypothetical) CLI tool for the job

This CLI tool doesn't exist yet (although I plan to build it soon) but it might
look like this:

```
$ token-manager --help
Usage: token-manager <command> [options]

Manage AI token allocations for a class of students.

Commands:
  sync     Sync enrolled students from a CSV or enrolment export.
           Provisions new students and revokes dropped ones.
  quota    View or set token allocations and reset periods.
  usage    Report on token consumption with breakdowns by
           student, group, or class.

Options:
  --config <path>   Path to config file [default: ./token-manager.toml]
  --course <id>     Course identifier (e.g. COMP4020-2026-S2)
  -h, --help        Show this help message
  -V, --version     Show version

Examples:
  token-manager sync --source enrolments.csv
  token-manager quota set --limit 500k --reset-period 7d
  token-manager quota set --limit 500k --reset-period 7d --carry-over
  token-manager usage --group "studio-a" --since 2026-03-01
  token-manager usage --format csv > usage-report.csv
```

And I'll almost certainly not call it `token-manager`; some names I'm kicking
around are `goosey` (because the similar tool that I wrote several years ago to
manage large classes of GitLab submissions is called `lucy`). But that's
tbc---stay tuned.

[^bunker]:
    Note to readers and avid watchers of Senate Estimates: there is no such
    bunker.
