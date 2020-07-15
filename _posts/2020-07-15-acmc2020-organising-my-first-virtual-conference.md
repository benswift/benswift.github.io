---
title: 'ACMC2020: organising my first virtual conference'
tags: web
---

I've been a bit quiet on this blog for the last few weeks[^weeks] because I've
been organising [ACMC2020](https://acmc2020.com/): the _2020 Australasian Computer
Music Conference_. From the conference landing page:

> This year's conference theme is **inclusion**. We want to highlight the
> diverse range of people who contribute to Australia's computer/electronic
> music culture but may not normally attend an academic conference, including
> artists and scholars who are young/emerging, from regional/remote areas, who
> have a disability, who are First Nations People, who have low/no income, who
> are engaged in community music making, or who simply work outside of academia
> and mainstream institutions.

Well, the conference is now all done for 2020. It's been a lot of hard work, but
the ACMC community are _amazing_, so it's been pretty fun as well. A special
shout out to the rest of the ACMC [organising
committee](https://acmc2020.com/#Organisers) (Charles, Nat, Sia, Kit & Alec) for
all their hard work---thanks team :) So even though I'm writing this blog post,
these decisions & reflections are really the result of our combined labour, as
well as feedback from the ACMC community during the conference.

[^weeks]:
    well, it's actually pretty common that I'm quiet for a few weeks, so I
    guess it's business as usual


## Tools for running an online conference in 2020

This post isn't about the success (or otherwise) of ACMC2020 as an inclusive,
affirming computer music conference. That post is in the works, but this isn't
it.

Instead, this post is a list of all the tools that we chose to use to put it all
together, and the rationale behind those decisions. There are lots of people all
around the world organising virtual conferences right now, so hopefully writing
down our experiences is helpful.

{% include toc.html %}

### Conference website {#website}

Initially we threw up simple [Jekyll](https://jekyllrb.com/) site (hosted using
GitHub Pages) with the basic conference info & Call for Papers. This was
super-easy and did the job through the initial phase of advertising the
conference and drumming up submissions.

Around the time we were finalising the accepted papers & conference schedule,
the ICLR team [posted on HN](https://news.ycombinator.com/item?id=23282113) that
the tooling for their [virtual
conference](https://iclr.cc/virtual_2020/index.html) was newly [available on
GitHub](https://github.com/Mini-Conf/Mini-Conf). We decided to use it as a
starting point for building the ACMC2020 conference website.

The final version of the ACMC site is still live (and will remain so for a while
at least) at <https://acmc2020.com/>, and the [source is up on
GitHub](https://github.com/australasian-computer-music-association/acmc2020) as
well.

![ACMC website screenshot]({% link assets/images/posts/acmc-website-words-sounds-screenshot.png %})

#### Reflections

- in the end I think it looked really great (and we received some [nice
  feedback](https://twitter.com/benswift/status/1280746825637453824)) but it was
  [a fair bit of
  work](https://github.com/australasian-computer-music-association/acmc2020/pulse)
  requiring a fair amount of web development experience to get it to that point
  (a big shoutout to Charles Martin who was a big help with this)

- a static site which is automatically populated based on data in a CSV or YAML
  file is a good option for a conference like this---it means as long as
  whatever system you're using to organise & schedule the accepted papers can
  output a `.csv` file you can probably make it work with this website template

- if I had my time again, I'm undecided as to whether I'd use the same
  [Mini-Conf](https://github.com/Mini-Conf/Mini-Conf) template as a starting
  point, or just write a new Jekyll plugin which adds similar features (and just
  has more mature docs/ecosystem for static site building)

### Submissions & peer review {#easychair}

We used [EasyChair](https://easychair.org/) for conference submissions,
partially because the size of this conference meant that we were able to sneak
in under the limits for their free tier. While the reviewing & final decisions
were done through EasyChair, at the end of that process we exported all the
accepted submissions as a big `.csv` file (which we imported into Google Docs---see
below).

#### Reflections

- since the [ACMA](http://computermusic.org.au/) has its roots in academia, the
  majority of the audience for this conference are familiar with the whole "call
  for papers -> peer review -> notification -> conference attendance" thing,
  however there were certainly people for whom this process was unfamiliar and a
  bit daunting

- EasyChair sucks, but the others (Precision Conference, CMT) suck too, so I
  wouldn't strongly push people one way on the other on this part of the
  process---as long as your choice allows you to export all accepted submissions
  & their metadata in some sort of machine-readable format (e.g. CSV, YAML) then
  just use whatever you like

- as a bonus, it allowed me to make a [snarky
  tweet](https://twitter.com/benswift/status/1280373973843247104) (which is
  _always_ a win)

### Scheduling/programming the sessions {#google-docs}

EasyChair worked fine for distributing the submissions for peer review &
selecting the ones we wanted in the conference. It doesn't really have a story
for how to organise those submissions into a coherent conference program. To do
this, we used a shared Google Docs spreadsheet. Starting with a CSV export, the
ACMC committee added information about which presentations should go in which
sessions and in which order. Finally, to get this data into the [conference
website](#website) we needed to manually "Download as `.csv`", then copy the
file into the `sitedata` folder ready to be picked up by the next build of the
conference website.

#### Reflections

- ACMA is lucky that _most_ of our community[^chronodiversity] is based in Australia across a
  relatively small range of timezones---if you're running an international
  conference then you need to think about the chronodiversity of your
  participants when you're scheduling your conference sessions (my colleague
  [Steve Blackburn](https://twitter.com/stevemblackburn) has a blogpost in the
  works about this)

[^chronodiversity]:
    actually, we did have some overseas participants, and the async nature of
    the [Discord chat](#discord) meant that people could mention them in their
    questions in the text chat, and they could log in at a later time to provide
    answers---this worked really well on a few occasions

- this step required the most manual work, which was certainly a hassle in the
  early stages of the scheduling process when things are changing a lot, however
  the convenience of being able to collaboratively work on the spreadsheet was a
  net win

- the [website infrastructure](#website) has a place for writing python scripts,
  and [we
  used](https://github.com/australasian-computer-music-association/acmc2020/blob/master/scripts/process_videos.py)
  to run consistency checks & other helpful analyses (because checking stuff
  with scripts is way more fun than checking it by eye, and _probably_ a
  time-saver...)

### Video presentations {#youtube}

All the AV content for the conference was streamed to "attendees" on YouTube.
ACMC isn't a traditional academic conference---there are audiovisual computer
music performances alongside more traditional paper presentations---but we put
everything on YouTube nonetheless.

A couple of the performances were livestreamed, but for the majority of the
conferenc program participants were asked to submit a video representing their
performance or paper presentation. Then, an [elaborate series of ffmpeg
scripts](https://github.com/australasian-computer-music-association/acmc2020/blob/master/scripts/process_videos.py)[^ffmpeg]
concatenated the videos to produce a single video per session, with consistent
"titlecards" announcing the authors & title of each new video in the session.

Each session video was uploaded to YouTube, and scheduled for "simultaneous
viewing" at the scheduled time using the [YouTube
Premiere](https://support.google.com/youtube/answer/9080341?hl=en) feature.
After the Premiere, the videos were (still are) left up on the [ACMC
YouTube](https://www.youtube.com/channel/UCKK95K68yVuok-qWNS4Z6Jw) for people to
catch up & watch at their leisure.

![ACMC YouTube channel screenshot]({% link assets/images/posts/acmc-youtube-screenshot.png %})

[^ffmpeg]:
    while this worked really nicely in the end, those scripts probably took me
    as much time to get right as the rest of the website stuff combined 😞

#### Reflections

- outsourcing the video delivery to YouTube (who, regardless of what you think
  of their business model, are **really good** at delivering video) saved
  so much stress, and the ability to upload & schedule the video ahead of time
  but still watch it all-together allows for synchronous discussion and q&a
  amongst attendees

- when the premiere is done, you don't have to "put the videos online for those
  who missed them"; they're already there (which is _so much easier_ than having
  to make talk recordings, edit them together, and then upload them somewhere)

- YouTube's analytics are also really good, if you're into that sort of thing,
  and you even get stuff like half-decent automatic subtitling and other
  accessibility wins

- it's hard to know what sort of viewership counts as "successful", but the ACMC
  conference videos (in total) are currently at 2.2k views and ~500h watch time

- in terms of wranging the videos pre-upload, [`ffmpeg`](https://ffmpeg.org/) is
  _amazing_ for dealing with all the weird audio/video formats that presenters
  will send you, however until you grok that each `ffmpeg` run is actually
  setting up a graph of audio & video sinks, sources & filters you're doomed to
  copy-paste stuff from StackOverflow and then stare in bewilderment at cryptic
  error messages (trust me... I learned this the hard way 😢)
  
- not all presenters[^acmc-presenters] at an academic conference have the skills
  (or the inclination) to create an engaging video of their work, so depending
  on your community you might see the occasional "monotone drone over text
  slides" presentation (but you'd get bad presentations at an in-person
  conference as well)

[^acmc-presenters]: actually, all the ACMC presenters were great this year ☺

### Q&A and discussion {#discord}

YouTube is great for 1-many one-way broadcasting, but not so great for two-way
communication, and especially not many-many interaction & discussion. For
discussion, ACMC2020 went all in on text-based chat using
[Discord](https://discord.com/new) (we created our own ACMC2020 Discord server
and sent an invite link to all conference participants).

![ACMC Discord channel screenshot]({% link assets/images/posts/acmc-discord-screenshot.png %})

#### Reflections

- live video chat can be great for situations where everyone already knows
  everyone else, but video (and even audio) can be a bit intimidating for
  newcomers to a community, and we wanted to make the q&a as inclusive as
  possible

- we considered Zoom, but it's really a video platform---as a text chat platform
  it's really bad (no persistent discussions, no ability to mention other
  participants, no emoji/reaction gifs, etc.)

- within the ACMC2020 Discord server, we created a separate "channel" for each
  conference session, where the live discussion would happen (all presenters
  would hang out in that channel during the session), but this also allowed for
  persistent session-specific questions to be asked and returned to later with
  more thoughtful answers (or to get around timezone differences)

- [Slack](https://slack.com/) would have probably worked similarly well to
  Discord, but we liked the fact that Discord makes it easy to jump into an
  "audio" chat---this was particularly useful for the keynote q&a sessions where
  the session chair could collate the questions from the text chat, but the
  speaker could respond using audio rather than having to type out their answers

### Going to the pub after the session

Sadly, the ACMC committee never found out a good way of recreating this part of
the usual conference experience at an online conference. Some folks who were
geographically co-located did get together and watch some of the streams
together, but the recent [Melbourne covid19
lockdown](https://www.abc.net.au/news/2020-07-07/metropolitan-melbourne-suburbs-back-in-coronavirus-lockdown/12431564)
meant that some people couldn't even do that.

#### Reflections

- some aspects of the online conference that I prefer, the ACMC community still
  needs to have some way of getting together in person to solidify the
  relationships which developed over the course of ACMC2020
