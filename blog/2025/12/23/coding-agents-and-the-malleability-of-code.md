---
title: "Coding Agents and the malleability of code"
published: false
tags: [ai]
---

Code has always felt rigid to me. Brittle, even. Most of the ways you poke,
prod, or change it will break it. And even when you know what you're
doing---when you're making a change that's unambiguously a good one---you often
need to break it in one place and then manually fix it up in a dozen others to
compensate.

This is the essential character of code, I thought. It's precise, so it's
fragile. That's the deal.

With Claude Code and other coding agents, it feels different. I talk to the
codebase in natural language, and it *deforms* but ends up still working (most
of the time). It's not that there aren't a heap of intermediate steps where the
agent runs the change-observe-fix loop---there are---but it usually doesn't
require my intervention. So the overall feeling is of code that bends but
doesn't break.

There's a research community that's been thinking about [malleable
software](https://www.inkandswitch.com/essay/malleable-software/) for years.
Their framing: "The original promise of personal computing was a new kind of
clay. Instead, we got appliances." Geoffrey Litt's essay [Malleable software in
the age of
LLMs](https://www.geoffreylitt.com/2023/03/25/llm-end-user-programming.html)
explores how LLMs might finally deliver on that promise---enabling end-users to
reshape their tools without learning to program.

But I'm coming at this from a different angle. I already know how to program.
The brittleness I'm describing isn't about lacking the skills to modify
code---it's about the sheer effort required to hold all the pieces in your head
while you do it. The agent absorbs that cognitive load. It remembers which files
need updating, runs the tests, fixes the knock-on errors. The code was always
*theoretically* malleable. Now it actually *feels* that way.

