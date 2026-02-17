---
title: "The road to COMP4020: providing sharp tools"
published: false
tags: [comp4020]
---

::: info

This post is part of a series I'm writing as I develop
[COMP4020/8020: Rapid Prototyping for the Web](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web).
See [all posts in the series](/tags/comp4020).

:::

I was at the Australasian Computing Education Conference (ACE) in Melbourne last
week presenting my work on [LLMs Unplugged](https://www.llmsunplugged.org) and
(unsurprisingly) a lot of the discussion was around the use of LLMs in the
classroom.[^llms]

[^llms]:
    There was a running joke where the few presenters whose papers _weren't_
    about LLMs made a point of that fact in their intro, and the rest of the
    presenters sortof gave an apology that theirs was yet another paper on LLMs.
    But I digress.

One fun anecdote from [Claudia Szabo](https://www.adelaide.edu.au/directory/claudia.szabo) was about how she gets her small
kids to help in the kitchen, and that she gives them sharp knives and teaches
them how to use them. And she wants the same for her students in the classroom.

One of my main concerns for teaching COMP4020 later this year (starting
July 2026) is that I want my students to have a) access to the latest agentic
LLMs and b) sufficient token budgets to use them properly. It's not fair to
expect students to shell out 200USD of their own money for a
Claude/ChatGPT/Gemini Max plan; I have to provide them with a strong baseline
(although my current plan is to allow students to use different models if they
wish; it's too hard to police anyway).

GitHub Copilot does have [free student accounts](https://docs.github.com/en/copilot/how-tos/manage-your-account/get-free-access-to-copilot-pro) but they're limited to
300 "requests" (read prompts) per month, or even fewer (by a factor of almost
10!) if students choose Claude Opus 4.6. It's just not enough for me to run the
sort of class and teach the sort of workflows I'm planning to run.

I'm not saying my students need [Gas Town](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04) levels of tokens, but they need
to be able to regularly sit down and have long, interactive back-and-forth
sessions exploring different ideas and implementations.

So, my current options are:

1. get [Anthropic](https://www.anthropic.com)/[OpenAI](https://openai.com)/[Google](https://ai.google), or a company that resells those models like
   [Microsoft](https://www.microsoft.com)/[GitHub](https://github.com)/[Amazon](https://aws.amazon.com) to sponsor the class. I'm thinking that I'll need
   approximately 200 seats (that's the number of students I'm expecting) and
   they'd need **at least** the $20/mo pro-level plan, ideally the $100/mo level
   one---or similar amounts of API credits

2. get a partner with datacenter-grade hardware (e.g. [Canva](https://www.canva.com), [LambdaLabs](https://lambda.ai), or
   ANU's very own [NCI](https://nci.org.au)) to host an open weight model for us, e.g. [Kimi K2](https://moonshotai.github.io/Kimi-K2/) or [GLM5](https://huggingface.co/zai-org/GLM-5)
   using [vLLM](https://vllm.ai)

Option #1 is my slight preference because those folks are _really good_ at
serving these models at scale. If we have to self-host then there's a risk that
I'm on the hook if the model goes down one hour before the assessment deadline.
But it wouldn't be a disaster.

If you work at any of the above companies and would like to get in touch,
[email me](mailto:ben.swift@anu.edu.au). I can offer the good vibes and
publicity that comes with supporting the next generation of software developers
and computer scientists in their learning. And I'm happy to share all the course
materials online, inc. a shout-out to whichever model you end up providing.
You'll also have an opportunity to meet (if you like) the students, who are
awesome and will be highly skilled and looking for work in the near future. And
finally, you'll have my gratitude :)
