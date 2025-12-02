---
title: "Deploying a Phoenix app (with LiveView) on fly.io"
tags:
  - dev
---

# Deploying a Phoenix app (with LiveView) on fly.io




Things to note:

- The hexdocs page on [deploying to fly.io](https://hexdocs.pm/phoenix/fly.html)
  is pretty up-to-date, and in general I followed that (starting with the `mix
  phx.new --live` part).

- The [fly.io walkthrough guide](https://fly.io/docs/getting-started/elixir/) is
  currently (as of writing) out-of-date---it suggests and old version of Phoenix
  (v1.5, whereas the latest is v1.6). The main benefit of v1.6 is the [move to
  esbuild (and removal of
  webpack/npm)](https://fly.io/blog/phoenix-moves-to-esbuild-for-assets/), which
  is quite nice from a developer ergonomics perspective. In addition, some of
  the "you need to change your elixir config" stuff around IPv6 is now no longer needed.

- The default `fly.toml` file which got created for included config for tcp
  health checks---which are obviously a good idea, but the default phoenix app
  created above (by `mix phx.new --live` ) doesn't have an endpoint to respond
  to them afaict (I may be wrong---I don't know enough about how the framework
  works yet). There's some potentially helpful stuff about enabling them in a
  [forum post that I
  found](https://community.fly.io/t/phoenix-http-health-checks/2894/), but as
  yet I haven't set it up---will update this post asap with more info.

