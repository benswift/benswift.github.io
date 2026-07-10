---
title: "Knowing which Claude is stuck"
description:
  "A zellij session switcher that shows how many Claude Code agents are running
  in each session, and which of them has stopped and is waiting on me."
published: false
tags: ["tools", "ai", "dev"]
---

I keep one [zellij](https://zellij.dev/) session per project, and most of them
have a Claude Code agent running inside. Four or five at once is normal. The
agents work for minutes at a stretch, so I spend the day asking which one has
stopped and is waiting on me.

Zellij's built-in session manager, which I had bound to `Alt s`, lists the
sessions without saying anything about what is inside them. Answering the
question meant attaching to each session in turn and looking. What I wanted was
a picker over the live sessions only, ordered most-recently-used first. That
ordering makes `Alt s` then Enter a return to the previous session, the way
cmd-tab does. I also wanted fuzzy matching over the names, and an indicator on
each row showing how many agents were running and what they were doing.

The obvious way to get that last part is also the wrong one. Claude Code
continuously sets the terminal title via an OSC escape, which zellij surfaces as
the pane title. You can read another session's pane titles from outside it:

```console
$ zellij --session panic_tda action list-panes -c -j | jq -r '.[].title'
✳ Run balanced_panel_5x5 experiment and verify T2I batching
```

That `✳` is one frame of a spinner that changes about ten times a second. The
whole string belongs to Claude Code's UI, which can be redesigned any Tuesday,
and parsing that is a mug's game (and slow). Instead, we can get the state from
somewhere better. Claude Code fires
[hooks](https://docs.claude.com/en/docs/claude-code/hooks) at exactly the points
in its lifecycle where the state changes. I already had a script on `Stop`,
sending me a push notification whenever a long turn finished. Widening it was
easy: `SessionStart` writes `idle`, `UserPromptSubmit` writes `working`, `Stop`
writes `idle` again, `Notification` writes `blocked`, and `SessionEnd` removes
the file. Each agent gets one small file, under
`$XDG_RUNTIME_DIR/claude-agent-state/<zellij-session>/<pid>`.[^xdg] The agent
reports what it is doing, so nothing has to infer it.

Counting the agents is a separate problem, but every zellij session runs a
server whose command line ends in the session name. Each `claude` process chains
up through its pane's shell to exactly one of them:

```console
$ ps -eo pid=,ppid=,args= | grep -E '[z]ellij --server'
 751042  1  .../zellij --server /run/user/1001/zellij/contract_version_1/panic_tda
2863588  1  .../zellij --server /run/user/1001/zellij/contract_version_1/comp4020
```

A single `ps`, plus a walk up the parent chain, gives an authoritative count of
who is alive. The state files supply the status. Keeping the two apart matters,
because an agent killed outright never fires `SessionEnd`, leaving its file
behind. The switcher therefore drops any file whose pid is gone. The whole thing
runs in about 50ms, making no IPC call to any other session.

Here is what `Alt s` puts on screen:

```
switch to >   < 4/4 ─────────────────────────────────────────────────────────
  ⏳ working   ⚠ blocked   ✓ idle   · unknown
▌ comp4020                 2 ⚠1 ⏳1
▌ dotfiles                 1 ⏳1
▌ panic_tda                2 ⏳1 ✓1
▌ slop-salon               1 ✓1
```

`comp4020` has two agents, one of them waiting on me, so that is where I go
next. The first row is always the session I was in before this one. `Alt s` and
Enter is therefore a two-keystroke toggle between the last two projects. The
built-in session manager, which I still want for creating sessions and
resurrecting dead ones, keeps its default binding on `Ctrl o` then `w`.

A zellij pane rename is sticky: it overrides every subsequent OSC title until
you undo it. My first instinct was to stamp the state into the pane name
permanently. That throws away Claude Code's own title, which while an agent is
working tells me more than any glyph I could substitute. The rename now happens
only on `Notification`, setting the pane name to `⚠` and whatever Claude says it
wants. The next `UserPromptSubmit` calls `undo-rename-pane`. Zellij tracks the
program's title underneath the manual name throughout, so the undo restores the
current one rather than the stale one.

The bug worth confessing is that I first keyed those state files by Claude's
session id rather than the pid. The id changes when a session is resumed or
compacted; the process does not. A single agent therefore accumulated two files,
and the switcher rendered `dotfiles 1 ⏳2`, which is one agent reporting two
states at once. One agent is one process, so the file is named for the pid now.
I only noticed because I took the screenshot above for this post.

Everything is in my dotfiles if you want to reconstruct it:
[`bin/zj-switch`](https://github.com/benswift/.dotfiles/blob/main/bin/zj-switch)
is the switcher,
[`bin/claude-turn-tracker`](https://github.com/benswift/.dotfiles/blob/main/bin/claude-turn-tracker)
writes the state, the `Alt s` binding is in
[`zellij/config.kdl`](https://github.com/benswift/.dotfiles/blob/main/zellij/config.kdl)
and the hooks are in
[`claude/settings.json`](https://github.com/benswift/.dotfiles/blob/main/claude/settings.json).
You need [fzf](https://github.com/junegunn/fzf) and zellij 0.44 or newer, for
`switch-session` and for `rename-pane --pane-id`.

[^xdg]:
    If you go poking at this, note that zellij also uses `XDG_RUNTIME_DIR` to
    find its sockets. I spent a while convinced `rename-pane` was broken. In
    fact I had overridden that variable to sandbox the state files, blinding the
    zellij CLI in the process.
