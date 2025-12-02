---
title: "Hosting a genAI trivia night"
tags:
  - ai
---

# Hosting a genAI trivia night




I was recently tasked with organising a trivia night, and decided to generate
all the questions (and answers) with a large language model (I used
[Claude](https://claude.ai/), although obviously this would work with any model.

Here's the initial prompt I used:

> Write a set of questions (10 rounds, 5 questions per round) for a trivia
> night, including answers. Each round must have a different theme, including
> rounds on the topics of "_insert list of rounds here_". You must provide
> questions which have a single, unambiguous correct answer. Include a mix of
> easy and difficult questions, such that a graduate-level audience would get
> approximately 50% of the answers correct.

Looking over the answers, they looked a little too easy, so I provided a
follow-up:

> Those questions are all too easy. Try again, and dial up the difficulty.

which gave questions which looked (to my eyes) to be around the right level.

Now, LLMs are notorious for hallucinating/making up facts, and I couldn't be
bothered to check that all the answers were correct. So I incorporated this "is
the LLM making stuff up?" dynamic into the rules. As well as the usual trivia
night procedure:

- 1 pt per question
- each question will be read **twice** (no more than that)
- we'll give answers and tally scores after each round
- no cheating (internet _or_ AI models, inc. self-hosted ones)

there was an additional rule: at the end of each round, each team can challenge
any answer(s) they think the LLM got wrong. For each challenge, the trivia hosts
would investigate (using the internet, or whatever) to see what the correct
answer is.

- if the LLM's answer was wrong, _all teams_ have that question re-marked with
  the correct answer
- if the LLM's answer was ambiguous (i.e. it was correct, but there are other
  answers that were equally correct) then _all teams_ have that question
  re-marked, accepting any of the correct answers
- if the LLM's answer was correct (or if we can't find a reliable answer in an
  appropriate timeframe) then the question is not re-marked, and the challenging
  team receives an additional one-point penalty

As for whether the LLM was correct/ambiguous/wrong, all decisions by the trivia
hosts were final.

And how'd it go? Pretty well, overall. In the end the questions were a bit too
tricky. Turns out it's really hard to eyeball questions _with_ answers to guess
how many you'd get correct, so if you're going to do that make sure you do it
without looking at the answers.

There was one successful challenge on the night, but overall there didn't seem
to be too many hallucinations. In some ways it would have been more fun if there
were.

Anyway if you need to organise a trivia night and don't want to do any
painstaking research, then give the above prompts a try.
