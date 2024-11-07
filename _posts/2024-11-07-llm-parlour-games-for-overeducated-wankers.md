---
title: LLM Parlour Games for Overeducated Wankers
tags: teaching ai
---

_Note: this stuff is the workshop content for an alumni workshop in November
2024 at the ANU School of Cybernetics._

## Abstract

In this interactive design session participants will design and prototype their
own language-model-based parlour game. We'll think critically about what
language models are (and aren't) and what they're good for (and rubbish at).
You'll interact with other humans and design systems with goals and guardrails,
and think about what it means to give input to (and understand output from) LLMs
and genAI systems.

Prerequisites: ability to lounge around and use big words to impress your
friends in games of no stakes whatsoever. Self-satisfied smugness about said
loquaciousness is helpful but not essential.

## Outline

- intro
- play 20 questions
  - shareback
- adventures in amphibology
  - shareback
- design your own LLM parlour game
  - shareback

## Thesis statement

> the killer app for genAI is parlour games for overeducated wankers

(this is a demographic I know well, because I am one)

To break it down:

- **parlour**: involving co-located humans. Bored. Night outside, drinks and a
  warm fire inside... and so

- **games**: to entertain ourselves and each other

...for...

- **overeducated**: word games, word play, we are masters of language and we
  love to show off

- **wankers**: (literally) self-indulgent. Not about a bigger goal, or doing
  good in the world, it's just for the heck of it.

## Mechanics of a parlour game

```text
10 someone says something
20 someone(s) says something in response
30 GOTO 20
```

As an example, consider the game of
[Twenty Questions](https://en.wikipedia.org/wiki/Twenty_questions).

_Ben scrawls on the whiteboard for 5mins_

## Play: _LLM-augmented 20 Questions_

Here are the prompts (you can copy-paste them automatically with the widget at
the top right of the text).

```markdown
I'm thinking of an object. Ask me a yes/no question about the object and I'll
give you an answer.
```

```markdown
If the object in question is
$OBJECT, what is the answer to the yes/no question "$QUESTION?"
```

### Shareback

- what's the funnest/funniest moment, and why?
- what parts sucked?
- how did your play/strategy/behaivour change over time?
- did you tweak the game rules at all? if so, how?

## Play: _Adventures in Amphibology_

Every player thinks of a word or (short) phrase, writes it down on a piece of
paper and puts it in a hat.

These words/phrases are all fed into an LLM using the following prompt template:

```text
You are an expert in the use of language, and you have been given the following words/phrases:

- <phrase one>
- <phrase two>
- <phrase three>
- etc.

Which of these words/phrases is the most ambiguous, and why?
```

The player who wrote the thing that the LLM chooses scores 1 point. But they're
not the winner just yet.

Using the same words/phrases (i.e. without starting a new ChatGPT session) ask
the LLM to pick again, based on successively different criteria:

{%- for criteria in site.data.amphibology %}

<pre><code class="language-markdown">Which of these words/phrases {{ criteria }}</code></pre>

{%- endfor %}

At the end, the player with the most points wins. You can play as many times as
you like, with new words/phrases and/or new "judging" criteria.

### Shareback

- what's the funnest/funniest moment, and why?
- what parts sucked?
- how did your play/strategy/behaivour change over time?
- did you tweak the game rules at all? if so, how?

## Play: design your own LLM parlour game

Write/draw it up in such a way that a different group (in this workshop) could
play it without you being there to help them out.

### Shareback, and remember

There's no higher purpose here. It's all just parlour games for overeducated
wankers.
