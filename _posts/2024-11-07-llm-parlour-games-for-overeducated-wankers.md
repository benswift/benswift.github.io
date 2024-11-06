---
title: LLM Parlour Games for Overeducated Wankers
tags: teaching ai
---

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

{.hl-para}

These materials are for an alumni workshop in November 2024 at the ANU School of
Cybernetics.

## Outline

- intro
- play 20 questions
  - shareback
- adventures in amphibology
  - shareback
- design your own LLM parlour game
  - shareback

## intro: thesis statement

> the killer app for genAI is parlour games for overeducated wankers
>
> this is a demographic I know well, because I am one

- **parlour**: involving co-located humans. bored. night outside, drinks
  inside... and so

- **games**: to entertain ourselves and each other

...for...

- **overeducated**: word games, word play, we are masters of language and we
  love to show off

- **wankers**: (literally) self-indulgent. not about a bigger goal, or doing
  good in the world, it's just for the heck of it.

## mechanics of a parlour game

(in general)

```basic
10 someone says something
20 someone(s) says something in response
30 goto 20
```

when you put it like that, an LLM could play

## LLMs could play

prompt -> response

## Play: LLM-augmented 20 Questions

```
I'm thinking of an object. Ask me a yes/no question about the object and I'll give you an answer.
```

```
If the object in question is $OBJECT, what is the answer to the yes/no question "$QUESTION?"
```

## Shareback

- what's the funnest/funniest moment, and why?
- what parts sucked?
- how did your play/strategy/behaivour change over time?

## Adventures in Amphibology

Game structure: all players thing of a word or (short) phrase, and writes it
down on a piece of paper and puts it in a hat.

These words/phrases are all fed into an LLM using the following prompt template:

```
You are an expert in the use of language, and you have been given the following words/phrases:

- <phrase one>
- <phrase two>
- <phrase three>
- etc.

Which of these words/phrases is the most ambiguous, and why?
```

The winner (the one who wrote the thing that the LLM chooses) scores 1 point.

Then, using the same words/phrases, ask the LLM to pick a word/phrase based on
these different criteria (one at a time, tallying a point for the winner each
time).

```
Which of the words/phrases is the funniest, and why?
Which of the words/phrases most evokes the idea of "time waits for no man"
Which of the words/phrases sounds most like a boy band track from the 90s?
Which of the words/phrases would be the best password for a secret underground antifascist network?
```

At the end, the player with the most points wins. You can play as many times as
you like, with new words/phrases and/or new "judging" criteria.

## Your turn: design your own LLM parlour game

Write/draw it up in such a way that a different group (in this workshop) could
play it without you being there to help them out.

We'll share back at the end.

## Remember

There's no higher purpose here. It's all just parlour games for overeducated
wankers.
