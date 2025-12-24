---
title: "Coding agents and the plasticity of code"
tags: [ai, dev]
---

Code has always felt rigid to me. Brittle, even. Most of the ways you poke,
prod, or change it will break it. And even when you know what you're doing and
when you're making a change that's unambiguously a good one you often need to
break it in one place and then manually fix it up in a dozen others to
compensate.

It's not a bad thing; rigid things can be super strong. But it's always felt to
me (in the 20+ years that I've been writing code as a CS academic and
[maker of software things](https://github.com/benswift)) that this is just it's
deal. It's precise, so it's fragile.

[Like](https://lucumr.pocoo.org/2025/12/22/a-year-of-vibes/)&nbsp;[many](https://steveklabnik.com/writing/thirteen-years-of-rust-and-the-birth-of-rue/)&nbsp;[others](https://fly.io/blog/youre-all-nuts/)
in 2025, though, I've been messing around with Claude Code and other coding
agents. It feels different. I talk to the codebase in natural language, and it
_deforms_ but ends up still working (most of the time). It's not that there
aren't a heap of intermediate steps where the agent runs the change-observe-fix
loop, but they usually doesn't require my intervention. So the overall feeling
is of code that bends but doesn't break, and that the code is much more plastic
than before.

Some folks have been thinking about
[malleable software](https://www.inkandswitch.com/essay/malleable-software/) for
a while now. Their framing:

> The original promise of personal computing was a new kind of clay. Instead, we
> got appliances.

Geoffrey Litt's essay
[Malleable software in the age of LLMs](https://www.geoffreylitt.com/2023/03/25/llm-end-user-programming.html)
explores how LLMs might finally deliver on that promise, enabling end-users to
reshape their tools without learning to program.

But I'm coming at this from a different angle (indeed, it's why I used "plastic"
in this post rather than the term malleable, which would otherwise be a good
synonym). I already know how to program. The brittleness I'm describing isn't
about lacking the skills to modify code---it's about the sheer effort required
to hold all the pieces in your head while you do it. The "activation energy"
required to take a bite out of a big refactoring task where you know lots of
changes have to be made all through the codebase and the thing won't work until
they're all done. The agent absorbs that cognitive load. It remembers which
files need updating, runs the tests, fixes the knock-on errors.

## What does it all mean?

I wouldn't call what I'm doing vibecoding. I'm at least looking at (and
sometimes tweaking) every diff. Or maybe that is vibecoding; I don't really
care. I often watch the agent do its thing, and interrupt it when I can see that
it's doing something dumb. That happens less than it did even six months ago,
but it still happens. But more and more I find myself nudging the agent with
language to do stuff that I know how to do in code.

Paradoxically, the things that help the writing-code-with-an-agent process feel
more plastic are the things that (in another sense) make it more brittle: adding
tests and using types (even in languages where they're optional). But they give
that signal to the agent---the thing you changed here means you broke something
else over here and you need to fix it---which is really good at responding
correctly to that signal. And I'm freed up to make changes and then see their
endpoints, where things "work" for a shallow definition of that term, and I get
to do the deeper reflecting on whether the change is any good.

I really do think I've been more productive this year. It's true that I'm in a
bit of a goldilocks zone for these tools: I've already been doing this for 20
years and have lots of experience, I'm a wide but (in some cases) shallow
software development dilettante so I know approximately what tool to reach for
in lots of situations even when I'm fuzzy on the details, and I also have a job
that involves a _lot_ of writing experimental/research prototypes to explore
interesting ideas, but no-one dies if my software has bugs in it.

But as I reflect on the year that was, it's this feeling of software plasticity
that I think is the main change that coding agents have given me. And I quite
like it, and I'm excited to see what happens as they get better.

::: info Plug for LLMs Unplugged

It's not about the plasticity stuff, but as well as using these models a lot
this year I've also been thinking a lot about how we teach students (and the
wider public) about what LLMs are, what they aren't and how they work. The
fruits of that labour are now online at <https://www.llmsunplugged.org> and if
you check them out and find them useful I'd
[love to hear your feedback](mailto:ben@benswift.me).

:::
