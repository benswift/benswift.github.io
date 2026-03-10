---
title: "The road to COMP4020: safety, YOLO and the open web"
tags: [comp4020]
---

:::info

This post is part of a series I'm writing as I develop
[COMP4020/8020: Rapid Prototyping for the Web](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

Running terminal agents in "YOLO mode", where they can run arbitrary commands
(and delete all your data, or worse) is the sort of thing which you _know_ you
shouldn't do. However, manually approving all the "can I use this tool" or "can
I edit this file" requests becomes such a PITA that I (and [many other
developers I respect](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)) that
many developers (myself included) are doing it. Honestly, I have all my files backed up in a couple of different places, and
while I have semi-important files on my machine I don't have the nuclear codes
or anything. Most of all, Claude hasn't let me down yet (famous last words, I
guess).

However, that's me---thinking about teaching my students to use these tools
effectively is another matter. If I say "use YOLO mode" then I feel some
responsibility if it goes pear-shaped for them. So I'd rather they be safer, but
my career in human factors research also tells me that you've gotta be pragmatic
about what people are actually going to do.

There are a few emerging tools for squaring the "run wild, but don't break my
things" circle. [Devcontainers](https://containers.dev/) is one of the big ones. However,
[Fly.io](https://fly.io) recently released [Sprites](https://sprites.dev/), which are
lightweight (i.e. fast startup) VMs with a) first class snapshot-and-restore
functionality and b) automatically spring to life on the open web with a URL and
everything. There's lots you _could_ do with this sort of setup, but I'm
particularly interested in them for supportign collaborative student work in
COMP4020.

The basic idea would be that for each week's
[prototype and studio session](/blog/2026/02/20/comp4020-the-core-mechanic.md)
the students would do their work in a (fresh) sprite. They could ssh in and do
the dev work, and "serving" it on the web is as simple as running the dev
server, finding out what the sprite's URL is and then sharing that with their
classmates. More than that, for collaborative work, students could give each
other access to their sprite. That's safe, because it's got no data/files on it
except for that week's prototype. And because it's checkpointable even if one
student did bork another student's prototype, they could just roll back to a
previous snapshot and keep going[^git-rollback].

[^git-rollback]:
    I know that good git hygeine makes for easy rollbacks as well, and students
    _will_ be committing and pushing their work to git as well. But this is
    still easier than setting up full push-to-deploy pipelines for arbitrary
    tech stacks, not to mention if the "broken things" are outside of the
    git-controlled source, e.g. installation/removal of OS packages.

Marking, too, would be as simple as snapshotting at the right time (or perhaps
several snapshots---I think that marking the progression of these prototypes is
going to be more important than marking the finished prototype). And I really
like Fly's commitment to fast-starting, on the web by default infra. I've been a
happy user of their platform for a few years now and these sprites seem like a
really interesting idea for teaching programming.
