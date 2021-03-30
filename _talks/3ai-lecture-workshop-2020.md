---
event: "3ai New Applied Science: Lab, S1 2012"
title: Understanding & enjoyment
subtitle: non-linear relationships in code art & beyond
date: "2020-05-20"
permalink: /talks/understanding-and-enjoyment/
summary: >-
  Understanding the sometimes tricky relationship between understanding &
  enjoyment in various traditional and new cultural practices.

  An interactive lecture/workshop given to the [3A Institute](https://3ainstitute.cecs.anu.edu.au) masters program.
---

{% include slides/title.html %}

{% include hljs.html %}

{% include slides/ack-country.html %}

## outline

[part un](#part-1): a complicated relationship

[part deux](#part-2): Ben codes the 80s

[part trois](#part-3): beyond enjoyment?

{% include slides/impact.html %}

{:style="font-size:0.6em;"}

<{{ page.url | prepend: site.baseurl | prepend: site.url }}>

{% include slides/background-image.html image="images/talks/understanding-and-enjoyment/kambah-high-demolition.jpg" id="part-1" %}

{% include slides/background-image.html image="images/talks/u3a-world-since-google/ben-smiths-sounscapes.jpg" %}

The code/creativity/culture (c/c/c) studio is a research & creative practice
collective within the Research School of Computer Science. We exist to open up
spaces for discussion about the way that `code` is shaping flows of
information/culture/humanity in today's (and tomorrow's) world.

<https://cs.anu.edu.au/code-creativity-culture/>

{% include slides/background-image.html image="images/talks/understanding-and-enjoyment/strong-songs-kirk.jpeg" %}

{% include slides/background-image.html image="images/talks/understanding-and-enjoyment/jehyun-sung-6U5AEmQIajg-unsplash.jpg" %}

<hr class="center">

{:style="font-size:0.9em;"}

```python
# a 3Ai twitter bot
for tweet in api.user("3AInstitute").timeline(limit=200):
  if tweet.user.location == "San Francisco":
    tweet.retweet_with_comment("I have so. many. questions.")
```

## collaborative task 1 (5mins)

- nominate a storyteller
- at this point, we're thinking in _generalities_

{% include slides/background-image.html image="images/talks/understanding-and-enjoyment/mick-haupt-AOyR7aMFHyU-unsplash.jpg" heading="Ben codes the 80s" id="part-2" %}

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/cyberphysical-livecoding.jpg" %}

{% include slides/impact.html %}

understanding & enjoyment

{:.fragment}

it's complicated

{% include slides/impact.html %}

**3A3Ii**: there are 3 "I"s as well as the 3 "A"s

## indicators

> How do we measure performance and success?
>
> Technical systems have typically been measured on their efficiency. However,
> when systems start to learn and change their behaviour over time, the objective
> of efficiency may begin to clash with ideals that have previously been
> implicitly or tacitly inserted into the process by the humans in the loop. How
> do we start to conceptualise building for sustainability, for beauty, for
> values?

## interfaces 

> How will technologies, systems and humans work together?
>
> In previous decades, we interfaced with computational systems through a screen
> and a keyboard. This paradigm is already being disrupted as ‘smart’ objects
> enter our lives. What will it mean when AI-enabled systems are all around us,
> sensing and responding to us? How to do protect our privacy? What happens to
> all that data?

## intent

> Why has the system been constructed? by whom? and for what purposes?
>
> It is sometimes tempting to think of a single, monolithic AI. However, AIs
> will be built for different purposes and with very different intentionality,
> and inside different larger systems. Making sense of, and mapping, that
> broader intentionality is central to the emergent new applied science.

## collaborative task 2 (10mins)

design intervention: what scaffolding could you provide to move the needle on
u&e in a livecoding gig?

- context/staging
- preamble/postamble
- auxilliary sound/visuals
- examples/guidelines
- ...

{% include slides/impact.html %}

understanding & en**joyment**

{% include slides/impact.html id="part-3" %}

understanding & en**gagement**

## what can we learn about u&e for...

- labour/automation
- digital rights & privacy
- democracy
- platform economics
- UBI
- ...

{% include slides/impact.html id="part-3" %}

understanding & en**franchisement**

## what's next?

these questions keep me up at night

if you'd like to help (or just to hang out with the c/c/c group more generally)
then let me know 😊

{% include slides/questions.html %}

