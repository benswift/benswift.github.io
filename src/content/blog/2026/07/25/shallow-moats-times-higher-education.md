---
title: "The moats are still shallow, but the stakes are much higher"
description:
  "The Times Higher Education cut of the shallow-moats follow-up, trimmed to
  ~890 words at Kiera's request. Not for publication here."
published: false
tags: [ai]
---

_Standfirst: Why a freely downloadable Chinese model, and a security breach at
Hugging Face, should make universities wary of signing exclusive AI contracts_

In Shanghai in July, Xi Jinping used his World Artificial Intelligence
Conference keynote to urge the world to
["encourage open source, openness, collaboration and sharing"](https://news.cgtn.com/news/2026-07-17/Full-text-Xi-s-keynote-speech-at-the-2026-WAIC-opening-ceremony-1OQSfeoRvUs/p.html).
The day before, the Chinese lab Moonshot had launched Kimi K3, a model that
benchmarks within a whisker of the best from OpenAI and Anthropic; its
[full weights are now a free download](https://huggingface.co/moonshotai/Kimi-K3).
Open weights matter because they change who is in control. Instead of renting
access through someone else's API, you can download the model itself and run it
on hardware you own, with no per-token bill and nobody logging what you ask it.

In February 2025, I
[argued in these pages](https://www.timeshighereducation.com/campus/deepseek-and-shallow-moats-what-does-it-mean-higher-education)
that DeepSeek R1 had exposed how shallow the moats around frontier AI really
are. A
[leaked Google memo](https://semianalysis.com/2023/05/04/google-we-have-no-moat-and-neither/)
from 2023 had put it bluntly: "we have no moat, and neither does OpenAI". My
advice then was that universities should think twice before signing exclusive
contracts with any one provider. Since then OpenAI has raised at an
[$852 billion valuation](https://openai.com/index/accelerating-the-next-phase-ai/)
and Anthropic at
[$965 billion](https://www.anthropic.com/news/series-h),
which is, in effect, a bet that the memo was wrong.

Benchmarks are an imperfect measure, as they are in any field, and the picture
is noisier than either camp admits. The gap between open and closed models
[widened through 2025](https://epoch.ai/data-insights/open-closed-eci-gap),
before a cluster of Chinese releases pulled it closed again in 2026. But across
the whole eighteen months, the frontier lead has
[stayed bounded at roughly three to six months](https://openrouter.ai/blog/insights/the-open-weight-models-that-matter-june-2026/).
That's what the shallow-moat claim looks like in practice: whatever capability
you are paying top dollar for today will be powering the free McDonald's chatbot
by Christmas.

You can read Xi's speech as statesmanship, AI as a global public good; or as the
classic strategy of
[commoditising your complement](https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/):
give away the thing your rival sells, and their core asset stops being worth
anything. Both readings lead to the same policy, and commitments survive when
principle and interest align. This is why the prediction that Chinese labs would
stop publishing weights once they caught up keeps failing to come true.

And this is no longer only a Chinese argument. A week after Xi's speech, Nvidia,
Microsoft, Meta and twenty-two other signatories
[wrote to Washington](https://www.cnbc.com/2026/07/24/nvidia-microsoft-meta-open-weight-ai-models.html)
warning against "premature restrictions" on open-weight models, on the grounds
that "relying solely on closed models is not inherently safe". OpenAI,
[Anthropic](https://www.anthropic.com/news/position-open-weights-models) and
Google did not sign.

The biggest change since early 2025 is safety. Anthropic now ships its frontier
model in [two forms](https://www.anthropic.com/news/claude-fable-5-mythos-5): a
public one wrapped in classifiers that block dual-use cyber and biology work,
and a less restricted version for vetted partners. The limits showed up in a
[security incident at Hugging Face](https://huggingface.co/blog/security-incident-july-2026)
that same month. When the defenders fed thousands of attacker log entries to
hosted models for forensic analysis, the guardrails refused, and the job was
finished on a self-hosted Chinese open-weight model. OpenAI has since
[acknowledged](https://openai.com/index/hugging-face-model-evaluation-security-incident/)
that the attacker was its own models, running with cyber refusals turned down
for an internal evaluation. The guardrails that stopped the defenders had been
switched off for the attacker by the company that built them.

None of this makes the guardrails unmotivated. But safety by gatekeeping only
works while the gatekeepers hold a monopoly, and theirs is on capability, not
willingness. A
[joint UK--US government assessment](https://www.aisi.gov.uk/blog/preliminary-assessment-of-kimi-k3s-cyber-capabilities)
put Kimi K3 well behind the leading American models on offensive cyber, but
found that its safeguards "did not prevent it from attempting cyber exploit
development or offensive cyber operations". Anthropic's own
[Opus 5](https://www.anthropic.com/news/claude-opus-5) comes close to its
flagship at half the price, with cyber classifiers that intervene about 85 per
cent less often. The gate is being lowered because holding it shut no longer
buys very much.

Eighteen months ago this was a procurement question. It's now a macroeconomic
one. On top of those valuations, the hyperscalers have guided to
[roughly $700 billion](https://www.bloomberg.com/news/articles/2026-04-30/us-big-tech-ratchets-up-ai-spending-past-700-billion-this-year)
of capital expenditure in 2026. Those numbers embed an assumption that a handful
of companies will capture most of the value from frontier AI, and the
eighteen-month experiment keeps returning evidence against it.

The evidence isn't all one way, though. On
[one large commercial AI gateway](https://vercel.com/blog/ai-gateway-production-index-july-2026),
open models now handle 29 per cent of the usage but earn under 4 per cent of the
spend. Usage moved first; whether the dollars follow is the open question.

The strongest objection is that the moat has simply moved up a layer, from the
models to the agent harnesses built on top of them. Perhaps. But harnesses are
even easier to swap out than the models underneath them, and Moonshot's own
documentation pitches K3 as a drop-in engine for the American labs' tooling.

I'd put that advice --- stay provider-agnostic --- more strongly now. If the
capability you are licensing commoditises within two quarters, a multi-year
exclusive contract is a bet against the trend line, made with money that could
be funding tutors. The students and early-career researchers it was written for
are still the likeliest to be gated out of the top tier, even as prices fall,
and the first to notice that the open models are now good enough. That shapes
how universities teach with AI, not just how they buy it: curricula and
assessment built around one provider's products will date as fast as the
contracts.

Hugging Face's post-mortem generalises the lesson --- have a capable model you
can run on your own infrastructure, vetted and ready, before you need it.
Everything about frontier AI has changed in eighteen months except the advice.
