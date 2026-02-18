---
title: "Ben's dev setup 2026 edition"
tags: [dev]
---

New year, new dev setup. This year the theme is:

> a life lived in (text) tokens

Agentic software develompent tools (Claude Code, Codex CLI, Opencode, pi, etc)
have become pretty crucial to my workflow, and they work _best_ when consuming
and producing text and calling CLI tools which do the same.

So I've re-jigged my entire development workflow again. Emacs lasted me ~20
years, and
[while I like Zed and enjoyed the setup](/blog/2025/06/06/agentic-elixir-superpowers-zed-tidewave-ashai)
I've moved on from that just two years later. This year, as part of my
commitment to a life lived in tokens, I'm moving back to purely terminal apps
(with my usual strong preferences for OSS + tools which run on both macOS and
Linux).

The core of it is

- [ghostty](https://ghostty.org/) is my terminal emulator
- [zellij](https://zellij.dev/) is the terminal multiplexer, and handles all my multi-pane &
  multi-tab needs (I don't really use ghostty tabs at all)
- [helix](https://helix-editor.com/) is my text editor, using various LSPs to provide a
  pretty-close-to-IDE experience
- [yazi](https://yazi-rs.github.io/) as a file browser
- [neomutt](https://neomutt.org/) for emails, as I've
  [already discussed here](/blog/2025/09/12/the-great-2025-email-yak-shave-o365-mbsync-mu-neomutt-msmtp)
- [nb](https://xwmx.github.io/nb/) for a file-based "personal knowledge base", think Obsidian but
  without the GUI app

I could write up more about it, but honestly if you're curious just look in
[my dotfiles](https://github.com/benswift/.dotfiles), because it's all in there.

The main reason I switched from Zed is that it's fundamentally a GUI app. There
are ways to mount remote projects, but I always found them a bit flaky and I'm
increasingly working across lots of different remote machines via ssh
([fly sprites](https://sprites.dev/) is particularly interesting as a bit of a middle ground
between fully-reproducable Docker stuff and randomly spinning up VMs to mess
around). Terminal stuff just works, Zed takes setup and mental energy.

The other reason I moved was that even though Zed can run agentic coding agents
via the [ACP](https://agentclientprotocol.com/) (in fact I think they invented it) the DX isn't as nice. For
example, there's no `/resume` command so you can't resume an old conversation.
It seems like the companies making these agentic harnesses are trying out new
things in the "native" terminal app first, and when they'll make that part of
the ACP spec is unknown.

The final bonus is that most of the above tools are also configured by text
config files (to be fair, so is Zed). So Claude has been helping me set up this
environment. A really handy tool I found is
[ht-mcp](https://github.com/memextech/ht-mcp) which is a [MCP](https://modelcontextprotocol.io/) server that
can run a headless terminal app (including a TUI like yazi), so that Claude Code
can even e.g. open a file in helix and issue commands to do stuff. That's been
really handy for debugging things when they haven't worked correctly.

Anyway, we'll see if this stack satisfies me long-term---at this rate of change
(20 years, then 2 years) I might be changing it all up again in 2 months.
