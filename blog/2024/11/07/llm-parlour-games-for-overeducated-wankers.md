---
title: "LLM Parlour Games for Overeducated Wankers"
tags:
  - teaching
  - ai
---

_Note: this stuff is the workshop content for an alumni workshop in November
2024 hosted by the Cybernetic Studio at the ANU School of Cybernetics._

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

## Tech note

This workshop requires access to a chat-based LLM (e.g. ChatGPT). If you've got
a laptop (or even a phone, although you'll be typing on your janky little phone
keyboard) you can head to [https://chatgpt.com](https://chatgpt.com) (no sign-up required). But if
you've got a different favourite chat-based LLM, feel free to use that instead.

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

To start, let's have the LLM be the "answerer" and you (and other human players)
be the "questioner", although you'll need to have someone at a laptop be the LLM
surrogate. Have them use this (or similar) prompt, and don't show the output to
the questioner(s).

```markdown
You're playing Twenty Questions, so you need to choose an object and tell me
what it is (I won't tell the other players).
```

Then, the questioner(s) can ask the LLM questions (via the surrogate) like:

```markdown
Is the object you're thinking of bigger than a car?
```

The surrogate continues to mediate between the LLM and the questioners until
there's a winner (either a questioner guesses correctly, or there have been 20
questions).

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

```markdown
Which of these words/phrases best describes your perfect date?
```

```markdown
Which of these words/phrases is the purplest?
```

```markdown
Which of these words/phrases most evokes the experience of a crisp winter sunrise in Canberra?
```

```markdown
Which of these words/phrases would be the best title for a sci-fi movie?
```

```markdown
Which of these words/phrases is the most nihilistic?
```

```markdown
Which of these words/phrases has the most assonance?
```

```markdown
Which of these words/phrases is the most disrespectful?
```

```markdown
Which of these words/phrases would be the best name for a pet cat?
```

```markdown
Which of these words/phrases sounds most like a boy band track from the 90s?
```

```markdown
Which of these words/phrases would be the easiest to explain to a toddler?
```

```markdown
Which of these words/phrases would be the best password for a secret underground antifascist network?
```

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
