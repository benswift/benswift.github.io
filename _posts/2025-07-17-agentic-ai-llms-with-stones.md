---
title: "Agentic AI: LLMs with stones"
tags: ai
published: false
---

> Sticks and stones may break my bones, but words will never hurt me.

There's a truth to that proverb, even if you feel (as I do) the temptation to
"well akshually..." it and make several very valid points about how words _can_
be hurtful. For most of the Large Language Model (LLM) era---since the public
release of ChatGPT in November 2022---we've been in turns amazed, disgusted and
then "meh" about the way that LLMs can take the **words** we give them and
produce **more words** in response.

But now, working as I do as an academic computer scientist (with a research
background in AI) who regularly runs "executive education" courses on AI for a
diverse range of educated and intelligent folks, I'm getting more and more
questions about "Agentic AI". And while definitions and descriptions change
pretty quick in this field at the moment, I want to demistify some things about
this term in particular.

Agentic AI (as concieved and talked about in this present moment) is about
connecting LLMs---"pure" input/output text sausage machines---to the world with
**tools**. To return to the "sticks and stones" aphorism above; Agentic AI is an
an LLM holding a stone. Because TODO insert brief history of LLMs tool calling.

From a cybernetic perspective, this isn't quite as big a change as you might
think. Because even the original ChatGPT could influence the world by telling
you (the human user) to do stuff. Sometimes that was as benign as copying text
into an email---and we'd still refer to this as "answering email with ChatGPT",
but actually all ChatGPT was doing was giving us **words** to type into our
email client and send out. Sometimes those words told us to do more
life-impacting things, like
[break up with your partner](https://www.vice.com/en/article/we-asked-chatgpt-how-to-break-up-with-someone/),
or worse.

So whenever LLMs are used by humans they have the (indirect) ability to affect
the world. But with Agentic AI, the LLMs are provided access to specific tools
which they can use do stuff beyond just returning words in a text box on a web
page. In the last couple of years there have been a proliferation of tools
(particularly using a standard interface called the
[Model Context Protocol](https://modelcontextprotocol.io/introduction)). Some
classic examples of tools are "search the web", "add/remove meetings from my
calendar". There are domain-specialised tools depending on what you're doing
with the LLM too---software developers in particular have found ways to use
tools to help them write code.

Here's how it works (TODO check this is correct):

- you put in a prompt as normal which is sent to the LLM
- in addition to that prompt, thouth, the LLM is sent a list of tools that you
  have (including human-readable descriptions of what they can do)
- instead of only being able to respond with text, the LLM can respond with a
  "tool call" instruction; e.g. it can say "add a meeting to the calendar at
  10am tomorrow using the `calendar` tool"
- in the latter case, the user doesn't need to do anything; the system will use
  the tool as requested by the LLM and return the results (usually the fact that
  this is happening is communicated to the user via some sort of visual feedback
  in the interface, although this isn't a requirement)

## Implications

has the (perhaps surprising) knock-on effect that LLMs can now run/iterate
without intervention for much longer. To be clear: humans were always a) able to
do things in the environment, and b) the bottleneck (LLMs have to wait on them).
But by gaining the former capability, agentic AI removes the latter bottleneck.

Choosing what tools to provide (and what they can do/have access to) is crucial.

Need to train the models differently.
