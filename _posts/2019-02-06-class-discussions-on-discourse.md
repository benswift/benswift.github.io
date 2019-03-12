---
title: Class discussions on Discourse
date: "2019-02-06 16:42:03 +0800"
tags: teaching web
---

In 2018 I (with the support of the Teaching & Learning IT team in [my
School](https://cs.anu.edu.au)) switched from [Piazza](https://piazza.com) to a
self-hosted [Discourse](https://www.discourse.org) instance for class
discussions. Specifically, I used it for [COMP1720: Art & Interaction in New
Media](https://cs.anu.edu.au/courses/comp1720/), a large-ish (~200 students)
introductory code/art programming and interaction design course. This course is
open to both CS and non-CS students, and can be counted towards a major in both
the CS and the ANU School of Art and Design.[^artgit]

[^artgit]:
  I also teach all the artists & designers to use git---and it works really
  well... with the appropriate scaffolding. Knowing how to use version control
  really does feel like having superpowers when editing digital, and seeing
  artists and designers realise this is pretty cool.

This wasn't because Piazza sucks---it's actually pretty great in lots of ways.
But there were a few things we hoped to that Discourse would do better:

1. integration with the rest of our class management infrastructure (so that the
   professor doesn't have to keep adding/students manually as enrolment grows
   and then settles down at the start of semester)

2. a [proper API](https://docs.discourse.org), rather than using one of the [unofficial
   Piazza API clients](https://github.com/hfaran/piazza-api) and hoping that
   Piazza didn't break things just before an assigment/exam

3. proper markdown support (with the ability to add whichever programming
   languages we like through [highlight.js](https://highlightjs.org)
   integration) rather than whatever they call the nonsense pseudo-markdown and
   flaky rich text editor that Piazza offers

4. self-hosting and controlling where the data is stored, because I don't think
   I ever figured out whether it was technically ok to store student data on a
   foreign server and compel students to create an account on same

5. a [plugin ecosystem](https://www.discourse.org/plugins) so that we could
   tweak it to suit our specific needs (and potentially develop our own plugins)

Still, there are a couple of things that Discourse is missing out-of-the-box
compared to Piazza:

1. the ability for instructors (professors & tutors) to mark a question/answer
   as a _good question/answer_ (really handy in teaching)

2. the ability for students to "post anonymously to other students" while still
   being visible (identifiable) to the instructors

3. ability for students to "accept" an answer,
   [SO](https://stackoverflow.com)-style (there's a [plugin for
   this](https://github.com/discourse/discourse-solved), but we didn't use it
   first time around)

## So how'd it go?

Pretty well---student engagement was higher than the previous year (with Piazza)
and anecdotal feedback was that the students liked it. The limitations described
above didn't bite _too_ hard, although I do think that the "post anonymously to
students" thing in particular does encourage students to speak up when they're
struggling in a way that they don't when their name is attached to everything.

Along the way, we also made some decisions about how to organise/administer a
Discourse server for use as a course forum. Since Discourse isn't specifically
designed for this task, we had to make a few choices, and it's worth laying them
out here in case anyone else is going down the same path. Note, you'll need to
get your head around the Discourse nomenclature if you're going to use it, but
the crash course is

- threads are called **topics**
- topics are grouped into **categories** and **subcategories** (but only 2
  levels max---no **subsubcategories**)
- **groups** are groups of users

So, the way we organised it was:

- each course is a **category**
- **subcategories** were devoted to e.g. lectures, labs, assignments, etc.
- _access control_: all students were enrolled into a **group**, which was given
  read/write access to the **category** with the same name[^samename]
- tutors (TAs) were given

[^samename]:
  the course category (list of topics) and group (list of members) could in
  principle have different names

Here's an example: for COMP1720 we set up

- a top-level _comp1720_ category
- a _comp1720_ group (in which all students in the course were automatically
  enrolled using the Discourse API)
- all tutors are members of a _comp1720-tutors_ group, which has a higher
  privilege level

This way, if a student is enrolled in multiple courses, they'll appear in
multiple groups. They'll have access to all the topics in the categories for
their courses, but not any topics from other course (of course).

One final bonus is that the default "homepage" for a logged in user shows the
latest posts across all the user's categories (although users can customise this
behaviour).

## Next steps

I've got a student who's working hard to develop a new plugin to restore the
"anon to students, visible to instructors" behaviour, since that's a
deal-breaker for a lot of folks (it nearly was for me as well). We'll release
that plugin when it's done and the kinks are worked out.

There are still things to figure out as well, but things are looking good. I
wouldn't go back; I think it's easier to add the things I miss from Piazza to
Discourse than the other way around.

If you've got experience with this sort of thing and have suggestions or
comments, then get in touch ([@benswift](https://twitter.com/benswift) or
<ben.swift@anu.edu.au>)
