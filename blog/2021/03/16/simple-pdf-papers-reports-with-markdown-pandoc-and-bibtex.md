---
title: "Simple pdf papers/reports with markdown, pandoc and bibtex"
tags:
  - research
  - dev
---

I've long raged against the machine of my institution's default LaTeX template
for dissertations and other reports, which is:

- complicated (more than 20 separate files!)
- buggy; (by default it uses multiple conflicting packages, so that even a
  "clean" build produces a bunch of warnings)
- for new-to-CS-and-math students the LaTeX learning curve can be a bit of a
  bummer (even if it is probably a worthwhile skill in the long haul)

When I wrote my PhD thesis back in the day I created my [own LaTeX
template](https://github.com/benswift/academic-thesis-template). Since then,
I've been doing more and more of my writing in
[markdown](https://www.markdownguide.org) rather than LaTeX, and I really enjoy
the simplicity. You lose a little bit of control, but being limited to the
features that markdown offers is actually really helpful if you're as prone to
yak shaving as I am.

## A simple Pandoc-powered markdown ⇒ pdf document template

Because academic publishing is still primarily a world of bland simulacra, being
able to create a `.pdf` of one's writing is essential. When writing in markdown
in my [favourite text editor](https://www.spacemacs.org) I can turn it into a
pdf using Pandoc. As [Jeffrey Moro so eloquently puts
it](https://jeffreymoro.com/blog/2020-09-21-how-i-write/):

> pandoc is amazing. I basically think it redeems computers. It can take
> basically any kind of text and turn it into other kinds of text. In my
> situation, it turns markdown files into…pretty much anything.

Still, getting from "writing my notes in a markdown file" to "having a
nice-looking pdf for submission/printing" still has a few magical steps, so I've
created a template project on GitHub which puts these pieces together in a
sensible way. There are two "flavours":

- the [regular
  version](https://github.com/benswift/simple-pandoc-pdf-template/tree/master)
  (when you don't need academic citations)

- the [bibtex
  version](https://github.com/benswift/simple-pandoc-pdf-template/tree/bibtex)
  (when you do need academic citations)

I'm pumped to be able to share this template with the world under a permissive
MIT licence. The project `README.md` has all the details, but the main goodies
this project provides are:

- a `Makefile` so that you don't have to remember the arcane Pandoc CLI options
  for creating nice pdfs (via LaTeX)

- a `pando-template.tex` which has some (I think) sane defaults for the way the
  output pdf will look, but more importantly is easily there so that you can
  hack it the way you like it (which is sometimes challenging when working with
  Pandoc)

- (on the `bibtex` branch) a working example of how to include citations (from a
  BibTeX `.bib` file, which you can create & manage however you like)

You'll still need LaTeX installed on your machine (because that's what it uses
under the hood) but one other nice thing is that Pandoc handles all the
`pdflatex`, `pdflatex`, `bibtex`, `pdflatex` shenanigans for you (without
needing external scripts like `LaTeXMk`). If there are errors in your markup,
then the error messages can still be a bit inscrutable, but no worse than
regular LaTeX ones (maybe even a bit nicer because Pandoc tries to trim the
irrelevant guff and just provide the actual error message).

## Inline LaTeX for greater control

One thing which is surprisingly useful is the way that Pandoc passes latex
fragments "straight through". As per the `README.md`:

> This template allows you to write most of your content in markdown, but then
> "drop down" into LaTeX when you need more control over the output (since
> pandoc passes raw LaTeX code straight through). This is basically the same
> workflow for which markdown was invented, except in that case for HTML.
>
> If the output you want is going to require lots of very specific control over
> the layout then you're probably better off just writing in LaTeX directly, but
> if you want to mostly focus on the content but occasionally have more control
> over the way it's displayed, sprinkling your markdown files with LaTeX can be
> a useful option.

I find myself using this a fair bit, and it's still nicer than having to work in
LaTeX directly. One recent example: I needed some coloured boxes around my text,
and so by including `\usepackage{tcolorbox}` in the `pandoc-template.tex` I was
able to use the `\begin{tcolorbox} ... \end{tcolorbox}` environment in my `.md`
file, and got the nice coloured boxes in the pdf output.

So, go forth, write, and produce nice pdfs!
