---
title: "Switching from Ghostty and Zellij to Rex"
description:
  "Replacing both Ghostty and Zellij with Rex: why minimal additions to the
  terminal keep beating layers built on top of it."
tags: [dev, tools]
---

At the end of my
[February dev setup post](/blog/2026/02/18/ben-s-dev-setup-2026-edition/), I
joked that after 20 years in Emacs and two in Zed, I might end up changing the
whole stack again in two months. Well, it took nine months :)

The stuff inside the terminal I'm still happy with:
[Helix](https://helix-editor.com/), [yazi](https://yazi-rs.github.io/) and
[neomutt](https://neomutt.org/). But I've switched to
[Rex](https://www.superlogical.com/rex) to replace both
[Ghostty](https://ghostty.org/) and [Zellij](https://zellij.dev/).

Rex is the new terminal and session platform from
[Superlogical](https://www.superlogical.com/) ([Mitchell
Hashimoto's](https://mitchellh.com/) new venture, built on top of Ghostty). It
folds the terminal emulator, the multiplexer and the remote session server into
one thing. My workflow is much the same as before; it's just nicer to live in.

People betting on things "beyond the terminal"---whether that's GUI agent
wrappers, or even TUI multiplexers like Zellij layered inside a terminal---keep
getting eaten by people adding minimal stuff to the terminal itself. When the
terminal and the remote multiplexer are two separate programs talking over an
SSH pipe of VT100 escape sequences, every modern terminal protocol has to pass
through an extra translation layer. Sometimes it doesn't make it: Zellij's
host-query forwarding used to leak escape replies into TUI panes on reattach,
and pass-through protocols over SSH inside Zellij were always troublesome, the
kitty graphics protocol especially. In Rex, kitty graphics work across remote
sessions without any extra plumbing, so my Claude Code sessions draw inline
images directly in the transcript whenever the agent reads an image file. And
because Mitchell and that crew have the runs on the board with Ghostty, I trust
them to do it well.

Rex gives me nothing I didn't have before, but it's much faster and scrolls more
smoothly. It even connects everything together using
[Tailscale](https://tailscale.com/), which I was using anyway. My Linux
workhorse runs `rex server run --tailscale` as a user systemd service and
registers its own Tailscale node on my tailnet; `Rex.app` on my MacBook (and Rex
for iOS on my phone) connects straight to it. A one-line `SessionStart` hook
(`rex __internal session-start`) tells Claude Code and Codex which Rex session
and pane they're running in, so I was able to delete
[`zj-switch`](/blog/2026/07/10/knowing-which-claude-is-stuck/), my KDL layouts,
and all the Zellij pane-renaming glue from my (previous) notification scripts
and process HUD.

The whole switch (powered by Claude) took just a few hours in early November,
and as usual the config
([`rex/init.lua`](https://github.com/benswift/.dotfiles/blob/main/rex/init.lua)
and
[`rex.service`](https://github.com/benswift/.dotfiles/blob/main/systemd/user/rex.service))
is in [my dotfiles](https://github.com/benswift/.dotfiles). It's so exhilarating
to be able to mould one's stack to fit one's hand so easily these days.
