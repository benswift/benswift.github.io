---
title: 'Package managers: <code>update</code> or <code>upgrade</code>?'
tags: tools ux
---

Quick quiz: for the following language/system [package
managers](https://en.wikipedia.org/wiki/Package_manager), what's the name of the
subcommand to so that your project/system uses the latest version of one (or
more) of your project's dependencies?

| package manager | language/system |
|-----------------|-----------------|
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

<button onclick='document.getElementById("answer-table").style.visibility="visible";'>click to reveal the answers</button>

{:id="answer-table" style="visibility: hidden;"}

| package manager | language/system | (sub)command name     |
|-----------------|-----------------|-----------------------|
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

[^pip]: <https://github.com/pypa/pip/issues/59>

For bonus points, which of them _also_ recognise the "other" subcommand but it
does something different? For even more bonus points, when does that "other"
option do something unwanted/destructive/irreversible (assuming that all you
want to do is update that dependency to the latest version)?

{:.hl-para}

Look, I'm not at all saying that you should just go and blindly
`update`/`upgrade` all of the things---that's clearly a bad idea. But it still
takes me a non-zero amount of time as I switch between languages/tools to sit
and think "ok, for this project do I want to `update` or `upgrade`"? And that
makes me sad.

Also, if any of the above commands are incorrect, or if there's a better way,
then [ping me on twitter](https://twitter.com/benswift).
