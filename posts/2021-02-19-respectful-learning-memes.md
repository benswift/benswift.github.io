---
title: Respectful Learning Memes
tags: teaching
---

{:.hl-para}
**Note**: this post was noticed by the good folks at the [ANU Centre for
Learning and
Teaching](https://services.anu.edu.au/business-units/centre-for-learning-teaching),
and they asked if they could syndicate it on their Interact blog---so you can
[read it
there](https://interact.weblogs.anu.edu.au/2021/03/03/respectful-learning-memes/)
as well.

A few years ago I re-wrote one of our core [computer architecture
courses](https://cs.anu.edu.au/courses/comp2300/) (it has the course code
COMP2300). It's a large (400+ students) compulsory course, so there's a spread
of different levels of interest, aptitude & enthusiasm in the student cohort.

One of the tricky parts of COMP2300 is that it doesn't use a high-level
programming language (with recognisable keywords like `if`, `else`, `for`, etc.)
where a function which adds two integers (whole numbers) together might look
like this:

```c
int add(int a, int b) {
  return a + b;
}
```

Instead, in COMP2300 all the programming is done in "assembly" language, which
is fairly close to the direct stream of bytes that the CPU sees as it's
executing your code. But it's less readable to humans---the above `add` function
might look like this in assembly language:

```arm
add:
  sub  sp, sp, #8
  str  r0, [sp, #4]
  str  r1, [sp]
  ldr  r0, [sp, #4]
  ldr  r1, [sp]
  add  r0, r0, r1
  add  sp, sp, #8
  bx   lr
```

While this is a great chance to learn how CPUs work, the unfamiliarity can
be challenging---and the students aren't shy about saying so.

## The hidden communication channels

I've learned over the last few years is that for every "official" course
forum/communication channel there's _at least_ one shadow channel that's created
somewhere else. These Facebook/WhatsApp/Insta/WeChat/TikTok/etc. channels are
where the students really let their hair down and say what they think about the
course.

One unexpected (to me) upside of these channels is that as the students chat
with one another, they come up with some really helpful explanations of the
concepts they're struggling with in the course material. And they're _really_
good at making **memes**. Here are just a few of the ones which I've seen end up
on the allowed "cheat sheets" in the COMP2300 final exam.

{% include picture.html file="images/posts/respectful-learning-memes/comp2300-offramp.jpeg" alt="COMP2300 offramp meme" %}

---

{% include picture.html file="images/posts/respectful-learning-memes/comp2300-galaxy-brain.jpeg" alt="COMP2300 galaxy brain meme" %}

---

{% include picture.html file="images/posts/respectful-learning-memes/comp2300-joey.jpeg" alt="COMP2300 Joey from Friends meme" %}

---

{% include picture.html file="images/posts/respectful-learning-memes/comp2300-obiwan.jpeg" alt="COMP2300 ObiWan meme" %}

---

{% include picture.html file="images/posts/respectful-learning-memes/comp2300-anakin.jpeg" alt="COMP2300 Anakin Skywalker meme" %}

I don't know where they came from---although clearly at least some of them were
created specifically for COMP2300. But I know from talking to students that they
really helped them understand and remember key concepts from the course.

## Harnessing students as content creators

I'm currently brushing up my course syllabus for the new semester which starts
next week. And I'm sure my students will make new memes for (among other things)
explaining the course content to each other. But if these memes only appear on
the "secret" channels then that's not good from a student equity perspective. I
want to make sure _all_ students benefit, not just the ones in the right
"hidden" channels.

So this year I'm going to include a meme thread as part of the official course
forum. Since it's an official course communication channel I'm sure it'll be
kept [respectful](https://twitter.com/RespectfulMemes), and then all my students
can benefit. As I teach bigger and more diverse classes, the chance to harness
these students' brilliance in meme-making (and some of them are _seriously_ good
at it) to help all my students learn seems like a win. I can't wait to see what
they come up with ☺

**Note**: if you're using MS Teams for your class discussion, there's even a few
settings relating to memes and gifs which you might want to make sure are
enabled.

{% include picture.html file="images/posts/respectful-learning-memes/teams-meme-settings.png" alt="MS Teams meme settings" %}
