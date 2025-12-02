---
title: "Package managers: <code>update</code> or <code>upgrade</code>?"
tags:
  - dev
---

Quick quiz: for the following language/system
[package managers](https://en.wikipedia.org/wiki/Package_manager), what's the
name of the subcommand to update[^or-upgrade] your project/system to the latest
version of one (or more) of your project's dependencies?

[^or-upgrade]: or, y'know, upgrade

| package manager | language/system |
| --------------- | --------------- |
| `bundle`        | Ruby            |
| `pip`           | Python          |
| `poetry`        | Python          |
| `pipenv`        | Python          |
| `npm`           | javascript      |
| `yarn`          | javascript      |
| `brew`          | macOS           |
| `apt-get`       | Debian          |
| `cargo`         | Rust            |
| `stack`         | Haskell         |
| `lein`          | Clojure         |
| `dep`           | Go              |
| `cpan`          | Perl            |
| `mix`           | Elixir          |

<button onclick='document.getElementById("answer-table").style.visibility="visible";'>click
to reveal the answers</button>

| package manager | language/system | (sub)command name     |
| --------------- | --------------- | --------------------- |
| `bundle`        | Ruby            | `upgrade`             |
| `pip`           | Python          | go away[^pip]         |
| `poetry`        | Python          | `update`              |
| `pipenv`        | Python          | `update`              |
| `npm`           | javascript      | `update` or `upgrade` |
| `yarn`          | javascript      | `upgrade`             |
| `brew`          | macOS           | `upgrade`             |
| `apt-get`       | Debian          | `upgrade`             |
| `cargo`         | Rust            | `update`              |
| `stack`         | Haskell         | `update`              |
| `lein`          | Clojure         | `ancient upgrade`     |
| `dep`           | Go              | `ensure -update`      |
| `cpan`          | Perl            | `upgrade`             |
| `mix`           | Elixir          | `deps.update`         |

[^pip]: https://github.com/pypa/pip/issues/59

For bonus points, which of them _also_ recognise the "other" subcommand but it
does something different? For even more bonus points, when does that "other"
option do something unwanted/destructive/irreversible (assuming that all you
want to do is update that dependency to the latest version)?

::: tip Look, I'm not at all saying that you should just go and blindly
`update`/`upgrade` all of the things---that's clearly a bad idea. But it still
takes me a non-zero amount of time as I switch between languages/tools to sit
and think "ok, for this project do I want to `update` or `upgrade`"? And that
makes me sad. :::

If there's a deep, principled (or even a shallow, pragmatic) reason to pick one
or the other then we should observe it, and do it _consistently_. Even if
there's not, we should toss a coin and be consistent anyway.

If any of the above commands are incorrect, or if there's a better way, then
[let me know](mailto:ben.swift@anu.edu.au).
