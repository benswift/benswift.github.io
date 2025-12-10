---
title: "LLMs Unplugged: teaching language models with pen, paper, and dice"
tags:
  - teaching
  - ai
  - llm
---

::: tip

Some of this blog post is copied from the actual website copy at
[LLMs Unplugged](https://www.llmsunplugged.org). But it doesn't count as
plagiarism because I wrote it :)

:::

Large language models (LLMs) are everywhere, but how many people actually
understand how they work? Not the hand-wavy "they predict the next word"
explanation, but the actual mechanics of how. That's what
[LLMs Unplugged](https://www.llmsunplugged.org)---a new teaching resource I've
been working on for the last year or so---is for.

The core insight is dead simple: language models predict the next word by
counting patterns. A bigram model asks "after seeing word X, what usually comes
next?" You can teach this with pen, paper, and dice---no computers required.
Learners manually count word transitions, record them in a grid, then roll dice
to generate text. The probabilistic nature becomes tangible instead of
mysterious.

## Why unplugged?

This builds on the [CS Unplugged](https://www.csunplugged.org/) tradition of
teaching computer science concepts without computers. That project has brilliant
activities for teaching algorithms, binary numbers, and compression. But there's
a gap when it comes to language models specifically[^gap].

[^gap]:
    CS Unplugged does have some machine learning activities, but they focus on
    classification rather than generative models.

The unplugged approach has real pedagogical advantages:

- **Transparency**: when you're physically counting transitions and filling in a
  grid, there's no black box. You can see exactly where the probabilities come
  from.
- **Accessibility**: you don't need computers, coding skills, or expensive
  infrastructure. Just paper and dice.
- **Engagement**: rolling dice to generate text is surprisingly fun. There's
  something satisfying about seeing a probability distribution manifest as
  actual words. Honestly I think this is just as fun as a team bonding/bucks'
  night activity, but the learning is real.
- **Transferability**: once you've built a bigram model by hand, the jump to
  understanding GPT becomes conceptual rather than magical.

## Who's this for?

We've tested this with hundreds of participants across wildly different
contexts: school students (12+), undergrads, senior public servants, educators,
tech professionals. It works for all of them, though for different reasons.

For school students, it demystifies AI and makes probability concrete. For
public servants, it provides a mental model for understanding the AI systems
they're being asked to use and regulate. Even for tech professionals, it's
surprisingly good as a team-building exercise---there's something equalising
about everyone sitting down with pencils and dice[^team-building].

[^team-building]:
    Also turns out that explaining language models to your colleagues without
    using jargon is harder than you think. Good practice.

Parents have used it at home with their kids. Educators have remixed it for
their own classrooms (it's CC BY-NC-SA licensed specifically for that). But I
really think that this is just the beginning, and I (along with the team at the
Cybernetic Studio at the ANU School of Cybernetics) have some big plans for LLMs
Unplugged in 2026.

## What you actually do

The core activity goes like this:

1. pick a simple text corpus (we provide booklets with pre-selected texts)
2. manually count word transitions: if "the" appears 10 times, and "cat" follows
   it 3 times, record that
3. fill in a grid showing the counts for each word pair
4. convert counts to probabilities (or just use the counts directly---dice don't
   care)
5. roll dice to randomly select the next word based on those probabilities
6. write down these words that "come out" of the model; marvel that they make
   sense, or laugh at their glorious nonsensicality

The "why is this nonsense?" discussion is where the learning happens. Bigrams
have no long-term memory. They can't track sentence structure or maintain
coherent topics. This limitation becomes _super_ obvious when you generate "The
cat sat on the cat sat on the..."

Then you can talk about how real language models address these limitations.
Bigger context windows. Attention mechanisms. Training on trillions of tokens
instead of a few paragraphs. Suddenly the path from your pencil-and-paper model
to ChatGPT or Claude or Gemini is a little clearer.

This approach teaches the fundamental mechanism of language models, but it
doesn't capture everything: the scale really is incomparable (a few hundred
words vs billions of parameters).

But those limitations are pedagogically useful. Once you understand bigrams
deeply, the extensions to more sophisticated models become natural questions.
"What if we looked at more context?" leads to trigrams and N-grams. "What if
words had relationships beyond just sequence?" leads to embeddings. "What if we
could focus on relevant parts of the context?" leads to attention. And there are
LLMs Unplugged lessons which cover all these topics and more. The unplugged
approach gives you the conceptual foundation. It's not trying to replicate
production LLMs---it's trying to make the core ideas understandable.

## What's next

The fundamentals are solid, but there's more work to do---in particular to road
test this in a wide range of classrooms (and boardrooms). The bones of the
activity are the same, but there are always going to be tweaks which can help it
land for a particular audience.

If you're an educator, check out the [materials](https://www.llmsunplugged.org/)
and use them. If you teach a workshop, I'd love to hear how it goes. If you find
gaps or confusion points, [send me an email](mailto:ben.swift@anu.edu.au) or
open an issue on the
[GitHub repo](https://github.com/ANUcybernetics/llms-unplugged). This is meant
to be a living resource, not a finished product.

::: info

The LLMs Unplugged site is at
[llmsunplugged.anu.edu.au](https://llmsunplugged.org). All materials are CC
BY-NC-SA licensed for educational use. The code's on
[GitHub](https://github.com/ANUcybernetics/llms-unplugged) if you want to dig
into the implementation details or contribute.

:::

The best way to understand how something works is to build it yourself
(honestly, this is my approach to software development as well). Even if your
version is a dramatically simplified pencil-and-paper sketch, the act of
construction creates an understanding that no amount of explanation can match.
That's what _LLMs Unplugged_ is about: giving people the tools to build their
own understanding of language models, one dice roll at a time.
