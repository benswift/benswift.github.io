---
title: "How to cite code? Leading by example"
tags:
  - teaching
---

In our
[Computing Education Reading Group](https://cs.anu.edu.au/hub/reading-group/)
yesterday we looked at Sheard et. al.'s paper on
[_Strategies for Maintaining Academic Integrity in First-Year_](https://doi.org/10.1145/3059009.3059064)
from ITiCSE '17. It was a great discussion, with lots of new questions raised as
directions for future work.

One of the topics raised in the paper and discussed in the group is the notion
of "citing" code. When writing human-adjacent languages (like English), we all
have a pretty good notion of what constitutes "acceptable referencing"
practices, and we can get down to the important business of arguing about APA vs
Chicago citation styles.

When it comes to citing code (which is often---but not always---acceptable in CS
assignments) there are fewer conventions, and we don't always explicitly teach
our students how to do it.

## The _Statement of Originality_ approach

::: info

The following examples are live on the
[COMP1720 site](https://cs.anu.edu.au/courses/comp1720/resources/faq/#statement-of-originality);
a course which is now delivered by the excellent
[Charles Martin](https://cs.anu.edu.au/code-creativity-culture/people/charles-martin/).
However, all of the statement of originality stuff I mention here is still
unchanged from when I wrote it a few years ago.

:::

One thing I started doing a few years ago (in 2017 maybe?) in my courses is to
get students to fill out a "Statement of Originality" alongside every assessment
item. This isn't a new idea, in fact it was explicitly mentioned in the _Sheard_
paper:

> Alternatively, when submitting an assignment students make a declaration that
> the work is their own "They sign their life away physically or electronically
> when they submit things." (I-1)

The "sign their life away" thing sounds a bit ominous, but when used well it's a
scaffolded way of getting students to list their sources & collaborators, and to
declare that anything else is their own work.

For my courses, the
[course website](https://cs.anu.edu.au/courses/comp1720/resources/faq/#statement-of-originality)
has an example of what a "filled out" statement might look like:

```YAML
declaration: >-
  I declare that everything I have submitted in this assignment is entirely my
  own work, with the following exceptions:


# add as many "name+comment" entries as necessary
# (or remove it altogether if you haven't collaborated with anyone)
collaboration:
  - name: Alice McGuffin
    comment: >-
      Alice gave me some ideas for creating the animated ripple effect
      in the background , but I never saw her assignment code
  - name: Jerry Wang
    comment: >-
      Jerry painted the background artwork for my sketch

# add as many "url+licence+comment" entries as necessary
# (or remove it altogether if you haven't used any external code)
code:
  - comment: the code in my "drawRandomImage" function is based on some code from StackOverflow
    url: "https://stackoverflow.com/questions/51233447/p5js-image-array"
    licence: CC BY-SA 2.5 # this is the standard StackOverflow licence
  - comment: my changeSize() function is taken from an example on the p5 reference page for mouseWheel
    url: "https://p5js.org/reference/#/p5.Element/mouseWheel"
    licence: "https://creativecommons.org/licenses/by-nc-sa/4.0/"


# add as many "url+licence+comment" entries as necessary
# (or remove it altogether if you haven't used any external assets)
assets:
  - comment: photo of potatoes by Scott Bauer
    url: "https://en.wikipedia.org/wiki/Potato#/media/File:Patates.jpg"
    licence: Public Domain
  - comment: boat photo by Aaron Wu on Unsplash
    url: "https://unsplash.com/photos/_8rjlHwN4uk"
    licence: "https://unsplash.com/license"
  - comment: some content in Artist Statement taken from Turner Wikipedia page
    url: "https://en.wikipedia.org/wiki/J._M._W._Turner"
    licence: CC-SA


# sign *your* name and uid here
name: Fleur DeLis
uid: u1234567
```

There are a few things to note here:

- this is from an art & code course, so there's separate parts for citing code,
  vs other assets (images, audio)

- the _code_ section contains an example from StackOverflow, since I didn't know
  until I put this thing together what the licence for code found on SO actually
  is (it's CC BY-SA 2.5)

- there's no explicit _name_ field, because while the author name is super
  important for referencing quotes in an essay, in computing it's sometimes hard
  to tell (for both "random code in blog post" situations and large open-source
  projects) who the author is

- for _code_, there is a _licence_ field, because that's what actually matters
  when using other peoples' code in the real world

## Why YAML?

Sharp-eyed readers will have noticed that this whole statement of originality is
a [YAML](https://phoenixnap.com/blog/what-is-yaml-with-examples) file, instead
of just a `.txt` or `.md` or `.docx`. In my courses I use the ANU's
(self-hosted) GitLab server for all submitted work, and I make heavy use of
GitLab CI (continuous integration) scripts to provide instant feedback on
various aspects of the students submissions[^autograding]. Using a
machine-readable file format like YAML for this means that I can provide more
targeted instant feedback about whether they've filled it out correctly.

[^autograding]:
    This isn't auto-grading, it's just automated feedback on boring bookkeeping
    stuff; have they included all the relevant files, does the code compile
    and/or run without error, etc. Anecdotally it does help eliminate most of
    the "whoops, you forgot to commit the file" problems, as well as minimising
    any manual "data cleaning" that my tutors & I have to do post-submission.

Just because it's got a YAML file extension doesn't mean that the students don't
accidentally submit badly-formed files which don't parse (even though there's
lots of tips on the
[FAQ page](https://cs.anu.edu.au/courses/comp1720/resources/faq/#yaml)). For my
purposes, that's fine---I don't dock any marks for that, and I don't really care
(because at present I don't do much automated processing of the
`statement-of-originality.yml` files anyway). The main thing is that the
students are given a chance in _every submitted piece of work_ to clearly
declare their sources, along with examples of how it should be done. And I
_think_ that it helps with at least some of the "whoops, I didn't know I had to
reference that" academic misconduct cases. And the fewer misconduct cases, the
more time I have for caring about students and their learning.
