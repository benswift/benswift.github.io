---
title: "Out of the browser: on the power of interfaces for agentic AI"
tags:
  - ai
---

When OpenAI [launched ChatGPT](https://openai.com/index/chatgpt/) on November
30, 2022, it was a text box in a browser. That conversational call-and-response
interface was a big part of what made it a hit---the fastest-growing technology
product in history, reaching 100 million users in two months. But that's not
what this post is about.

This post is about why "AI coding in the terminal" is such a big deal, and why
it's arguably more about **interfaces** than about models.

## The browser as a security marvel

<svg class="browser-window" width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Window frame -->
  <rect x="0" y="0" width="500" height="300" rx="8" class="window-bg"/>
  <rect x="0" y="0" width="500" height="36" rx="8" class="titlebar"/>
  <rect x="0" y="28" width="500" height="8" class="titlebar"/>

  <!-- Traffic lights -->
  <circle cx="20" cy="18" r="6" fill="#ff5f57"/>
  <circle cx="40" cy="18" r="6" fill="#ffbd2e"/>
  <circle cx="60" cy="18" r="6" fill="#28c940"/>

  <!-- URL bar -->
  <rect x="80" y="8" width="340" height="20" rx="4" class="url-bar"/>
  <text x="100" y="22" font-size="11" font-family="system-ui, sans-serif" class="url-text">🔒 chat.openai.com</text>

  <!-- Content area - ChatGPT style interface -->
  <rect x="20" y="50" width="460" height="180" rx="4" class="content-area"/>

  <!-- Chat messages -->
  <rect x="40" y="70" width="280" height="40" rx="8" class="ai-message"/>
  <text x="55" y="95" font-size="12" font-family="system-ui, sans-serif" class="message-text">Hello! How can I help you today?</text>

  <rect x="180" y="125" width="280" height="30" rx="8" class="user-message"/>
  <text x="195" y="145" font-size="12" font-family="system-ui, sans-serif" class="user-text">Can you edit my files?</text>

  <rect x="40" y="170" width="200" height="30" rx="8" class="ai-message"/>
  <text x="55" y="190" font-size="12" font-family="system-ui, sans-serif" class="message-text">I cannot access your files.</text>

  <!-- Input box at bottom -->
  <rect x="20" y="250" width="420" height="35" rx="8" class="input-box"/>
  <text x="35" y="272" font-size="12" font-family="system-ui, sans-serif" class="placeholder-text">Message ChatGPT...</text>
  <rect x="450" y="255" width="25" height="25" rx="4" class="send-btn"/>
</svg>

Modern web browsers are incredible feats of sandboxing engineering. When you
visit a website, that site's code runs in a carefully isolated environment. It
can't read your files. It can't run programs on your computer. It can't even
reliably[^cors] visit other websites on your behalf. This isolation is achieved
through a
[multi-process architecture](https://www.browserstack.com/guide/what-is-browser-sandboxing)
where untrusted web content runs in restricted processes that can only
communicate with the rest of your system through tightly controlled channels.

[^cors]:
    [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is a whole
    thing, but broadly speaking browsers are designed to prevent cross-origin
    resource shenanigans.

This sandboxing is why you can visit sketchy websites and (mostly) not worry
about them stealing your passwords or deleting your files. What happens in the
browser stays in the browser.

But here's the thing: that same sandboxing that protects you also constrains
what ChatGPT (or any browser-based AI) can actually _do_. It can generate text.
It can show you images. It can even run some code (JavaScript) in that sandboxed
environment. But it can't create files on your computer, run your test suite,
commit code to git, or do any of the thousand other things you do when you're
actually building software.

## Enter the terminal

<svg class="terminal-window" width="100%" viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg">
  <!-- Window frame -->
  <rect x="0" y="0" width="500" height="280" rx="8" class="terminal-bg"/>
  <rect x="0" y="0" width="500" height="36" rx="8" class="terminal-titlebar"/>
  <rect x="0" y="28" width="500" height="8" class="terminal-titlebar"/>

  <!-- Traffic lights -->
  <circle cx="20" cy="18" r="6" fill="#ff5f57"/>
  <circle cx="40" cy="18" r="6" fill="#ffbd2e"/>
  <circle cx="60" cy="18" r="6" fill="#28c940"/>

  <!-- Title -->
  <text x="250" y="22" text-anchor="middle" font-size="12" font-family="system-ui, sans-serif" class="terminal-title">Terminal — zsh</text>

  <!-- Terminal content -->
  <text x="20" y="65" font-size="13" font-family="ui-monospace, monospace" class="prompt">~</text>
  <text x="35" y="65" font-size="13" font-family="ui-monospace, monospace" class="command">claude "fix the bug in auth.py"</text>

  <text x="20" y="90" font-size="13" font-family="ui-monospace, monospace" class="output">● Reading auth.py...</text>
  <text x="20" y="115" font-size="13" font-family="ui-monospace, monospace" class="output">● Found issue on line 42</text>
  <text x="20" y="140" font-size="13" font-family="ui-monospace, monospace" class="output">● Editing auth.py...</text>
  <text x="20" y="165" font-size="13" font-family="ui-monospace, monospace" class="output">● Running pytest...</text>
  <text x="20" y="190" font-size="13" font-family="ui-monospace, monospace" class="success">✓ All tests passing</text>
  <text x="20" y="215" font-size="13" font-family="ui-monospace, monospace" class="output">● Committing changes...</text>

  <text x="20" y="250" font-size="13" font-family="ui-monospace, monospace" class="prompt">~</text>
  <rect x="35" y="238" width="8" height="16" class="cursor"/>
</svg>

The terminal is almost the anti-browser. It's a text-only interface to doing
**everything** on your computer. Creating, reading, editing, and deleting files
(or entire hard drives). Running programs, installing software, accessing the
network (and potentially exfiltrating sensitive documents). The terminal is
powerful---and dangerous---precisely _because_ it has no sandbox.[^sandbox]

[^sandbox]:
    Yes, you can run things in
    [dev containers](https://code.visualstudio.com/docs/devcontainers/containers)
    or VMs to limit the blast radius. But in practice, most developers (myself
    included) run these tools directly on their machines. See the normalisation
    of deviance discussion below.

This is why software developers use it. Building software involves a constant
cycle of editing files, running compilers, executing tests, managing version
control, and deploying to servers. All of these are terminal operations. And
crucially, the people using the terminal are expected to know what they're doing
and to take responsibility for the commands they run.

What makes the terminal particularly interesting for LLMs is this:
**it's all text**. Both the inputs (commands with a specific syntax) and the
outputs (error messages, logs, success confirmations) are designed to be read by
humans---specifically, programmers who need to understand what's happening and
debug when things go wrong.

LLMs are really good at text. They can understand error messages, reason about
what went wrong, and generate the next command to try. And because the terminal
runs commands quickly, you can put an LLM in a loop: try something, see the
result, adjust, repeat. This is what
[Anthropic's whitepaper on building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
calls tightening the feedback loop---letting the model iterate without waiting
for a human to approve every step.

## The terminal-native AI boom

When Anthropic
[announced Claude Code](https://www.anthropic.com/news/claude-3-7-sonnet) in
February 2025, the model update wasn't a quantum leap---Claude 3.7 Sonnet came
with it, but Sonnet 3.5 was already pretty capable. What they released was a new
**interface**: an agentic command-line tool that could search and read code,
edit files, write and run tests, and commit to git. Same models[^models-better],
different interface, dramatically more useful for actual software development.
If you don't believe me about how big a deal this is, check the socials.

[^models-better]:
    Ok, the models _are_ getting better all the time. But I think the leap out
    of the browser is the main thing.

And everyone else noticed. OpenAI
[launched Codex CLI](https://openai.com/index/introducing-codex/) in April 2025.
Google followed with
[Gemini CLI](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/).
The open source community jumped in too:
[OpenCode](https://github.com/opencode-ai/opencode) now has over 95,000 GitHub
stars, [Pi](https://lucumr.pocoo.org/2026/1/31/pi/) (built by Armin Ronacher and
Mario Zechner, powering OpenClaw) takes a minimal-agent approach, and
[Claudia](https://github.com/getAsterisk/claudia) wraps Claude Code in a GUI for
those who want the power without the terminal aesthetic.

This is an innovation in **interfaces**, not just models.

## The obvious risk

Of course, all this power comes with risk. An LLM running in your terminal can
do anything you can do in your terminal. Including steal your SSH keys, read
your `.env` files, or---as
[Johann Rehberger points out](https://embracethered.com/blog/posts/2025/the-normalization-of-deviance-in-ai/)---wipe
your production database.

So far, the frontier models have been pretty well-behaved[^yolo]. But Rehberger
draws a sobering parallel to the Space Shuttle Challenger disaster and the
concept of "normalisation of deviance"---when repeated exposure to risky
behaviour without negative consequences leads people to accept that risk as
normal.

[^yolo]:
    Even though many developers run these tools with automatic approval for all
    actions (colloquially known as "YOLO mode"). I'm one of them 🙃

As
[Simon Willison notes](https://simonwillison.net/2025/Dec/10/normalization-of-deviance/):

> In the absence of any headline-grabbing examples of prompt injection
> vulnerabilities causing real economic harm, will anyone care?

The incentives for speed and automation are strong. The incentives for security
are... well, they're there in principle, but it's easy to forget why the
guardrails existed in the first place.

## It's not the models, it's the interface

I've [written before](/blog/2025/07/17/agentic-ai-llms-with-stones) about how
agentic AI is really just about giving LLMs tools---stones to throw, in the
"sticks and stones" sense. But the terminal-native AI wave has clarified
something for me: the _power_ of agentic AI comes from the interface, not just
the tools themselves.

The browser sandbox was always a security feature, not a limitation of the
underlying AI. ChatGPT could always _tell_ you to run `rm -rf /`---it just
couldn't do it itself. By moving to the terminal, we haven't made the models
smarter; we've given them permission to actually do things.

That's both the promise and the peril. The models can now iterate without asking
and do real work in tight feedback loops. But they can also make real mistakes
with real consequences, in ways that browser-based AI never could.

If you're going to use these tools---and if you're a software developer in 2026,
you probably should---just remember that you're not using a smarter AI. You're
using the same AI with the safety guards removed. Plan accordingly.

<!-- styles for the SVG diagrams (light/dark mode) -->
<style scoped>
.browser-window {
  .window-bg { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
  .titlebar { fill: #f3f4f6; }
  .url-bar { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
  .url-text { fill: #374151; }
  .content-area { fill: #f9fafb; }
  .ai-message { fill: #e5e7eb; }
  .user-message { fill: #10a37f; }
  .message-text { fill: #1f2937; }
  .user-text { fill: #ffffff; }
  .input-box { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
  .placeholder-text { fill: #9ca3af; }
  .send-btn { fill: #10a37f; }
}

.terminal-window {
  .terminal-bg { fill: #1e1e1e; }
  .terminal-titlebar { fill: #323232; }
  .terminal-title { fill: #a0a0a0; }
  .prompt { fill: #4ec9b0; }
  .command { fill: #dcdcaa; }
  .output { fill: #cccccc; }
  .success { fill: #4ec9b0; }
  .cursor { fill: #cccccc; animation: blink 1s step-end infinite; }
}

.dark {
  .browser-window {
    .window-bg { fill: #1f2937; stroke: #374151; }
    .titlebar { fill: #374151; }
    .url-bar { fill: #1f2937; stroke: #4b5563; }
    .url-text { fill: #d1d5db; }
    .content-area { fill: #111827; }
    .ai-message { fill: #374151; }
    .message-text { fill: #f3f4f6; }
    .input-box { fill: #1f2937; stroke: #4b5563; }
    .placeholder-text { fill: #6b7280; }
  }

  .terminal-window {
    .terminal-bg { fill: #0d1117; }
    .terminal-titlebar { fill: #161b22; }
    .terminal-title { fill: #8b949e; }
    .prompt { fill: #7ee787; }
    .command { fill: #ffa657; }
    .output { fill: #c9d1d9; }
    .success { fill: #7ee787; }
    .cursor { fill: #c9d1d9; }
  }
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
