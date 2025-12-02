---
title: "Running Claude Code within Zed"
tags:
  - ai
  - dev
---

# Running Claude Code within Zed




After several months using Zed's built-in
[Agent panel](https://zed.dev/docs/ai/agent-panel) I've switched to Claude Code.
The main reason is cost. I'm still using the same models---still primarily
Sonnet (and occasionally Opus) 4---but using them via the Agent panel incurs
per-token billing via the Anthropic API. I was racking up a lot of costs (around
100USD/week) even with a _bit_ of restraint, although still using it fairly
heavily during all work days.

Claude Code allows one to pay a flat-fee subscription (I'm now nearly through my
first month of [MAX 20x](https://www.anthropic.com/max), so I'm already ahead).
And it's _really nice_ to have the flat fee; it does change the way you use the
agent (and sub-agents).

One downside is that you have to use their
[`claude` CLI tool](https://docs.anthropic.com/en/docs/claude-code/overview).
Since I still want to stay in Zed (even if I can't use the Agent panel) I've
added a task which gets me pretty close to the same workflow I had before. Add
this to your zed `tasks.json`:

```json
{
  "label": "claude",
  "command": "claude --dangerously-skip-permissions",
  "reveal": "always",
  "use_new_terminal": true,
  "allow_concurrent_runs": false
}
```

Anectodally, it also seems like Claude Code is a bit more token-efficient than
using the same models via the Zed Agent panel. To my eyes (watching the agent at
work) it seems like it's more parsimonious in only reading sections of files
into context, and whole files only when absolutely necessary. But I don't have
hard data to back that up.

And the workflow is really almost as good, with only two things that I'm really
missing from my old workflow.

1. You can't trivially switch providers/models like you can when you're using
   the Zed Agent panel. But the Anthropic models are pretty good---at least
   equal to best-in-class for the sort of work I do.

2. Claude code no longer has direct access to the LSP diagnostics---because that
   stuff in general Just Works^TM in Zed, it was nice to not have to set up
   extra MCPs to get access to the language-aware tooling stuff. I used to be
   able to just say "fix the warnings in this project" and it'd do what I meant,
   but now I have to either set up a MCP server, or hope that Claude (possibly
   with a hint in `CLAUDE.md`) knows how to run the CLI tools to get the same
   information.

The thing that puts me at ease with this sort of (big) workflow chnage is that
there's really not too much lock-in; if the pricing landscape changes in the
future I'd happily switch to another provider. The main skill---context
management, and figuring out how to communicate to an LLM what needs to be done
in clear, concise language---is unchanged.

If this helps you get the most out of your setup, then happy Claude-in-Zedding.

## Update (2025-09-18)

I've since wrapped the Claude CLI in a tmux session to make the workflow even
smoother. This means:

- each project gets its own persistent Claude session that keeps running after
  Zed is closed (especially useful for remote Zed sessions where you want the
  agent to keep working)
- you can easily reconnect to an existing Claude conversation when switching
  between projects
- the session names automatically match your project directory names

The wrapper script (`claude-tmux`) and updated Zed task configuration are
[in my dotfiles](https://github.com/benswift/.dotfiles) if you want to steal
them.
