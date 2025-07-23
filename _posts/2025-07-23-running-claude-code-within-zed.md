---
title: Running Claude Code within Zed
tags: ai zed
---

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
using the same models via the Zed Agent panel. And the workflow is really almost
as good. The only real downside is that you can't trivially switch
providers/models like you can when you're using the Zed Agent panel. But the
Anthropic models are pretty good, and there's really not too much lock-in; if
the pricing landscape changes in the future I'd happily switch to another
provider.
