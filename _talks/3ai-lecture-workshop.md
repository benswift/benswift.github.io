---
event: 3ai lecture/workshop, S2 2019
title: What can livecoding teach us about cyber-physical systems?
date: "2019-10-01"
permalink: /talks/3ai-lecture-workshop/
summary: >-
  Cyberphysical systems sure are important. But what counts as a CPS? And what
  can they teach us about the things that are important as we design and examine
  CPSs in _all_ areas of life?

  An interactive lecture/presentation/workshop given to the [3a Institute](https://3ainstitute.cecs.anu.edu.au) masters program.
---

{% include slides/title.html %}

## outline

[part un](#part-1): Ben live @ 3Ai

[part deux](#part-2): what makes a CPS?

[part trois](#part-3): what can livecoding teach us about CPS?

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/randy-fath-ymf4_9Y9S_A-unsplash.jpg" %}

{% include slides/background-image.html image="images/livecoding/ben-qic-1.jpg" heading="part un: Ben live @ 3Ai" id="part-1" %}

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/Hot-Shots-Part-Deux.jpg" heading="part deux: what makes a CPS?" id="part-2" %}

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/genevieve-bell.jpg" %}

---

> Advanced robotics, smart grids, autonomous cars, machine learning.
> **Cyber-physical systems** are literally all around us---systems that, as they
> converge, will have an unprecedented economic, social and cultural impact on
> humanity. -&nbsp;_from the [3Ai
> homepage](https://3ainstitute.cecs.anu.edu.au)_

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/US_Supreme_Court_Justice_Potter_Stewart_-_1976_official_portrait.jpg" heading="definition" bgsize="contain" bgcol="#222" %}

what is a cyber-physical system?

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/randy-fath-ymf4_9Y9S_A-unsplash.jpg" %}

<!-- potato -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/lars-blankers-B0s3Xndk6tw-unsplash.jpg" %}

<!-- car (w/o driver) -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/ant-miner-NvFEisZmVsQ-unsplash.jpg" %}

<!-- car (w driver) -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/patricia-prudente-oPZf7BegqSU-unsplash.jpg" %}

<!-- aibo -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/brett-jordan-U32jeOdkgfA-unsplash.jpg" %}

<!-- robot soccer -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/robot-soccer.jpeg" %}

<!-- {% include slides/image-credit.html artist="📸 AFP/Getty Images" link='<a href="https://slate.com/technology/2017/08/robot-soccer-tournament-displays-robots-mediocre-soccer-skills.html">🔗</a>' %} -->

<!-- MCG -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/daniel-anthony-UxektwAqMVw-unsplash.jpg" %}

<!-- user with smartphone -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/oleg-magni-LGNV-4-l8LA-unsplash.jpg" %}

<!-- factory worker -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/kat-maryschuk-5BFvAPQTi1U-unsplash.jpg" bgpos="bottom" %}

<!-- x-ray viewing -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/linkedin-sales-navigator-_h5CPTwuVHM-unsplash.jpg" %}

<!-- genevieve -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/genevieve-bell.jpg" %}

<!-- city -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/pawel-nolbert-4u2U8EO9OzY-unsplash.jpg" %}

<!-- school classroom -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/shubham-sharan-Z-fq3wBVfMU-unsplash.jpg" %}

<!-- parlie house -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/social-estate-P-t9yap_20M-unsplash.jpg" %}

<!-- nasa -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/nasa-Q1p7bh3SHj8-unsplash.jpg" %}

<!-- piano -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/clark-young-tq7RtEvezSY-unsplash.jpg" %}

<!-- rock band -->
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/matthew-kalapuch-sqJ4tLBiurw-unsplash.jpg" %}

<!-- Ben & Kieran at CECS welcome party -->
{% include slides/background-image.html image="images/livecoding/ben-kieran-cecs-welcome-party-2019.jpg" %}

{% include slides/impact.html %}

what **questions** do you ask?

{% include slides/impact.html %}

what's your favourite **boundary** case?

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/andy-sorensen-flatcap.jpg" heading="part trois: what can livecoding teach us about CPS?" id="part-3" %}

_Extempore: The design, implementation and application of a cyber-physical
programming language_ ([Andrew Sorensen's PhD
thesis](https://openresearch-repository.anu.edu.au/handle/1885/144603))

---

> Advanced robotics, smart grids, autonomous cars, machine learning.
> Cyber-physical systems are literally all around us---systems that, as they
> converge, will have an unprecedented economic, social and **cultural** impact
> on humanity. -&nbsp;_from the [3Ai
> homepage](https://3ainstitute.cecs.anu.edu.au)_

{: style="font-size:1.5em;"}
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/3ai-team-birthday.jpeg" bgpos="top" %}

{:.fragment}
autonomy

{:.fragment}
agency

{:.fragment}
potatoes

{: style="font-size:1.5em;"}
{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/3ai-team-birthday.jpeg" bgpos="top" %}

autonomy

agency

~~potatoes~~

assurance

## autonomy

> How do we design for an autonomous world?
>
> This is both a technical set of questions and a philosophical and public
> policy set of questions. Just because we can automate something, should we?
> When we translate human processes into machine processes, what do we need to
> consider?

- where's the **autonomy** in livecoding?
- what does failure look like
- what design intervention could we make to help out?

## agency

> How much agency do we give technology?
>
> As the ability for machines to act independently of human oversight increases
> with each new tech breakthrough, conversations need to be had about how much
> agency we give to intelligent cyber-physical systems. Are we comfortable with
> machines responding to their environment, and interacting with other machines,
> without a human to check and validate decisions?

- where's the **agency** in livecoding?
- what does failure look like?
- what design intervention could we make to help out?

## assurance

> How do we preserve our safety and values?
>
> Current technological progress calls for new regulatory tools and processes,
> as algorithms designed in different places are introduced into societies
> around the world. The virtual nature of these new goods and services has an
> impact on our ability to regulate their design and use in a way that aligns
> with core cultural values.

- where's the **assurance** in livecoding?
- what does failure look like?
- what design intervention could we make to help out?

{% include slides/impact.html %}

there are some "I"s as well as the "A"s

## indicators

> How do we measure performance and success?
>
> Technical systems have typically been measured on their efficiency. However,
> when systems start to learn and change their behaviour over time, the objective
> of efficiency may begin to clash with ideals that have previously been
> implicitly or tacitly inserted into the process by the humans in the loop. How
> do we start to conceptualise building for sustainability, for beauty, for
> values?

- what are the **indicators** in livecoding?
- what does failure look like?
- what design intervention could we make to help out?

## interfaces 

> How will technologies, systems and humans work together?
>
> In previous decades, we interfaced with computational systems through a screen
> and a keyboard. This paradigm is already being disrupted as ‘smart’ objects
> enter our lives. What will it mean when AI-enabled systems are all around us,
> sensing and responding to us? How to do protect our privacy? What happens to
> all that data?

- what are the **interfaces** in livecoding?
- what does failure look like?
- what design intervention could we make to help out?

## intent

> Why has the system been constructed? by whom? and for what purposes?
>
> It is sometimes tempting to think of a single, monolithic AI. However, AIs
> will be built for different purposes and with very different intentionality,
> and inside different larger systems. Making sense of, and mapping, that
> broader intentionality is central to the emergent new applied science.

- what is the **inten** in livecoding?
- what does failure look like?
- what design intervention could we make to help out?

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/US_Supreme_Court_Justice_Potter_Stewart_-_1976_official_portrait.jpg" bgsize="contain" bgcol="#222" %}

## open questions

- if/when is a (textual) code interface the best option for balancing
  agency/autonomy/assurance... in livecoding? and beyond?

- what feedback can we provide to help the livecoder stay "on top" of the
  autonomous processes? is that even desirable?

- how does the audience fit in? do they matter? what's _their_ agency?

- when do static analyses help, and when do they get in the way? what about "AI"
  helpers?

{% include slides/background-image.html image="images/talks/3ai-lecture-workshop/Defense.gov_News_Photo_020221-D-9880W-080.jpg" %}

{% include slides/image-credit.html
   artist="📸 R. D. Ward, US D.O.D."
   licence="public domain"
%}

<!-- TODO maybe an A-A-A triangle? -->

## what's next?

these questions keep me up at night

if you'd like to help (or just to hang out with the c/c/c group more generally)
then let me know 😊

{% include slides/questions.html %}

