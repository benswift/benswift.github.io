---
title: "Agentic AI: LLMs with stones"
tags: ai
---

> Sticks and stones may break my bones, but words will never hurt me.

There's a truth to that proverb, even if you feel (as I do) the temptation to
"well akshually..." make several very valid points about how words _can_ be
hurtful. For most of the Large Language Model (LLM) era---since the public
release of ChatGPT in November 2022---we've been in turns amazed, disgusted and
now kindof "meh" about the way that LLMs can take the **words** we give them and
produce **more words** in response.

Working as I do as an
[academic computer scientist](https://cybernetics.anu.edu.au/people/ben-swift/)
(with a research background in AI) who regularly runs "executive education"
courses on AI for a diverse range of educated and intelligent folks, I'm getting
more and more questions about "agentic AI". And while definitions and
descriptions change pretty quick in this field at the moment, I want to
demistify some things about this term in particular.

Agentic AI (as concieved and talked about in this present moment) is about
connecting LLMs---"pure" input/output text sausage machines---to the world with
**tools**. To return to the "sticks and stones" aphorism above; Agentic AI is an
an LLM holding a stone. Because while OpenAI introduced "function calling" to
GPT models in
[June 2023](https://openai.com/index/function-calling-and-other-api-updates/),
it wasn't until late 2024 that the term "agentic" really took off---coinciding
with Anthropic's release of their
[computer use capabilities](https://www.anthropic.com/news/3-5-models-and-computer-use)
and a general industry shift toward thinking of LLMs as autonomous actors rather
than just conversational partners.

From a cybernetic perspective, this isn't quite as big a change as you might
think. Because even the original ChatGPT could "do stuff in the world" by
telling _you_ (the human user) to do it. Sometimes that was as benign as having
you copying text into an email---and we'd still casually refer to this as
"answering email with ChatGPT", but actually all ChatGPT was doing was giving
you **words** to type into your email client and send out. Sometimes those words
told us to do more life-impacting things, like
[break up with your partner](https://www.vice.com/en/article/we-asked-chatgpt-how-to-break-up-with-someone/),
or worse. So whenever LLMs are used by humans they have the (indirect) ability
to affect the world.

The change with agentic AI is that the LLMs are provided access to specific
tools which they can use do stuff beyond just returning words in a text box on a
web page. In the last couple of years there have been a proliferation of tools
(particularly using a standard interface called the
[Model Context Protocol](https://modelcontextprotocol.io/introduction)). Some
classic examples of tools are "search the web", "add/remove meetings from my
calendar". There are domain-specialised tools depending on what you're doing
with the LLM too---software developers in particular have found ways to use
tools to help them write code. There have been many recent blog posts of various
developers describing how they set up their agentic AI (tool-calling LLM)
systems---from
[Simon Willison's explorations](https://simonwillison.net/2025/Apr/19/claude-code-best-practices/)
to
[Thomas Ptacek's "My AI Skeptic Friends Are All Nuts"](https://fly.io/blog/youre-all-nuts/)
to countless HackerNews threads debating whether this is all just hype.

Here's how it works in practice:

- you put in a prompt as normal which is sent to the LLM
- in addition to that prompt, though, the LLM is sent a list of tools that you
  have (including human-readable descriptions of what they can do)
- instead of only being able to respond with text, the LLM can respond with a
  "tool call" instruction; e.g. it can say "add a meeting to the calendar at
  10am tomorrow using the `calendar` tool"
- in the latter case, the user doesn't need to do anything; the system will use
  the tool as requested by the LLM and return the results (usually the fact that
  this is happening is communicated to the user via some sort of visual feedback
  in the interface, although this isn't a requirement)

## Implications

In my opinion the best way to think about this shift isn't that LLMs can now
influence the world; it's that now they can do it without asking. This means:

1. first, there's now no longer a human in the loop (so now there's no human to
   say "hey, that's a dumb idea" and refuse to do it)
2. as a consequence of #1, LLMs can now run/iterate without intervention for
   much longer (minutes, maybe even hours...)

The second point is the bigger deal (and it's a point that Anthropic, the makers
of the Claude LLM which is one of the big players these days, makes in their
[recent whitepaper about agentic AI](https://www.anthropic.com/engineering/building-effective-agents)).

Humans were always a) able to do things in the environment, and b) the
bottleneck in any LLM system (time-wise, at least). But by gaining the former
capability, agentic AI removes the latter bottleneck.

So if you're going to allow your LLMs to use tools, you **must** be certain that
a) you're comfortable with what things the LLM can do with them (both in theory,
i.e. in the sense of what's possible, but also in practice, i.e. through testing
the way that your particular LLM tends to use your tools given specific prompts
or other context).
