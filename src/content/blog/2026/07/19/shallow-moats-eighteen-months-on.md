---
title: "Shallow moats, eighteen months on"
description:
  "DeepSeek wasn't a fluke: the moats around frontier AI are still shallow, and
  trillion-dollar valuations now depend on them being deep."
tags: [ai]
---

Last Friday in Shanghai, Xi Jinping stood up at the World Artificial
Intelligence Conference and urged the world to
["encourage open source, openness, collaboration and sharing"](https://news.cgtn.com/news/2026-07-17/Full-text-Xi-s-keynote-speech-at-the-2026-WAIC-opening-ceremony-1OQSfeoRvUs/p.html).
The day before,
[29 countries launched the World AI Cooperation Organization](https://www.aljazeera.com/news/2026/7/17/chinas-xi-jinping-launches-new-ai-alliance-what-is-it),
a new Shanghai-headquartered body with the UN Secretary-General in attendance.
That same Thursday, Chinese lab Moonshot
[released Kimi K3](https://simonwillison.net/2026/Jul/16/kimi-k3/), a
2.8-trillion-parameter model that benchmarks within a whisker of the best closed
models from OpenAI and Anthropic. The weights are
[promised as a free download](https://techcrunch.com/2026/07/16/moonshots-upcoming-kimi-3-is-expected-to-close-the-gap-with-anthropics-opus-4-8/)
by the end of the month.[^benchmarks] Within days Moonshot was
[pausing new K3 subscriptions](https://x.com/Kimi_Moonshot/status/2078855608565207130)
because demand had pushed its GPUs to their limits, and on Sunday Alibaba
[announced Qwen 3.8](https://x.com/Alibaba_Qwen/status/2078759124914098291), a
2.4-trillion-parameter model it claims is "second only to Fable 5", with open
weights likewise promised soon.

[^benchmarks]:
    The headline numbers are Moonshot's own, and
    [Simon Willison cautions](https://simonwillison.net/2026/Jul/16/kimi-k3/)
    that benchmark scores have "mostly severed" their correlation with
    real-world usefulness.
    [Artificial Analysis still places K3 third overall](https://artificialanalysis.ai/articles/kimi-k3-achieves-3-in-the-artificial-analysis-intelligence-index-comparable-to-opus-4-8-and-gpt-5-5),
    behind Claude Fable 5 and GPT-5.6.

Eighteen months ago I argued in
[Times Higher Education](/blog/2025/02/18/deepseek-and-shallow-moats/) that
DeepSeek R1 had exposed how shallow the moats around frontier AI really are. The
[leaked Google memo](https://semianalysis.com/2023/05/04/google-we-have-no-moat-and-neither/)
from 2023---"we have no moat, and neither does OpenAI"---was holding up, and my
point then was that universities should think twice before signing exclusive
contracts with any one provider. Since then, the two leading US labs have raised
money at a combined valuation approaching two trillion dollars. That is, in
effect, a bet that the memo was wrong.

All benchmarks are game-able and so it's too simplistic to say open-weight
models have "caught up". Epoch AI's tracking shows the gap
[widened through 2025](https://epoch.ai/data-insights/open-closed-eci-gap). This
year a cluster of Chinese releases (Qwen 3.5, GLM-5 and the Kimi series) pulled
it closed again. Across the whole eighteen months, the frontier lead has
[stayed bounded at roughly three to six months](https://openrouter.ai/blog/insights/the-open-weight-models-that-matter-june-2026/).
That is what the shallow-moat claim looks like in practice---whatever capability
you are paying top dollar for today will be powering the free Maccas chatbot by
Christmas.

China's open-source strategy was already being called
[a geopolitical earthquake](https://theconversation.com/deepseek-how-chinas-embrace-of-open-source-ai-caused-a-geopolitical-earthquake-249563)
in the weeks after DeepSeek's release. You can read Xi's speech as
statesmanship: AI as a global public good,
["not a solo performance by a single country"](https://english.news.cn/20260717/128a3c67ccdd44e0b80b5b10b9c01475/c.html).
[Ten billion downloads](https://news.cgtn.com/news/2026-04-28/China-open-source-AI-models-surpass-10-billion-downloads-1MHRuzMktIA/p.html)
of Chinese open models suggest the offer is being taken up. But you can read it
just as easily as strategy, the classic play of
[commoditising your complement](https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/):
give away the thing your rival sells, and their core asset becomes a public
good. Both readings lead to the same policy, and commitments tend to survive
when principle and interest align. This is why the prediction that Chinese labs
would
[stop open-sourcing once they caught up](https://fortune.com/2026/06/16/china-ai-deepseek-open-source-efficiency-global-expansion-strategy/)
keeps failing to come true. As Nathan Lambert puts it, sustained
frontier-adjacent releases bend open models
[from "soft power" to just "power"](https://www.interconnects.ai/p/on-chinas-open-source-ai-trajectory).
There are counter-currents: Reuters reports that Beijing has
[privately weighed restricting overseas access](https://time.com/article/2026/07/07/china-ai-models-alibaba-bytedance/)
to its top models, and
[Alibaba's newest flagship is API-only](https://www.chinatalk.media/p/chinas-ai-companies-are-going-closed).[^qwen38]
Watch those threads, because they mark the places where principle and interest
pull apart.

[^qwen38]:
    Sunday's Qwen 3.8 announcement sits right on this fault line: the weights
    are promised, but for now the model is available only through Alibaba's paid
    preview APIs, and as of publication there's no model card on Hugging Face. A
    promise of open weights is not the same thing as a download link.

The other new part of the story since early 2025 is safety. Anthropic now
[ships its frontier model in two forms](https://www.anthropic.com/news/claude-fable-5-mythos-5).
The public Fable 5 wraps the model in classifiers that block dual-use cyber and
biology work; Mythos 5 lifts those safeguards for vetted partners. Security
researchers
[aren't happy](https://techcrunch.com/2026/06/10/cybersecurity-researchers-arent-happy-about-the-guardrails-on-anthropics-fable/),
since even routine code review can trip the filters.[^fallback] Then this
month's
[Hugging Face security incident](https://huggingface.co/blog/security-incident-july-2026)
showed how this can bite in practice. An attacker drove an autonomous agent
framework through the company's dataset pipeline. When the defenders fed 17,000
attacker log entries to hosted models for forensic analysis, the providers'
guardrails refused. Hugging Face finished the job on a self-hosted Chinese
open-weight model. The attacker, of course, was not subject to any usage policy
at all. None of this means the guardrails are unmotivated: Anthropic has
[documented alarming misuse](https://www.anthropic.com/news/disrupting-AI-espionage)
of its own models. But safety-by-gatekeeping only works while the gatekeepers
hold a monopoly on the capability. And
[Bruce Schneier notes](https://www.schneier.com/blog/archives/2026/04/on-anthropics-mythos-preview-and-project-glasswing.html)
that much of what's gated has already been reproduced with cheaper, older
models.

In February 2025 this was a procurement question for university administrators.
It's now a macroeconomic one, though the procurement question hasn't gone away.
If the capability you are licensing commoditises within two quarters, a
multi-year exclusive contract is a bet against the trend line, made with money
that could be funding tutors. OpenAI last raised at an
[$852 billion valuation](https://openai.com/index/accelerating-the-next-phase-ai/),
Anthropic's latest round
[values it at $965 billion](https://www.anthropic.com/news/series-h),
and both have filed confidentially for IPOs
([Anthropic](https://www.anthropic.com/news/confidential-draft-s1-sec), then
[OpenAI a week later](https://fortune.com/2026/06/09/openai-files-confidential-s-1-sec-ipo/)).
The hyperscalers have guided to roughly $700 billion of capital expenditure this
year.[^capex]

[^capex]:
    The sum of company guidance: Amazon ~$200 billion, Microsoft ~$190 billion
    (its FY26), Alphabet $180--190 billion and Meta $125--145 billion. Analyst
    tallies for the combined 2026 figure run from
    $650 billion up to Moody's
    $785 billion, so "roughly $700 billion" is the
    conservative middle.

I'm not going to add to the pile of
["it's a bubble" warnings](https://theconversation.com/friday-essay-despite-the-ai-hype-some-experts-warn-of-a-bubble-what-happens-if-it-pops-283903),
because forecasting the timing of market corrections is a mug's game. The
narrower point stands on its own. Those valuations embed the assumption that a
handful of companies will capture most of the value from frontier AI, and the
eighteen-month experiment keeps returning evidence against it. The
counter-evidence is real, though, and it cuts both ways. On
[Vercel's AI gateway](https://vercel.com/blog/ai-gateway-production-index-july-2026),
open models now serve 29% of tokens but earn under 4% of the spend, so the labs
still have the revenue. Token share moved first; whether the dollars follow is
the open question.

The strongest counterargument comes from Ben Thompson. He
[concedes the model layer is commoditising](https://stratechery.com/2026/agents-over-bubbles/),
but argues the moat has moved up to the agent-harness and integration layer, so
the capex is warranted. Maybe that's true, but even if it is, the memo was right
about the models. And harnesses are even more hot-swappable than weights.
Moonshot's own developer docs
[pitch K3 for "programming agent scenarios such as Claude Code"](https://platform.kimi.ai/docs):
the Chinese labs are building drop-in engines for the US labs' own tooling, and
switching is close to a one-line change.

My advice eighteen months ago was for universities to stay provider-agnostic.
The students and early-career researchers that advice was written for are the
first to be priced or gated out of frontier models. They are also the first to
notice that the open ones are now good enough. That has consequences for how
universities teach with AI, not just how they buy it: curricula and assessment
built around one provider's products will date as fast as the contracts. Hugging
Face's post-mortem generalises the advice to everyone:
[have a capable model you can run on your own infrastructure](https://huggingface.co/blog/security-incident-july-2026),
vetted and ready, before you need it. What looked like campus prudence in
February 2025 now reads as basic operational hygiene. The moats haven't got any
bigger, but the stakes have.

[^fallback]:
    When Fable 5's classifiers trigger, the request is
    [handed to the older (and less capable) Claude Opus 4.8](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5).
    Anthropic says more than 95% of sessions never see the fallback; frustrated
    security researchers seem well-represented in the remainder. In the
    interests of disclosure: I researched and drafted this post with Fable 5's
    assistance, and no guardrails were harmed in the process.
