---
layout: post
title: On livecoding annotations and visualisations
date: 2019-01-31 09:53 +1100
tags: livecoding
---

I've just finished reading Charlie Roberts'
[interactive web essay on annotations and visualisations for live code](https://charlieroberts.github.io/annotationsAndVisualizations/).
If you haven't read it, go do that now---and make sure you have some
speakers/headphones to listen to the code examples, because it would be a real
shame to read it without watching/listening to his ideas in action. All the code
samples (with the visual annotations) are live-editable, both running "whole
blocks" and re-evaluating individual expressions with `ctrl+enter`.

The essay lays out some guiding principles:

> There are three principles that guide the design of the presented annotations
> and visualizations.
>
> 1. If a value changes over time (typically related to musical progression or
>    signal processing), display its current state, either by adding a
>    visualization / annotation or by modifying the source code to reflect the
>    current value.
> 2. Make annotations and visualizations as proximal as possible to the code
>    fragment responsible for generating the data they are representing.
> 3. In addition to displaying when values change, whenever possible also
>    provide some indication of when a value is being read, in particular when
>    there is a direct affect on musical / sonic output.

It then goes on to show some example visualisation in
[gibberwocky](http://gibberwocky.cc/), both in an "all in" demo and then in
bite-sized listings which show off the different specific ideas. In general, I
really like the ideas, and it's something Andrew Sorensen and I have written
about before in our paper [Visual Code Annotations for Cyberphysical
Programming]({% link research.md %}#swiftVisualCodeAnnotations2013) (2013) in
the _1st International Workshop on Live Programming (LIVE)_ (it's reference #4
in the essay). I'll refer to this a bit in this post, so let's call it "the LIVE
paper".

I also think that the three points listed above are pretty solid, especially in
a multimedia livecoding context (maybe even in a broader context). One thing I
like about the visual annotations provided is that they're mostly ASCII (or
ASCII-ish). This is not so important when deploying them in the web browser
(since you can do so much fancy styling stuff with CSS & js these days) but it's
really important when dealing with... _ahem_, more venerable editors. I ended up
having to use some unholy Emacs hacks with
[overlays](https://www.gnu.org/software/emacs/manual/html_node/elisp/Overlays.html)
to get the original annotations discussed in the LIVE paper working.

I think that displaying hidden state in comments is a good compromise, and
avoids the need for fancy "extra-textual" overlays. Not that overlays aren't
sometimes useful, but there's a lot you can show with inline `text-decoration`
hacks and adding a few comments to provide ascii text to decorate (when it isn't
explicitly represented in the first place).

## Mixing annotations and live edits

**But**, (you can probably tell that there was going to be a "but" somewhere)
many of the cool annotations displayed don't work while the code is being
edited[^broken]. In some cases they actually break the code (try editing one of
the `'x*ox*xo--x*x*o'` patterns while the code's running---you'll end up with
new stuff in your pattern that you didn't put there).

[^broken]: Charlie, if I'm doing it wrong, please let me know :)

The problem isn't so obvious when all the code listings are fully-formed on page
load, and you can just play them as is. But when you try and mess with the code
then you'll see what I mean (again, I really suggest that you try it---it's
super-cool being able to mess around with the live code in the browser).

I feel this particularly keenly because I'm a clean-slate livecoder (as is
Charlie), so I'm _always_ moving through an incomplete code state until I get
something which will even run. This isn't just a problem for clean-slate
livecoding, though---even tweaks to existing code which introduce "bad" code
states (from the visualisation's perspective) will cause these issues.

We talked about this in the LIVE paper---the fact that there's a distinction
between the "state of the world" vs "state of the code". This is a fundamental
challenge for the sorts of inline code visualisation/annotations shown in the
essay, because it's using the **code** as the "raw material" for displaying
information about the **world** (beat/timing and other "hidden variables", audio
engine state and output, etc.).

There are a few different ways to tackle this problem:

1. mark some annotations as "safe" for code being edited, and some "unsafe"
2. when code is being edited, turn off all annotations (or at least for that
   expression)
3. some sort of "grand unified theory" of the delta between the current code
   state and the current execution state, and reconcile these to provide a
   maximal set of acceptable visualisations (this approach includes a
   [coq](https://coq.inria.fr/) program to formally verify that you're doing
   everything right)

I think the pragmatic choice is #2, as long as the "disabled edits" section is
kept as small as possible. It's still going to be a pain, though, because when
I'm livecoding I'm tweaking stuff all the time, so it's likely that a lot of the
code will spend a lot of the time with the visualisations disabled.

I'll leave #3 up to people smarter than me 😁 (although perhaps there are
heuristics which could do a decent job).

Finally, I can identify with Charlie when he writes:

> But, in the end, the feedback provided by these annotations and visualizations
> have become a critical part of my live coding practice.

I get this---in my experience (when I've had even more limited annotations than
the ones he shows in the essay) are just as much for my benefit as the audience.
Livecoding is hard, and any extra information you can get about what's going on
with your code is super helpful.

In principle visual code annotations can be even more useful to the livecoder
because they allow her to "audition" algorithmic changes to the code
without[^feedback] actually eval-ing the code and changing the music. Here's an
example from the essay:

```js
Euclid(9, 16); /* 1010110101011010 */
```

I might not always know what the `9,6` euclidean rhythm is, but I'm by now
fairly used to looking at `10100010` sequences and "hearing" the rhythm in my
head. I could poke around with the parameters in a live set, exploring the
parameter space (and thinking through the effect it'll have on the music) and
then only evaluating the code when I'm satisfied. That's super powerful---the
equivalent of the DJ cueing the next track with one can on their ear, and one
ear in the club---something which I don't have currently in my livecoding setup
(although others might).

[^feedback]:
    Yes, I know that the real-time feedback of hearing the sound is crucial, and
    I'm not for a second saying that we do away with it, but there are some
    situations where I want to check what the result of an algorithmic/parameter
    change might be without inflicting it on the audience.

## Conclusion

You can probably tell that I think there's a productive research agenda
here---and I hope Charlie continues with it. I hope to help out myself, too. I
guess my main point is just to shout from the rooftops:

> any code visualisation/annotation techniques must be robust for **code which
> is currently being edited**

I'm not just talking about technical issues, either; obviously any
demo/prototype is going to have those, but they're fixable. I think there are
deeper issues with trying to use _live_ text as both the description of program
behaviour and as a "view" on the hidden state of the program.

Anyway, this is just a blog post, so I'm off the hook with regard to rigour,
accountability and just general good scholarship, right 😜

## Addendum: thoughts on web publishing

I love that this essay/paper is published online---the interactive examples are
crucial to getting the point across. I know that some conferences & journals
these days allow html submission (nicer for reading on mobile, anyway) and other
multimedia artefacts (audio/video recordings) but it's still hard to get
traction for this sort of rich, interactive in-browser work. The fact that at
the end Charlie has to say:

> If you're going to cite this website in an academic paper, please consider
> also citing either reference #1 or reference #7 given above; citations of such
> papers count more in academia than citations of a website. Plus, there's
> further information in them not covered in this essay. Thank you!

Oh well. Mad props to Charlie for putting this out there for comment and
discussion, and hopefully there are a new generation of publications[^distill]
where this stuff can be front-and-centre, not just a weird "supplemental web
materials" section to a traditional pdf.

[^distill]:
    [Distill](https://distill.pub/) is great, but it's pretty DL/AI-focussed.
    The livecoding community needs something similar (although it does privilege
    livecoding environments which work in the brower, so that's not ideal
    either. Hmm.)
