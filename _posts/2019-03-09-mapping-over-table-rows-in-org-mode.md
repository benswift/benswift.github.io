---
title: Mapping over table rows in org-mode
date: 2019-03-09 19:53 +1100
tags: emacs
---

I'm an [Emacs](https://www.gnu.org/software/emacs/) guy, and so if I've got some
simple tabular data I'd _much_ rather keep it in an
[org-mode](https://orgmode.org) table than have to fire up Excel.

Here's an example[^auto-format]:

[^auto-format]:

  If the prospect of having to keep all those `|` characters manually aligned
  is freaking you out, don't worry---`orgtbl-mode` does it all for you
  automatically.

```
#+NAME: pap-table
| first name  | last name | yearly-income |
|-------------|-----------|---------------|
| Mr          | Bennett   |          2000 |
| Fitzwilliam | Darcy     |         10000 |
| Charles     | Bingley   |          5000 |
```

Now, I often want to get my functional programming on and apply a function to
all the rows of the table. Org-mode does have some special syntax with bunch of
cool features for doing arithmetic on the cells (just like Excel formulas) but
I'm usually happier just writing regular elisp to get the job done.

The nicest[^nicer] way I've found to do this is to give the table a **name**
(you can see it in the example above---the table name is `pap-table`). Then, you
can tell an elisp [code
block](https://orgmode.org/manual/Structure-of-code-blocks.html) about the data
in that table like so (note the `:var table=pap-table` at the start):

[^nicer]: if there's a nicer way, please [let me know](https://twitter.com/benswift)!

```
#+BEGIN_SRC emacs-lisp :var table=pap-table
  (-map
   (lambda (row)
     (cl-destructuring-bind (first last income) row
       (list
        (format "Mr. %s is a man of %s fortune; %s a year."
                last
                (if (< income 2500) "small" "large")
                income))))
   table)
#+END_SRC
```

Then, when you evaluate the code block with `C-c C-c` (or just `, ,` in
Spacemacs) it'll return the "result":

```
#+RESULTS:
| Mr. Bennett is a man of small fortune; 2000 a year. |
| Mr. Darcy is a man of large fortune; 10000 a year.  |
| Mr. Bingley is a man of large fortune; 5000 a year. |
```

Which is really handy, as you can imagine. I use it for all sorts of things,
including sending "mail merge" emails with template values (since I also use
[Emacs as my mail
client](https://www.djcbsoftware.nl/code/mu/mu4e.html)---sending an email is
just an elisp function call away).

## Caveats

There are a few "tricks" in the above process, which took me a while to figure
out. Hopefully by listing them here I can save you a bunch of heartache, dear
reader.

- The elisp doesn't actually know about the column names from the table---I had
  to re-bind them in the code block using `cl-destructuring-bind` (make sure you
  change the bindings if you change the names/order of the columns in the table).

- Org-mode tables don't really much about types, so while it'll try it's best
  with the basics (e.g. detecting strings vs numbers) sometimes it gets
  confused. It's probably worth putting an explicit e.g. `string-to-number` in
  if you want to be sure.

- In the example above my elisp block returns a value (a list, since I'm using
  `-map` from the excellent [`dash.el`
  library](https://github.com/magnars/dash.el)) and that's why the results get
  nicely formatted in the `#+RESULTS:` block. If your code is side-effectful
  (e.g. `message`) but doesn't return a value then you see the results in that
  place, you'll have to look elsewhere (e.g. the `*Messages*` buffer)

- Further to the previous caveat, you'll notice that I'm actually wrapping the
  result of the inner `lambda` in another `list` call, so the output of the code
  block is actually a list of lists. I could have just returned a list of the
  strings, but then it would be interpreted as an _1×n_ table, rather than the
  (nicer looking on the page) _n×1_ table shown above.
