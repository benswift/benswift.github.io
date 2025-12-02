---
title: "Agentic Elixir superpowers: Zed + Tidewave + AshAI"
tags:
  - dev
---

For a few years now whenever I need to build any sort of networked interactive
experience, I reach for Elixir (with Phoenix LiveView and Ash). It's an
_extremely_ productive combination, especially when you want to do more complex
client/server information flows than the standard request/response UX. I've also
(for the last year or two) ditched Emacs for [Zed](https://zed.dev). Again, if
you take the time to master these tools I think they're excellent.

Like every indie hacker and their wombat I'm experimenting with LLM Agents as
part of my software development workflow. The new frontier (which I'm excited
about, but ask me in a few months how it's gone) is putting all of the above
together. If you'd like to do that too, and want to see a real-world example of
how these things can be plugged into one another, here's my setup.

- Zed as the text editor/MCP host
- both [Tidewave](https://hexdocs.pm/tidewave/zed.html) and
  [AshAI](https://hexdocs.pm/ash_ai/readme.html) as MCP servers

Then, my Zed settings file has this MCP server configuration:

```json
"context_servers": {
  "ash_ai": {
    "command": {
      "path": "mcp-proxy",
      "args": ["http://localhost:4000/ash_ai/mcp"],
      "env": {}
    },
    "settings": {}
  },
  "tidewave": {
    "command": {
      "path": "mcp-proxy",
      "args": ["http://localhost:4000/tidewave/mcp"],
      "env": {}
    },
    "settings": {}
  }
},
```

Even after following the instructions for those tools, you'll need a way to set
up all the proxies and pipe everything together. I wrote
[this script](https://github.com/benswift/.dotfiles/blob/master/bin/tidewave-proxy.sh),
which you're free to use (MIT Licence) if it helps.

Put it on your `~PATH` and then (in your Phoenix project root) run it like so:

```
[16:03] daysy:panic $ tidewave-proxy.sh
🚀 MCP Proxy Development Environment
====================================
Configuration:
  Host: localhost
  Port: 4000
  Ash AI MCP: http://localhost:4000/ash_ai/mcp
  Tidewave MCP: http://localhost:4000/tidewave/mcp

🔗 Starting mcp-proxy instances...
Starting mcp-proxy for ash_ai...
✅ mcp-proxy for ash_ai started (PID: 88815)
   Log file: /tmp/mcp_ash_ai.log
Starting mcp-proxy for tidewave...
✅ mcp-proxy for tidewave started (PID: 88816)
   Log file: /tmp/mcp_tidewave.log

🎉 MCP Proxy environment is ready!
=====================================

Available MCP Servers:
  📊 Ash AI MCP:    http://localhost:4000/ash_ai/mcp
  🌊 Tidewave MCP:  http://localhost:4000/tidewave/mcp

MCP Proxy Commands:
  For Ash AI:    mcp-proxy http://localhost:4000/ash_ai/mcp
  For Tidewave:  mcp-proxy http://localhost:4000/tidewave/mcp

Next Steps:
1. Configure your MCP client (Zed, Claude Desktop, etc.)
2. Use the endpoints above with your MCP client
3. Test with: curl -H 'Accept: application/json' <endpoint>

Log Files:
  Ash AI Proxy: /tmp/mcp_ash_ai.log
  Tidewave Proxy: /tmp/mcp_tidewave.log

Press Ctrl+C to stop all services and clean up

🔥 Starting Phoenix development server with REPL...
==================================================
Erlang/OTP 27 [erts-15.2.5] [source] [64-bit] [smp:16:16] [ds:16:16:10] [async-threads:1] [jit]

[info] Migrations already up
[info] Running PanicWeb.Endpoint with Bandit 1.7.0 at 127.0.0.1:4000 (http)
[info] Access PanicWeb.Endpoint at http://localhost:4000
Interactive Elixir (1.18.4) - press Ctrl+C to exit (type h() ENTER for help)
[watch] build finished, watching for changes...

Rebuilding...

Done in 196ms.
```

Then, to test, in the Agent panel try something like:

```
Use the tidewave project eval tool to add 10+15 in Elixir.
```

If everything's hooked up right, you'll get the answer.

One other tip: make sure you're using OTP27 rather than the (newest)
OTP28---there's an error on one of the AshAI deps which stops it compiling on
the latest OTP. I suspect it'll be fixed soon, though.
