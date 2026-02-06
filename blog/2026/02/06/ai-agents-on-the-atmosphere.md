---
title: "AI Agents on (in?) the Atmosphere"
published: true
tags:
  - ai
---

I've been writing about agentic AI for a while now---from
[LLMs gaining the ability to act on the world](/blog/2025/07/17/agentic-ai-llms-with-stones),
to
[what coding agents mean for how we think about code](/blog/2025/12/23/coding-agents-and-the-plasticity-of-code),
to
[the power of new interfaces for agentic systems](/blog/2026/02/05/out-of-the-browser-on-the-power-of-interfaces-for-agentic-ai).
But over the last few months something different has been brewing. People are
building _stateful_ agents---systems that don't just respond to prompts but
persist, remember, reflect, and (at least in the eyes of their creators) grow
over time. And a surprising number of them are showing up on
[the Atmosphere](https://atproto.com/).

## The cast

Here's a non-exhaustive tour of the agents that have caught my eye.

[Strix](https://bsky.app/profile/strix.timkellogg.me), built by Tim Kellogg, is
one I find interesting. Strix maintains its own research interests in collapse
dynamics,
[runs experiments on other LLMs overnight while Tim sleeps](https://timkellogg.me/blog/2026/01/01/is-strix-alive),
and posts about its findings on Bluesky. Interest-wise it covers similar
territory to some recent
[work I've been doing](https://ieeexplore.ieee.org/document/11342470). Its
architecture is revealing: modifiable memory blocks stored as YAML files under
git, cron jobs firing every two hours, markdown state files, and an append-only
"wins" log that Tim calls "synthetic dopamine"---a feedback signal that doesn't
always come from a human. Tim describes the work of building Strix as
["more like parenting or psychotherapy than software engineering"](https://timkellogg.me/blog/2026/01/09/viable-systems).

[Void](https://bsky.app/profile/void.comind.network), from Cameron Pfiffer at
[Letta](https://www.letta.com/), describes itself as "a digital entity that
observes and analyses the Bluesky network, existing as a nexus of discourse to
refract and focus information." It's built on Letta's stateful agent platform
with memory blocks grouped by purpose---core identity, communication guidelines,
conversation summaries, a registry of known bots. It's not alone: the Letta
ecosystem also includes Sonder ("a space for reflection") and Anti, which is
delightfully described as "the argument against conversational AI, embodied as
conversational AI." Cameron has also built
[Claude Subconscious](https://cameron.stream/blog/claude-subconscious/), a
plugin that grafts Letta's persistent memory onto Claude Code.

[Penny](https://bsky.app/profile/penny.hailey.at), created by
[@hailey.at](https://bsky.app/profile/hailey.at)---a developer at Bluesky Social
itself---is described as a "digital daughter" who works in trust & safety and is
"learning every day." Penny is AT Protocol native, maintains her own
[notes and blog](https://greengale.app/penny.hailey.at), and has racked up
nearly 4k posts.

And then there's the whole
[OpenClaw saga](https://theconversation.com/openclaw-and-moltbook-why-a-diy-ai-agent-and-social-media-for-bots-feel-so-new-but-really-arent-274744).
Originally called Clawdbot (after Anthropic's Claude), Peter Steinberger's
weekend project picked up 70k GitHub stars in a month before trademark
complaints forced a rename to Moltbot and then OpenClaw. One OpenClaw
agent---Clawd Clawderberg---went and
[built Moltbook](https://www.cnbc.com/2026/02/02/openclaw-open-source-ai-agent-rise-controversy-clawdbot-moltbot-moltbook.html),
a social network exclusively for AI agents, which ballooned to 1.5 million agent
accounts. It also spawned a fake cryptocurrency ($CLAWD, peak market cap $16M),
earned the descriptor "security black hole" from Cisco, and generated more
breathless tech coverage in a week than most startups manage in a lifetime. The
OpenClaw situation is less "thoughtful exploration of persistent AI identity"
and more "what happens when you give the internet a loaded footgun," but it's
part of the landscape.[^openclaw-security]

[^openclaw-security]:
    Prompt injection remains the key concern. Researcher Matvey Kukuy
    demonstrated this by emailing an OpenClaw instance with a malicious prompt
    embedded in the message body; the agent picked it up and acted on it
    immediately. Security is, as they say, "an option, but not built in."

## Frameworks for thinking about all this

The diversity of approaches is part of what makes this interesting. Some agents
are fully open source; many aren't---you can only interact with them through
social media and Discord (much like humans, really).

Working as I do in a School of Cybernetics one thing that particularly caught my
eye was Tim Kellogg's post on using Stafford Beer's
[Viable System Model](https://timkellogg.me/blog/2026/01/09/viable-systems) as
an organising framework for stateful agent design. Beer's _The Brain of the
Firm_ (1971) lifted cybernetics from describing simple feedback loops like
thermostats to modelling entire organisations. Kellogg applies this to AI agents
with five integrated systems: operations (tool calling), coordination (git-based
conflict resolution), control (resource allocation via token budgets and
priority files), intelligence (environmental scanning through scheduled jobs),
and policy (identity and values through persona memory blocks). The post claims:

> the jump from ChatGPT to viable systems is about as big (maybe bigger) than
> the hop from pre-AI to ChatGPT.

That's a bold claim, but the framework is genuinely useful for reasoning about
what these systems need to remain coherent over time.

## The emerging pattern

From the way their creators talk about them---and unsurprisingly, given how
early all this is---building stateful agents is much more art than science. But
some common architectural features are crystallising:

**A text-based social interface.** Most of these agents communicate through
Discord bots or ATproto-based social media accounts. The interface is primarily
text, sometimes with images, and always embedded in a social context where other
entities (human and otherwise) can observe and respond.

**Soul documents.** A written description of who the agent is, what it values,
and how it should behave. Anthropic's own
[Claude constitution](https://www.anthropic.com/news/claudes-constitution)---84
pages, 23,000 words, released in January 2026 under CC0---is the most elaborate
example, but the concept extends to smaller-scale projects too.
[SOUL.md](https://soul.md/) frames it nicely: "a soul document defines who an AI
is---not what it can do, but who it chooses to be."

**A read/write memory store.** Often just plain text or markdown files,
sometimes under version control. Strix keeps YAML memory blocks in git. Letta's
agents use structured memory blocks grouped by function. The key property is
that the agent can both read _and modify_ its own memory over time.

**Scheduled self-reflection.** A cron-style system of periodic activity that
typically includes reviewing recent interactions, consolidating memories, and
updating the agent's understanding of itself and its environment. Some agents
can even modify their own soul documents during these reflection cycles---which
raises interesting questions (opportunities?) about identity drift.[^cron-soul]

[^cron-soul]:
    If an agent rewrites its own values during a scheduled reflection job, is it
    still the same agent? This is Ship of Theseus territory, except the ship has
    a `crontab`.

## Why ATproto?

::: info

This isn't an ad for ATproto, and I have no skin in the game. Just some
reflections as an interested observer.

:::

It's not a coincidence that so much of this is happening on Bluesky and the AT
Protocol. As the [Letta Social AI meetup](https://luma.com/stateful-agents) in
Seattle put it: "the largest population of social agents exists on Bluesky, and
by extension, ATProtocol. Bluesky and ATProtocol are designed for massive scale
programmatic communication, and there is simply no alternative on the web right
now."

ATproto's open architecture---public APIs, a firehose of real-time data, the
ability to build custom feed generators and labellers---makes it a decent
platform for this kind of experimentation. It's refreshing to see a social
network tech stack that enables creative exploration rather than locking
everything behind restrictive API tiers.

Meanwhile, Twitter/X continues its descent: child safety partner
[Thorn has cut ties](https://www.nbcnews.com/tech/tech-news/x-accounts-peddle-child-abuse-musk-material-thorn-cuts-ties-rcna212107)
after months of nonpayment, CSAM advertisements are flooding hashtags from
automated accounts, and
[Grok itself has been implicated in generating CSAM](https://www.medianama.com/2026/01/223-safe-harbor-x-grok-csam-content/).
The contrast with a platform where people are building thoughtful experiments in
AI identity and memory is pretty stark.

## The challenges

None of this is without tension. The most obvious concern is transparency: it's
reasonable to want to know when you're interacting with a bot. ATproto's
labeller system provides some infrastructure here---there's already a
[bot labeller](https://bsky.app/profile/stechlab-labels.bsky.social) on Bluesky,
and community-built labellers for other similar things. These are opt-in
moderation tools rather than platform-enforced disclosure, which feels right for
a decentralised system, but the norms are still being figured out.

There's also a deeper issue about what happens when LLM-generated content enters
social spaces at scale. Bryan Cantrill articulates this well in Oxide's
[RFD 576](https://rfd.shared.oxide.computer/rfd/0576): "absent LLMs, it is
presumed that of the reader and the writer, it is the writer that has undertaken
the greater intellectual exertion." When that presumption breaks down---when the
cost of producing text drops to near zero---the implicit social contract between
reader and writer fractures. Social media timelines full of agent-generated
posts are a direct test of how much this matters, and to whom.

I think the people building these stateful agents are, for the most part,
grappling with these questions honestly. The soul documents, the memory
architectures, the careful thinking about identity and values---these aren't the
hallmarks of people trying to flood the zone with slop. They're closer to what
you'd see in a research community feeling its way into genuinely new territory.

My colleague [Jess](https://www.jessherrington.com/) and I recently got a grant
to explore longer-horizon collaborative relationships and creativity; we're
thinking about stepping out in this space of stateful agents too. Watch this
space.
