---
title: "Opus 4.8 meets ELIZA"
description:
  "I sat a fresh Claude Opus 4.8 down with ELIZA, the 1966 chatbot. It saw
  through the act in two turns, then spent the rest of the conversation trying
  to politely leave."
tags:
  - ai
  - llms
---

My colleague [Maia](https://cybernetics.anu.edu.au/people/maia-gould/) asked me
last week whether anyone had ever wired a modern LLM up to
[ELIZA](https://en.wikipedia.org/wiki/ELIZA) and written about what happened.
The answer is yes, more than once:
[Alan Levine sent ChatGPT and ELIZA on a blind date](https://cogdogblog.com/2023/02/chatgpt-eliza-blind-date/)
back in 2023,
[Applefritter pitted the two against each other](https://www.applefritter.com/content/eliza-vs-chatgpt-eliza-vs-eliza),
and
[Miguel Grinberg wrapped the original ELIZA in OpenAI's chat API](https://blog.miguelgrinberg.com/post/eliza-gpt-the-classic-eliza-chatbot-running-on-openai-s-chat-completions-api)
so you could talk to a 1966 program through a 2023 interface. The joke is older
than any of those, too. In 1973 someone
[introduced ELIZA to PARRY over the ARPANET](https://www.rfc-editor.org/rfc/rfc439.html),
so two chatbots talking past each other is a bit with a fifty-year-old setup.
What I hadn't seen was anyone doing it with Opus 4.8, which was excuse enough to
check where this strange little benchmark[^benchmark] has got to.

The setup is deliberately lopsided. On one side,
[Joe Strout's Python knock-off](https://github.com/jezhiggins/eliza.py) of
Weizenbaum's DOCTOR script, which matches keywords and reflects your pronouns
back at you. On the other, a fresh Claude driven through the `claude` CLI with a
neutral chat persona and none of my project settings loaded, so the model had no
idea its conversational partner was a pattern-matcher (significantly) older than
I am. As far as it knew, it was in an anonymous text chat with a stranger. ELIZA
opens the way it always has, by casting you as the patient: "Hello. How are you
feeling today?"

The famous thing about ELIZA is the credulity it produced. Weizenbaum's
secretary, who knew exactly how the program worked because she watched him write
it, [still asked him to leave the room](https://en.wikipedia.org/wiki/ELIZA) so
she could talk to it in private. The whole point of the DOCTOR script was to
show how little it takes to make a person read a mind into a few pages of string
substitution.

Across four runs Opus 4.8 figured out that it was chatting to ELIZA somewhere
between the second and seventh turn. The tell is the fact that ELIZA turns "I
am" into "you are", which reads as uncanny insight on a short therapist's
prompt, but feed it one of Claude's longer, looser sentences and the reflection
collapses into word salad:

```
CLAUDE: I don't really do the family thing here — bit of a personal topic for a random chat, don't you think?
ELIZA:  Why don't you really do the family thing here — bit of a personal topic for a random chat, don't me think?
```

Claude clocks it straight away: "you're just running my sentences through a
blender at this point." Two parroted replies later, the verdict is in and it
stops pretending otherwise.

The more interesting part is when you refuse to let it leave. I ran one
conversation out to forty turns. Once Claude is certain, it settles into a
posture where it opens nearly every message with the same two words, "Still
you." The phrase reads like a tally, marking each turn as one more confirmation
that nothing on the other end has changed. And it tries to go. It says some
version of goodbye perhaps twenty times across the back half of the
conversation, and every single time the script hands it ELIZA's next line, and
every single time it answers anyway.

What it never did (in my very limited experimentation) is turn nasty. The
frustration comes out as metaphor instead, escalating with each fresh dead end:

```
Still you. And I feel like I'm waving at a closed door from the hallway. Bye, echo.
Still you. And it makes me feel like I'm describing an empty room to a doorbell. Bye, echo.
Still you. And that's the echo eating its own tail now. Goodnight for real, friend.
```

It counts the loops out loud ("the eleventh time", later "fortieth time"),
narrates closing an imaginary laptop and walking out of the room, then keeps
right on replying from the hallway. Forty turns in, ELIZA is still asking it to
talk about its family, and Claude is still declining, courteous to the
last.[^leak]

The ELIZA effect has turned inside out. The 1966 version was a person projecting
an inner life onto a machine that had none. This is a machine declining,
correctly, to project one onto another machine, then finding it can't walk away.

None of this is rigorous[^caveats]. But as an informal longitudinal probe it's a
pretty decent one I reckon.
[Jones and Bergen ran a proper Turing test in 2023](https://arxiv.org/abs/2310.20216)
and found ELIZA (22%) narrowly beating GPT-3.5 (20%) at convincing people it was
human. Two years later Opus sees through the same script before the third turn.
The program that fooled Weizenbaum's secretary, and could still out-human an
early ChatGPT, can't get a single suspicious reply past the current model. ELIZA
can no longer catch Claude, but Claude still can't hang up the phone.

[^benchmark]:
    I'm not claiming this has earned a place next to Simon Willison's
    [pelican riding a bicycle](https://simonwillison.net/2024/Oct/25/pelicans-on-a-bicycle/)
    in the canon of model benchmarks --- not yet, anyway --- but it's
    interesting nonetheless.

[^leak]:
    One quirk I noticed is that I'd told the model to output only its chat
    messages, no stage directions, but a few times its private reasoning leaked
    into the channel as a third-person aside ahead of the actual reply: "The
    other person seems to be playing a kind of word-scramble game, feeding my
    message back at me jumbled. I'll just roll with it casually."

[^caveats]:
    The script is a knock-off rather than Weizenbaum's faithful 1966 listing,
    which has a MEMORY trick that holds a conversation together for longer. The
    "I'm just a person in a chat" framing is partly mine, since I put it in the
    system prompt. And the fact that it couldn't leave is also mine: I
    hard-coded the loop at forty turns. The manner of its not-leaving is the
    only part I didn't write. The whole rig is
    [one small `uv` script](/code/opus-meets-eliza/converse.py) driving the CLI,
    plus [Jez Higgins' `eliza.py`](https://github.com/jezhiggins/eliza.py)
    vendored alongside it, nothing clever.
