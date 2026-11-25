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
[Superlogical](https://www.superlogical.com/)
([Mitchell Hashimoto's](https://mitchellh.com/) new venture, built on top of
Ghostty). It folds the terminal emulator, the multiplexer and the remote session
server into one thing. My workflow is much the same as before; it's just nicer
to live in.

People betting on things "beyond the terminal"---whether that's GUI agent
wrappers, or even TUI multiplexers like Zellij layered inside a terminal---keep
getting eaten by people adding minimal stuff to the terminal itself. When the
terminal and the remote multiplexer are two separate programs talking over an
SSH pipe of VT100 escape sequences, every modern terminal protocol has to pass
through an extra translation layer. Sometimes it doesn't make it: Zellij's
host-query forwarding used to leak escape replies into TUI panes on reattach,
and pass-through protocols over SSH inside Zellij were always troublesome, the
kitty graphics protocol especially. In Rex, kitty graphics work across remote
sessions without any extra plumbing. And because Mitchell and that crew have the
runs on the board with Ghostty, I trust them to do it well.

My new `image-preview` plugin for Claude Code relies on this. Whenever the agent
reads an image file, the plugin draws the image under that row in the
transcript. Claude Code runs on my Linux box and the image shows up in `Rex.app`
on my MacBook. Claude Code can already draw kitty graphics in terminals it
recognises, and its plugins can wrap how each transcript row renders, so the
core of the plugin is one render hook:

```tsx
export const register: Register = (on) => {
  on("ui.render", { component: "ToolUse" }, async ($, e, next) => {
    const row = await next(e);
    const { tool, input, output, tool_use_id: id } = e.props;
    if (e.surface !== "terminal" || tool !== "Read" || !isImageResult(output)) {
      return row;
    }
    const png = await pngOf($, id, output, filePathOf(input));
    if (png === undefined) return row;
    const { Box, Image } = $.ui.resolve(e);
    return (
      <Box flexDirection="column">
        {row}
        <Box paddingLeft={5}>
          <Image source={{ png }} columns={72} rows={24} alt="(image)" />
        </Box>
      </Box>
    );
  });
};
```

`pngOf` passes a small PNG straight through. Anything else (a JPEG, a WebP, a
PNG over 1 MiB) goes through whichever converter the host has (`sips` on macOS,
ImageMagick on Linux), shrunk to 1024 pixels on its longest side, in a scratch
directory that's deleted straight afterwards. The plugin hands Claude Code the
PNG's bytes, since the terminal drawing them may be on another machine and can't
open a file on this one. The full version (about 150 lines of TypeScript) also
sizes the box to the image's aspect ratio, and draws images under a run of reads
that Claude Code folds into one "Read 2 files" row. Rex isn't on Claude Code's
list of supported terminals, so I also set
`CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1`.

Other people have been working on the same problem. Josh Meyer's
[ghostty-image-mcp](https://github.com/JRMeyer/ghostty-image-mcp) writes kitty
escape sequences straight to `/dev/tty` when you ask Claude to show you a file,
[pi-image-preview](https://github.com/RielJ/pi-image-preview) does thumbnails
for the pi agent (inside tmux, but not over SSH), and
[Qwen Code draws tool images natively](https://qwenlm.github.io/qwen-code-docs/en/users/features/terminal-images/)
but falls back to `chafa`'s coloured text blocks under SSH or tmux. Back in
March Robert Kirby [argued](https://rob137.github.io/2026/03/11/image-problem)
that agent work would drift back to GUIs because terminals can't show the
screenshots and diagrams that agents produce.

Apart from the images, Rex gives me nothing I didn't have before, but it's much
faster and scrolls more smoothly. It even connects everything together using
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
