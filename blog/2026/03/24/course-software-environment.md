---
title: "The road to COMP4020: course software environment"
description: "Every CS/software development course has a policy on what software it uses -
  the only different is whether it's written down or not."
tags: [comp4020]
---

For the [previous courses I've developed](/teaching/) I've always (tried to, at
least) think hard about the course software environment. This includes which
OSes and software tools are installed on the lab machines, whether BYOD is
allowed (and to what extent the tutors will support you in that case if your
system is borked), in what environment the assessment will take place, etc.

Setting this out clearly is beneficial for me and for my students (and for our
IT team, because they know what we're on hook for supporting). And when I do
allow BYOD (which I try to, unless there's a good reason not to) I'm still able
to say what the recommended software stack is and give some tips on how to
install it. But I can also make it clear that if you _do_ BYOD then we can't
guarantee that we can always unpick the knots you get yourself tied up in, and
"the software stopped working the day before the deadline so I couldn't complete
the assignment" is never a way to get off the hook for late penalties.

Anyway, here's my current thinking for "required setup" for the Agentic Coding
Studio course:

- a working terminal environment where you can run e.g. Claude Code
- the ability to build & run Docker containers and other web infrastructure
  (e.g. node)
- Chrome/Chromium[^chrome]

While this means that students on macOS and Linux are probably going to have a
better time than students on Windows, I don't want to mandate this... just give
a big'ol caveat emptor (maybe it's "caveat artifex" for software developers?).
It's a course for undergraduate seniors and masters students, with solid
pre-requisites, so I think this'll be sufficient for this course. And because of
the [studio tutorial model](/blog/2026/02/20/comp4020-the-core-mechanic/) I
_don't_ want to have the tutorials in computer labs---I want them to be in flat,
flexible rooms where we can re-configure the tables, chairs and screens as
necessary to facilitate the best discussion dynamics.

## My software stack for teaching

However, for this course I will be clear with my students about the software
stack that I'm using in my teaching, including in the lectures where I always do
_a lot_ of live coding[^livecoding]. Basically it'll be what I've previously
written up as my
[new stack of choice for software development](/blog/2026/02/18/ben-s-dev-setup-2026-edition/),
which is unsurprising given that I designed that new stack around an agentic
coding workflow. Although I won't be forcing my students to use mutt :)

In particular, my plan for the lectures is to have a split screen:

- **terminal ([ghostty](https://ghostty.org)) on the left**...
- running [zellij](https://zellij.dev) as a multiplexer...
- which is managing multiple instances of
  [Claude Code](https://github.com/anthropics/claude-code),
  [Opencode](https://opencode.ai) etc. for coding, git for VCS, and
  [helix](https://helix-editor.com) for text editing, as well as other CLI/TUI
  tools as necessary
- **Chrome on the right** showing the current web page under development (i.e.
  the dev server, pointing to e.g. `localhost:4321`)

I don't tend to talk from slides (and almost never use slide notes) so to the
extent that the class will have slides they'll also just be a website, probably
reveal.js. This allows me to just mirror my whole display to the big screen. The
students see everything I see, there's nothing up my sleeve. I have no hard
evidence for this, but I think this is pedagogically important; I really do want
them to "look over my shoulder" as we work through things together. It does mean
that I need to be careful I don't (briefly) flash up my API keys or other
sensitive info in plaintext, though.

A couple of cool things I'm considering (but haven't tested yet) are:

- recording the terminal with [asciinema](https://asciinema.org) (the direct
  video feed of the screen will already be recorded, but it might be cool to
  share the asciinema recordings to make it easy to copy/paste text for
  remixing, and even to have students do analysis on the logs from my agentic
  coding sessions in class)

- using Zellij's new
  [read-only session sharing](https://zellij.dev/news/remote-sessions-windows-cli/#read-only-session-sharing)
  so the students can see (in their own terminal) a live-streamed read-only view
  of what's going on in my terminal. This might not add heaps---they can already
  see it on the projector screen, but again it's a live view they can copy-paste
  from and remix on the fly. In fact, I'm excited about the idea that even
  during lectures I can have students mess with the provocations I throw out, do
  their own agentic coding experiments, and then we can have parts of the class
  where I go around the room and show off the different creations of the
  students from the lectures.

I've just submitted my timetabling request for the main lecture (where this
setup will be used) and I'm hoping to get a newly-fitted out flat space with
configurable seating and large-format displays on every wall. That way I can
roam around with a madonna-mic and see what the students are doing and share
these things back with the class. Because interactive lectures/lectorials are
more fun, I reckon.

[^chrome]:
    Look, it's not my favourite browser either, but the dev tools are pretty
    good and it's a pretty safe baseline for a web dev course.

[^livecoding]:
    Here I mean "live coding" in the "writing code in real time, taking input
    and questions from students as I go" sense, not the specific
    [DJ-style livecoding](/livecoding/) sense.
