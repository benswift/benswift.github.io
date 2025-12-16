---
title: "Fixing slow Zed agent startup times"
tags:
  - ai
  - dev
  - zed
---

I've been using [Claude Code](https://github.com/anthropics/claude-code) via
[ACP](https://modelcontextprotocol.io/docs/concepts/architecture#agent-control-protocol)
(Agent Control Protocol) in [Zed](https://zed.dev/), and while the integration
is brilliant, starting a new Claude session took noticeably longer in Zed than
running `claude` directly in the terminal; ~30s vs about 5s. And it was
particularly frustrating because there's no `/clear` slash command via ACP---the
only way to clear the context, which I d _all the time_ is to re-start the
agent, which (because of the delay) breaks my flow.

## Digging into the diagnosis

Looking into it,
[issue #13329](https://github.com/anthropics/claude-code/issues/13329) documents
how MCP server initialisation blocks session creation. One user had measured
their setup taking 32+ seconds just waiting for MCP servers to initialise. Seems
like just the issue I was having.

So I checked my local MCP configuration. I have a few servers "globally"
configured for all projects on this machine:

- [`@playwright/mcp`](https://github.com/microsoft/playwright/tree/main/packages/playwright-mcp)
  for browser automation
- [`backlog`](https://github.com/ckreiling/backlog.md) for task management
- [`ht-mcp`](https://github.com/benswift/ht-mcp) for headless terminal access

I ran some timing tests and found the smoking gun: `@playwright/mcp` was being
invoked via `npx @playwright/mcp@latest`, so it checks the npm registry every
time and potentially downloads packages. Meanwhile, the other MCP servers
(backlog and ht-mcp) were fast, because they were already installed globally and
being invoked directly as binaries. Playwright was the outlier, and it was
dragging down every single session startup.

## The fix

I implemented a three-part fix:

### 1. Install Playwright MCP globally

Instead of relying on `npx` to fetch it every time, install it globally:

```bash
npm install -g @playwright/mcp
```

### 2. Add mise shims to PATH for non-interactive contexts

Here's where things got interesting. My [mise](https://mise.jdx.dev/) setup was
working fine in the terminal (where I have `mise activate zsh` in my `.zshrc`),
but IDEs like Zed don't run interactive shells---they use non-interactive
contexts that skip `.zshrc` entirely[^shell-contexts].

[^shell-contexts]:
    This is standard Unix behaviour. Interactive shells source `.zshrc` (or
    `.bashrc` for bash), but non-interactive shells only source `.zshenv` (or
    `.bash_profile`). IDEs, MCP servers, and other tools that spawn processes
    typically use non-interactive contexts.

The solution is mise's recommended hybrid approach: add the mise shims directory
to PATH in `.zshenv` (which is sourced for all contexts), while keeping
`mise activate` in `.zshrc` for interactive shells:

```bash
# .zshenv (sourced for all shell contexts)
export PATH="$HOME/.local/share/mise/shims:$PATH"

# .zshrc (sourced for interactive shells only)
eval "$(mise activate zsh)"
```

This ensures that globally-installed npm packages are available to MCP servers
spawned by Zed, without sacrificing the nice interactive shell features that
`mise activate` provides.

### 3. Update MCP config

Finally, update the MCP configuration to use the binary directly instead of
going through `npx`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "mcp-server-playwright"
    }
  }
}
```

## The outcome

The result? It's still not instant, but it is faster. The pause that was
breaking my flow is (closer to) gone.

The broader lesson here is that `npx` is convenient for one-off commands, but
it's a terrible choice for anything that runs frequently. Global installation
plus direct binary invocation is the way to go for tools you use
regularly[^npx-tradeoffs]. And if you're using mise (or any other tool version
manager like [asdf](https://asdf-vm.com/) or [rtx](https://github.com/jdx/rtx)),
remember that non-interactive contexts need explicit PATH configuration---IDEs
and MCP servers don't get the benefits of your shell's interactive setup
automatically.

[^npx-tradeoffs]:
    The trade-off is that you now need to update these packages manually
    (`npm update -g @playwright/mcp`) rather than getting the latest version
    automatically. For rapidly-evolving tools that's a real consideration, but
    for stable packages the performance gain is worth it.
