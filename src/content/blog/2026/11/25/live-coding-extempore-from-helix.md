---
title: "Live coding Extempore from Helix"
description:
  "Extempore now has a built-in language server and nREPL server, so live coding
  in Helix takes just a few lines of config."
tags:
  - extempore
---

I do most of my editing in [Helix](https://helix-editor.com) these days, and
when I wrote about
[getting Extempore running on aarch64](/blog/2026/02/26/extempore-is-alive-on-aarch64-part-deux/)
earlier in the year I had a
[tree-sitter grammar](https://github.com/extemporelang/tree-sitter-extempore)
for `.xtm` files and a hacked-together relay script for sending code over TCP.
Extempore's editor support has always relied on editor plugins (Emacs, VS Code,
vim and friends) talking to its TCP eval server on port 7099, and since Helix
doesn't have a plugin system, evaluating code meant shelling out to a helper
script and reading the results off the Extempore console in another terminal.

The `aarch64` work has now landed on `master`, along with a built-in
[nREPL](https://nrepl.org) server (on `127.0.0.1:7888`, started by default) and
a language server built straight into the binary: `extempore lsp`. Helix speaks
LSP out of the box, so live coding in Helix now needs only a couple of blocks in
your config files.

## Setup

This is on Extempore's `master` branch, so build `extempore` from source (the
[README](https://github.com/digego/extempore#readme) has the two `cmake`
commands) and put it on your `PATH`. Then add the language server and the
[tree-sitter-extempore](https://github.com/extemporelang/tree-sitter-extempore)
grammar to `~/.config/helix/languages.toml`:

```toml
[language-server.extempore]
command = "extempore"
args = ["lsp"]

[[language]]
name = "extempore"
scope = "source.extempore"
file-types = ["xtm"]
comment-token = ";"
block-comment-tokens = { start = "#|", end = "|#" }
indent = { tab-width = 2, unit = "  " }
language-servers = ["extempore"]

[[grammar]]
name = "extempore"
source = { git = "https://github.com/extemporelang/tree-sitter-extempore", rev = "main" }
```

Then fetch and build the grammar, and copy its queries into your Helix runtime
directory:

```bash
hx --grammar fetch && hx --grammar build
mkdir -p ~/.config/helix/runtime/queries/extempore
cp ~/.config/helix/runtime/grammars/sources/extempore/queries/*.scm \
  ~/.config/helix/runtime/queries/extempore/
```

The queries give you syntax highlighting and a textobject for top-level forms:
<kbd>m</kbd> <kbd>a</kbd> <kbd>f</kbd> selects the form under the cursor, and
<kbd>]</kbd> <kbd>f</kbd> and <kbd>[</kbd> <kbd>f</kbd> jump between forms.
`hx --health extempore` should show a tick for the parser and each query.

With `languages.toml` in place, <kbd>Space</kbd> <kbd>a</kbd> already offers
code actions for "Evaluate top-level form", "Evaluate buffer", and (when you
have a visual selection) "Evaluate selection". For single-key bindings, add
these to `~/.config/helix/config.toml`:

```toml
[keys.normal.","]
e = ':lsp-workspace-command extempore.eval {"uri":"file://%{file_path_absolute}","range":{"start":{"line":%sh{echo $((%{cursor_line}-1))},"character":0},"end":{"line":%sh{echo $((%{cursor_line}-1))},"character":0}}}'
b = ':lsp-workspace-command extempore.evalBuffer {"uri":"file://%{file_path_absolute}"}'
i = ':lsp-workspace-command extempore.interrupt'
```

The `%sh{...}` arithmetic is there because Helix counts lines from 1 and LSP
counts them from 0. These bindings take over Helix's <kbd>,</kbd> (keep primary
selection), so pick another prefix if you use it. Note that the `,e` binding
sends the cursor line with character 0 as both start and end, so it always
evaluates the enclosing top-level form; if you want to evaluate a visual
selection inside a form, use <kbd>Space</kbd> <kbd>a</kbd>.

## Playing the fmsynth example

Start Extempore (run `extempore` in a terminal, which opens your default audio
device) and open `examples/core/fmsynth.xtm` from the Extempore checkout in
Helix. Put the cursor anywhere inside the first form and press <kbd>,</kbd>
<kbd>e</kbd>, then do the same for each form in turn. Each result appears in the
status line. Compiling the DSP function gives

```
Compiled:  dsp >>> [float,float,i64,i64,float*]*  => dsp_adhoc_16_...
```

and evaluating the last form starts the `l1` temporal recursion loop playing. To
change the music while it plays, edit `l1` (the pitches, the rhythm, the `cosr`
on the velocity) and press <kbd>,</kbd> <kbd>e</kbd> on it again. There's no
need to save first, because the language server evaluates the buffer as it
stands in the editor. The loop calls `l1` by name on each beat, so the next note
picks up the new definition.

Runtime and compiler errors show up as diagnostics directly on the form that
failed. If I misspell `dsp` in the `dsp:set!` line, Helix shows

```
●  21  (dsp:set! dps)  unbound variable dps in (dps 'xtlang)
```

and the diagnostic stays on that form until I edit it or evaluate it cleanly. An
xtlang type error gets the same treatment, with the compiler's report attached
to the `bind-func` line.

You also get the standard LSP features. Before you even start an Extempore
process, `extempore lsp` checks for unbalanced parentheses on open and save,
provides folding ranges, and populates the symbol picker (<kbd>Space</kbd>
<kbd>s</kbd> jumps between `define` and `bind-func` definitions in the buffer).
Once Extempore is running, it completes both Scheme and xtlang names as you
type, <kbd>Space</kbd> <kbd>k</kbd> on a function shows its arguments, xtlang
type signature and docstring, and <kbd>,</kbd> <kbd>i</kbd> interrupts a runaway
evaluation.

Any other editor with an LSP client can use `extempore lsp` the same way: point
it at `.xtm` files and bind the `extempore.eval`, `extempore.evalBuffer` and
`extempore.interrupt` workspace commands (Helix is the only one I've tested so
far). And for scripts, non-LSP editors, or coding agents like Claude Code, the
binary now includes an nREPL client too: `extempore send '(+ 1 2)'` evaluates an
expression from the shell, `extempore send --file song.xtm --line 12 --column 3`
evaluates the top-level form at a cursor position, and `extempore repl` opens an
interactive terminal REPL.
