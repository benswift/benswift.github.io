---
title: "The road to COMP4020: safety, YOLO and the open web"
description: "Fly Sprites as lightweight, snapshotable VMs for student coding---safe enough
  for YOLO mode, live on the open web by default."
tags: [comp4020]
image: /assets/images/posts/comp4020-safety-yolo-and-the-open-web.svg
---

:::tip

This post is part of a series I'm writing as I develop
[COMP4020: Agentic Coding Studio](/blog/2025/12/19/comp4020-rapid-prototyping-for-the-web/).
See [all posts in the series](/blog/tag/comp4020/).

:::

Running terminal agents in "YOLO mode", where they can run arbitrary commands
(and delete all your data, or worse) is the sort of thing which you _know_ you
shouldn't do. However, manually approving all the "can I use this tool" or "can
I edit this file" requests becomes such a PITA that many developers (myself
included, alongside
[many others I respect](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)) are
doing it anyway. Honestly, I have all my files backed up in a couple of
different places, and while I have semi-important files on my machine I don't
have the nuclear codes or anything. Most of all, Claude hasn't let me down yet
(famous last words, I guess).

However, that's me---thinking about teaching my students to use these tools
effectively is another matter. If I say "use YOLO mode" then I feel some
responsibility if it goes pear-shaped for them. So I'd rather they be safer, but
my career in human factors research also tells me that you've gotta be pragmatic
about what people are actually going to do.

There are a few emerging tools for squaring the "run wild, but don't break my
things" circle. [Devcontainers](https://containers.dev/) is one of the big ones.
However, [Fly.io](https://fly.io) recently released
[Sprites](https://sprites.dev/), which are lightweight (i.e. fast startup) VMs
with first class snapshot-and-restore functionality, and which automatically
spring to life on the open web with a URL and everything. There's lots you
_could_ do with this sort of setup, but I'm particularly interested in them for
supporting collaborative student work in COMP4020.

<svg width="100%" viewBox="0 0 500 210" xmlns="http://www.w3.org/2000/svg">
  <!-- Left: local machine (dashed = porous/risky) -->
  <rect x="20" y="15" width="200" height="140" rx="10" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="6 3"/>
  <text x="120" y="42" text-anchor="middle" font-size="13" font-weight="600" fill="#f87171">your machine</text>
  <line x1="45" y1="50" x2="195" y2="50" stroke="#f87171" stroke-width="0.5" stroke-opacity="0.4"/>
  <text x="120" y="72" text-anchor="middle" font-size="12" fill="#e2e8f0">Claude Code</text>
  <text x="120" y="93" text-anchor="middle" font-size="11" fill="#94a3b8">personal files &amp; SSH keys</text>
  <text x="120" y="110" text-anchor="middle" font-size="11" fill="#94a3b8">system packages</text>
  <text x="120" y="127" text-anchor="middle" font-size="11" fill="#94a3b8">everything you care about</text>
  <text x="120" y="185" text-anchor="middle" font-size="13" font-weight="600" fill="#f87171">YOLO = risky</text>
  <!-- Divider -->
  <text x="250" y="92" text-anchor="middle" font-size="15" font-weight="700" fill="#64748b">vs</text>
  <!-- Right: sprite (solid = contained/safe) -->
  <rect x="280" y="15" width="200" height="140" rx="10" fill="none" stroke="#86efac" stroke-width="2"/>
  <text x="380" y="42" text-anchor="middle" font-size="13" font-weight="600" fill="#86efac">sprite</text>
  <line x1="305" y1="50" x2="455" y2="50" stroke="#86efac" stroke-width="0.5" stroke-opacity="0.4"/>
  <text x="380" y="72" text-anchor="middle" font-size="12" fill="#e2e8f0">Claude Code</text>
  <text x="380" y="93" text-anchor="middle" font-size="11" fill="#94a3b8">this week's prototype</text>
  <text x="380" y="110" text-anchor="middle" font-size="11" fill="#94a3b8">nothing else</text>
  <text x="380" y="127" text-anchor="middle" font-size="11" fill="#94a3b8">snapshotable &amp; disposable</text>
  <text x="380" y="185" text-anchor="middle" font-size="13" font-weight="600" fill="#86efac">YOLO = go for it</text>
</svg>

The basic idea would be that for each week's
[prototype and studio session](/blog/2026/02/20/comp4020-the-core-mechanic/) the
students would do their work in a (fresh) sprite. They could ssh in and do the
dev work, and "serving" it on the web is as simple as running the dev server,
finding out what the sprite's URL is and then sharing that with their
classmates. More than that, for collaborative work, students could give each
other access to their sprite. That's safe, because it's got no data/files on it
except for that week's prototype. And because it's checkpointable even if one
student did bork another student's prototype, they could just roll back to a
previous snapshot and keep going[^git-rollback].

<svg width="100%" viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr2" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <path d="M 0 0 L 8 3 L 0 6 Z" fill="#94a3b8"/>
    </marker>
    <marker id="arr2-teal" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <path d="M 0 0 L 8 3 L 0 6 Z" fill="#80cbc4"/>
    </marker>
  </defs>
  <!-- Student dot -->
  <circle cx="35" cy="80" r="8" fill="#ffab91"/>
  <text x="35" y="104" text-anchor="middle" font-size="10" fill="#ffab91">you</text>
  <!-- Arrow to sprite -->
  <line x1="55" y1="80" x2="85" y2="80" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- Sprite box -->
  <rect x="93" y="20" width="215" height="150" rx="10" fill="none" stroke="#a5b4fc" stroke-width="2"/>
  <text x="200" y="46" text-anchor="middle" font-size="13" font-weight="600" fill="#a5b4fc">fresh sprite</text>
  <line x1="113" y1="55" x2="288" y2="55" stroke="#a5b4fc" stroke-width="0.5" stroke-opacity="0.4"/>
  <text x="200" y="78" text-anchor="middle" font-size="12" fill="#e2e8f0">Claude Code (YOLO mode)</text>
  <text x="200" y="100" text-anchor="middle" font-size="14" fill="#64748b">&#8597;</text>
  <text x="200" y="120" text-anchor="middle" font-size="12" fill="#e2e8f0">dev server</text>
  <text x="200" y="142" text-anchor="middle" font-size="11" fill="#80cbc4">abc123.fly.dev</text>
  <!-- Arrow to studio session -->
  <line x1="313" y1="95" x2="345" y2="95" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- Studio session box -->
  <rect x="353" y="20" width="132" height="150" rx="10" fill="none" stroke="#ffab91" stroke-width="2"/>
  <text x="419" y="46" text-anchor="middle" font-size="12" font-weight="600" fill="#ffab91">studio session</text>
  <line x1="368" y1="55" x2="470" y2="55" stroke="#ffab91" stroke-width="0.5" stroke-opacity="0.4"/>
  <!-- People dots -->
  <circle cx="378" cy="78" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="393" cy="73" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="408" cy="78" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="423" cy="73" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="438" cy="78" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="453" cy="73" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="385" cy="96" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="400" cy="91" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="415" cy="96" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="430" cy="91" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="445" cy="96" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="460" cy="91" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="392" cy="112" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="407" cy="117" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="422" cy="112" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="437" cy="117" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="452" cy="112" r="4" fill="#ffab91" fill-opacity="0.7"/>
  <!-- Tutor (slightly larger, different opacity) -->
  <circle cx="419" cy="138" r="5" fill="#ffab91" fill-opacity="0.9"/>
  <text x="419" y="155" text-anchor="middle" font-size="9" fill="#ffab91">~20 + tutor</text>
  <!-- GitLab box at bottom -->
  <rect x="130" y="220" width="200" height="42" rx="8" fill="none" stroke="#80cbc4" stroke-width="2"/>
  <text x="230" y="246" text-anchor="middle" font-size="12" font-weight="600" fill="#80cbc4">class GitLab server</text>
  <!-- Arrow from sprite down to GitLab (dashed = continuous flow) -->
  <path d="M 200 175 L 200 215" fill="none" stroke="#80cbc4" stroke-width="1.5" stroke-dasharray="4 2" marker-end="url(#arr2-teal)"/>
  <text x="228" y="200" font-size="10" fill="#80cbc4">git push</text>
</svg>

[^git-rollback]:
    I know that good git hygiene makes for easy rollbacks as well, and students
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

<svg width="100%" viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr3" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <path d="M 0 0 L 8 3 L 0 6 Z" fill="#94a3b8"/>
    </marker>
  </defs>
  <!-- GitLab -->
  <rect x="15" y="50" width="120" height="120" rx="10" fill="none" stroke="#80cbc4" stroke-width="2"/>
  <text x="75" y="78" text-anchor="middle" font-size="12" font-weight="600" fill="#80cbc4">GitLab</text>
  <line x1="30" y1="86" x2="120" y2="86" stroke="#80cbc4" stroke-width="0.5" stroke-opacity="0.4"/>
  <text x="75" y="108" text-anchor="middle" font-size="10" fill="#94a3b8">all students'</text>
  <text x="75" y="122" text-anchor="middle" font-size="10" fill="#94a3b8">source code</text>
  <text x="75" y="136" text-anchor="middle" font-size="10" fill="#94a3b8">&amp; history</text>
  <!-- Arrow GitLab → Sprites -->
  <line x1="140" y1="110" x2="172" y2="110" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr3)"/>
  <!-- Sprite grid -->
  <rect x="180" y="30" width="150" height="180" rx="10" fill="none" stroke="#a5b4fc" stroke-width="1.5" stroke-dasharray="4 2"/>
  <text x="255" y="52" text-anchor="middle" font-size="11" font-weight="600" fill="#a5b4fc">persisted sprites</text>
  <!-- Mini sprites (2x3 grid) -->
  <rect x="195" y="64" width="55" height="30" rx="5" fill="none" stroke="#a5b4fc" stroke-width="1"/>
  <circle cx="233" cy="75" r="3" fill="#86efac"/>
  <text x="216" y="86" text-anchor="middle" font-size="7" fill="#94a3b8">.fly.dev</text>
  <rect x="260" y="64" width="55" height="30" rx="5" fill="none" stroke="#a5b4fc" stroke-width="1"/>
  <circle cx="298" cy="75" r="3" fill="#86efac"/>
  <text x="281" y="86" text-anchor="middle" font-size="7" fill="#94a3b8">.fly.dev</text>
  <rect x="195" y="102" width="55" height="30" rx="5" fill="none" stroke="#a5b4fc" stroke-width="1"/>
  <circle cx="233" cy="113" r="3" fill="#86efac"/>
  <text x="216" y="124" text-anchor="middle" font-size="7" fill="#94a3b8">.fly.dev</text>
  <rect x="260" y="102" width="55" height="30" rx="5" fill="none" stroke="#a5b4fc" stroke-width="1"/>
  <circle cx="298" cy="113" r="3" fill="#86efac"/>
  <text x="281" y="124" text-anchor="middle" font-size="7" fill="#94a3b8">.fly.dev</text>
  <rect x="195" y="140" width="55" height="30" rx="5" fill="none" stroke="#a5b4fc" stroke-width="1"/>
  <circle cx="233" cy="151" r="3" fill="#86efac"/>
  <text x="216" y="162" text-anchor="middle" font-size="7" fill="#94a3b8">.fly.dev</text>
  <rect x="260" y="140" width="55" height="30" rx="5" fill="none" stroke="#a5b4fc" stroke-width="1"/>
  <circle cx="298" cy="151" r="3" fill="#86efac"/>
  <text x="281" y="162" text-anchor="middle" font-size="7" fill="#94a3b8">.fly.dev</text>
  <!-- Arrow Sprites → Students -->
  <line x1="335" y1="110" x2="367" y2="110" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr3)"/>
  <!-- Student cluster -->
  <text x="430" y="40" text-anchor="middle" font-size="11" font-weight="600" fill="#ffab91">the whole class</text>
  <!-- Dot cluster (~30 dots in a rough oval suggesting ~200 students) -->
  <circle cx="400" cy="62" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="415" cy="58" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="430" cy="62" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="445" cy="58" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="460" cy="62" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="393" cy="78" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="408" cy="74" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="423" cy="78" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="438" cy="74" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="453" cy="78" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="468" cy="74" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="390" cy="94" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="405" cy="90" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="420" cy="94" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="435" cy="90" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="450" cy="94" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="465" cy="90" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="388" cy="110" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="403" cy="106" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="418" cy="110" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="433" cy="106" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="448" cy="110" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="463" cy="106" r="3" fill="#ffab91" fill-opacity="0.8"/>
  <circle cx="393" cy="126" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="408" cy="122" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="423" cy="126" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="438" cy="122" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="453" cy="126" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="468" cy="122" r="3" fill="#ffab91" fill-opacity="0.7"/>
  <circle cx="400" cy="142" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="415" cy="138" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="430" cy="142" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="445" cy="138" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="460" cy="142" r="3" fill="#ffab91" fill-opacity="0.6"/>
  <circle cx="405" cy="156" r="3" fill="#ffab91" fill-opacity="0.5"/>
  <circle cx="420" cy="158" r="3" fill="#ffab91" fill-opacity="0.5"/>
  <circle cx="435" cy="156" r="3" fill="#ffab91" fill-opacity="0.5"/>
  <circle cx="450" cy="158" r="3" fill="#ffab91" fill-opacity="0.5"/>
  <text x="255" y="228" text-anchor="middle" font-size="10" fill="#ffab91">~200 students browse any prototype</text>
</svg>

None of this works without some unglamorous plumbing underneath. Each week's
provocation---the starting point for that week's prototype---is a template git
repo. Every student forks it and pushes their work, with the last push before
the deadline counting as their submission. This keeps things simple and
auditable, and it means CI can check some of the invariants automatically: does
the build step exit cleanly, does the served site return `200 OK` on the
required routes, are the process reflection `.md` files present in the repo,
that sort of thing.

I've already got tooling that can batch clone and run tests across all student
repos for a given class---plus a "badger" script that I run a few days before
the deadline to send a courtesy email to anyone who hasn't forked the template
yet, gently suggesting they get started. Extending all of this to also provision
and snapshot sprites per student is the next step, but the bones are there.
