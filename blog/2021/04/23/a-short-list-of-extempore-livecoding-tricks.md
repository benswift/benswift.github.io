---
title: "A short list of Extempore livecoding tricks"
tags:
  - livecoding
  - extempore
  - lens
---

Yesterday's [LENS](https://comp.anu.edu.au/courses/laptop-ensemble/) class
discussion turned into an [AMA](https://www.reddit.com/r/AMA/) of how I do
certain things when I'm livecoding in Extempore. As promised, here's a blog post
where I've put together all of the things we've discussed (with a bit more
explanation). If you're in the LENS '21 class this'll hopefully be a helpful
complement to yesterday's class discussion. If you're not in the class, then
maybe you've always been curious about certain things I (over)use in my
livecoding sets? This is maybe a bit too niche to go in the general Extempore
documentation, but if you've got any questions then you can hit me up on Teams
(for LENS students) or the
[Extempore mailing list](mailto:extemporelang@googlegroups.com) (everyone else).

[[toc]]

## the `cosr` macro

`cosr` is just a convenient way of sinusoidally modulating something with a
period synced to the tempo.

When it came to writing up this part of yesterday's discussion I had _déjà
vu_---I was sure I'd written this stuff up elsewhere. Turns out I have---it's in
the main Extempore docs as part of the
[pattern](https://extemporelang.github.io/docs/guides/pattern-language/#what-is-cosr)
guide.

One other tip which I mentioned yesterday: if you use fractions for the period
(final argument) which have a co-prime numerator & denominator (e.g. 7/3 or
15/8) then you'll get interesting accenting patterns, but which will still
repeat (so it gives a bit more structure than just using `random`).

One other related trick that I use is doing "mod" calculations on the `beat`
variable (which is an explicit argument in most temporal recursions), but is
also implicitly bound in the pattern expression if you're using the pattern
language:

```xtlang
(if (= (modulo beat 2) 0)
    (println 'downbeat))

(if (= (modulo beat 2) 1)
    (println 'upbeat))
```

## adding instruments to the sharedsystem setup

The default sharedsystem instruments are defined near the top of the
`examples/sharedsystem/audiosetup.xtm` file:

```xtlang
(make-instrument syn1 analogue)
(make-instrument syn2 analogue)
(make-instrument syn3 analogue)
(make-instrument kit dlogue)
(make-instrument samp1 sampler)
```

If you want to use different instruments, you can add them to the various DSP
callbacks `dsp1` to `dsp5` (this multi-DSP-function setup is to allow the audio
engine's work to be distributed across multiple cores).

In each of the DSP functions (e.g. `dsp1`), the actual work of getting the
"signal" out of the relevant instrument happens in a line like this:

```xtlang
(set! out (syn1 in time chan dat))
```

To add e.g. an `fmsynth` to the sharedsystem setup, there are two steps:

1. define the `fmsynth` instrument somewhere with
   `(make-instrument fmsynth fmsynth)`

2. call the `fmsynth` function in one of your DSP functions (doesn't matter
   which one---they all get summed in the end) callbacks and make sure the
   return value is added to one of the `out` variables

Here's an example (in `dsp1` as per the previous example):

```xtlang
(set! out (+ (syn1 in time chan dat)
             (fmsynth in time chan dat)))
```

Then, any notes you play (using `play`) on the `fmsynth` instrument will make
their way into the audio output.

## markov chains

As discussed yesterday, Scheme (most lisps, really) makes it pretty easy to
represent markov chains.

Consider the following temporal recursion, which (in addition to the usual
`beat` and `dur` arguments) also takes a `pitch` argument. This is the exact
code I wrote yesterday:

```xtlang
(define (obi-lead beat dur) pitch
  (play samp1 pitch (cosr 75 20 5/3) dur 2)
  (callback (*metro* (+ beat (* .5 dur))) 'obi-lead (+ beat dur) dur
            (random (cdr (assoc pitch '((60 60 63 67)
                                        (63 67 60)
                                        (67 58)
                                        (58 60)))))))

(obi-lead (*metro* 'get-beat 4) 1/4 60)
```

The markov chain happens in that `(random (cdr (assoc ...)))` line at the end of
the definition of the `obi-lead` function. A couple of things to note:

- the `cdr` is only necessary to make sure that a "self-transition" (i.e. the
  pitch staying the same) only happens if you explicitly add the same pitch as
  an element _other than_ the first element of the list. Otherwise, you wouldn't
  be able to make a markof chain that always went to a _different_ pitch from
  the current one.

- the `random` call isn't a special "markov" random, it's just the normal
  `random` picking from a list of pitches (so you can use the same "use the same
  element multiple times for weighted sampling" trick mentioned below)

- you can do whatever you want with the `pitch` argument inside the body of the
  `obi-lead` function---the fact that we `play` it here is a common pattern, but
  you could e.g. fire out an OSC message, etc.

- this is just a specific example of the more general class of algorithms which
  use a temporal recursion to pass variables to subsequent callbacks, and
  potentially do tests/operations on said variables to change them for future
  callbacks

- the onus is on the livecoder to make sure that each possible state (i.e. each
  value that `pitch` can take) is represented as the head (`cdr`) of one of the
  lists. But as long as you satisfy that invariant then the `obi-lead` markov
  process will just keep on playing the `pitch` as it travels through time and
  space[^mb].

[^mb]:
    to the
    [world of the Mighty Boosh](https://www.youtube.com/watch?v=uf723IeStzc)

## weighted random selections from a list

As promised (Caleb!) here's the syntax for doing a weighted random sample: the
key is that the argument to `random` isn't a list of `cons` pairs, it's multiple
`cons` pair arguments, each one of the form `(cons WEIGHTING VALUE)`.

```xtlang
;; here's an example: note that it's in a "do 10 times" loop to show that the
;; values are indeed sampled using the appropriate weighting
(dotimes (i 10)
  (println 'i: i (random (cons 0.1 1) (cons 0.9 -1))))

;; printed output:
;;
;; i: 0 -1
;; i: 1 -1
;; i: 2 -1
;; i: 3 -1
;; i: 4 1
;; i: 5 1
;; i: 6 -1
;; i: 7 -1
;; i: 8 -1
;; i: 9 -1
```

Note that if you're happy with just rough "this value is twice/three times as
likely as the others" then it's usually simpler to just randomly sample
(equally-weighted) from a list, including duplicate values for the things you
want to turn up more often in the output:

```xtlang
;; 0 will be twice as likely as 3 or 7
(random (list 0 0 3 7))
```

## `rel` for relative pitches

::: tip

From here on, all the following code snippets assume you've loaded the pattern
language with

```xtlang
(sys:load "libs/core/pattern-language.xtm")
```

Note that the pattern language library is loaded when you load the sharedsystem
as well.

:::

Based on the (global) `*scale*` variable, you can use `rel` to calculate pitches
"relative to" a starting pitch.

So, if you're starting with a middle C (midi note `60`) and you want to go `2`
notes up the scale (and you haven't changed value of the `*scale*` variable from
the default "C natural minor" scale) then you can use:

```xtlang
(rel 60 2)
```

This can be handy when paired with the `range` function (which just generates
lists of integers) for running your scales:

```xtlang
(:> scale-runner 4 0 (play samp1 (rel 60 @1) 80 dur) (range 8))
```

Note that this is just a slightly terser version of `pc:relative` (in
`libs/core/pc_ivl.xtm`) function, which doesn't use the `*scale*` variable by
default. Note _further_ that `rel` takes an optional third argument for
providing a different scale, if e.g. you want to use a different scale for your
"relative pitch" calculation than you're currently using elsewhere in the piece.

Here's an example:

```xtlang
;; set scale to F natural minor
(set! *scale* (pc:scale 5 'aeolian))

;; use a Fm7 chord (a subset of F natural minor) for the relative pitch calculation
(rel 65 (random 4) (pc:chord 5 '-7))
```

If you `println` the output of that `(pc:chord 5 '-7)` (_Fm7_) function, you'll
get the result `(5 8 0 3)`, which corresponds to the following pitch classes:

- `5`: F
- `8`: A♭
- `0`: C
- `3`: E♭

which are the pitches from an Fm7 chord, so it all checks out.

As one final tip, you can just skip the call to `pc:chord` altogether and do
something like:

```xtlang
(rel 65 (random 4) '(5 8 0 3))
```

This makes it super-easy to make quick edits, e.g. if you want to flatten the
fifth (C). But it does make it a little less readable for the audience (and
let's face it, reading `(pc:chord 5 '-7)` was already pretty tough going for
most folks outside the _music theory_ ∩ _computer programmer_ intersection).

## `nof` and the macros vs functions distinction

`nof` (think "give me _n_ of these") is a Scheme macro for creating a list by
repeatedly evaluating a form.

So, one way to get a list of 10 `0`s is:

```xtlang
(nof 10 0)
```

To get a list of 4 random integers between `0` and `9` (inclusive) you could
use:

```xtlang
(nof 4 (random 10))
```

I just evaluated the above form on my machine; the result was `(0 9 9 8)`. Note
that the numbers are different; so the `nof` macro is obviously not just taking
the result of a single call to `(random 10)` and repeating it `4` times to
create a list.

This is where the fact that it's a _macro_---not a function---comes into play.
One trick for looking at what a macro form "macroexpands" out to is calling
`macro-expand` (note that the `nof` form has been quoted using `'`):

```xtlang
(println (macro-expand '(nof 4 (random 10))))

;; prints:

;; (make-list-with-proc 4 (lambda (idx) (random 10)))
```

So, the list is actually formed by four repeated calls to a `lambda` (anonymous)
function, and that's why the four random numbers in the above list are
different.

If this isn't actually the behaviour you want---if you want the same random
number repeated four times, there's a `repeat` function which you probably want
to use instead. Notice the difference:

```xtlang
(println (nof 4 (random 10)))
(println (repeat 4 (random 10)))

;; prints:

;; nof: (1 3 3 6)
;; repeat: (5 5 5 5)
```

So keep that in mind when you're using `nof` in your pattern language. It'll
probably just work, but this subtle macro vs functino thing may be the cause of
errors or weird behaviour that you see.

## quasiquote (`` ` ``) vs regular quote (`'`)

The quasiquote (`` ` ``) symbol (which is also called the _tilde_) is like the
normal quote operator (`'`), except that you can "undo" the quoting (i.e. eval)
inner forms as necessary using the unquote operator (`,`).

That's not easy to get your head around when explained in words, but here's an
example:

```xtlang
;; this is kindof tedious to write
'(c3 | | | | | d3 e3)

;; so instead we write
`(c3 ,@(nof 5 '|) d3 e3)

;; don't forget the @ (splicing) part; this is probably not what you want...
`(c3 ,(nof 5 '|) d3 e3)

;; result: (c3 (| | | | |) d3 e3)
```

## modulating filter (or other) params over time

One way to do it is show in the example file
`examples/sharedsystem/analogue_synth_basics.xtm`. Have a look around line 39,
where it says:

```xtlang
;; and now add a second pattern to 'sweep' the filter
(:> B 4 0 (set_filter_env syn1 40.0 100.0 (trir 0.0 1.0 1/32) 100.0) (nof 16 0))
```

## playing a loop which then stops

The pattern language isn't really designed for playing one (or two, or three, or
_n_ for _n < ∞_) shot loops. It's really designed for things which will keep on
looping until you stop the pattern.

If you want to play a sequence of events which runs for a while and then stops,
then using a standard temporal recursion is probably best.

Here are a couple of examples. First, this recursion will keep playing the notes
until the `pitch` argument gets to `72`.

```xtlang
(define (ascending-chromatic beat dur pitch)
  (play syn1 pitch 80 dur)
  (if (< pitch 72)
      ;; note the `callback` is inside the `if`
      (callback (*metro* (+ beat (* .5 dur))) 'ascending-chromatic (+ beat dur) dur
                ;; pitch gets incremented by 1 in each subsequent callback
                (+ pitch 1))))

;; kick it off - note that we're passing the initial pitch argument
(ascending-chromatic (*metro* 'get-beat 4) 1/4 60)
```

Now, both the "increment" part `(+ pitch 1)` and the "stopping criteria" part
(i.e. the `(if (< pitch 72) ...`) are both just Scheme code, so it's very
flexible. You can handle those things however you like.

One other approach to doing this is a recursion approach straight out of the
functional programming handbook[^little-schemer], just with a temporal twist.
The key idea: start with a list, recurring on the `cdr` (i.e. the tail of the
list) each time until it's empty, then stopping.

So, here's a way of playing a scale---ascending, then descending---then
stopping.

```xtlang
(define (ascending-descending-scale beat dur plist)
  ;; note the (car plist) since plist is a list, not a number
  (play syn1 (car plist) 80 dur)
  (if (not (null? plist))
      (callback (*metro* (+ beat (* .5 dur))) 'ascending-descending-scale (+ beat dur) dur
                (cdr plist))))

(ascending-descending-scale (*metro* 'get-beat 4) 1/4
                            '(60 62 64 65 67 69 71 72 71 69 67 65 64 62 60))
```

There are a couple of nice variations on this one:

- replace the `(cdr plist)` with `(rotate plist -1)` to make it cycle through
  the pitches, but then go back to the start (have a think about what `rotate`
  does to convince yourself that this works)

- you can re-trigger this temporal recursion several times, either with the same
  `plist`, or even with different `plist`s---since all the temporal callback
  chains will be independent they'll all just run nicely over the top of one
  another, which can lead to some interesting musical "layerings"

[^little-schemer]:
    that's not just an idiom, I'm actually thinking of a
    [specific book](https://mitpress.mit.edu/books/little-schemer-fourth-edition)

## multi-laptop Extempore clock sync

If you're jamming with another Extempore laptop musician, you often want to make
sure your tempos & metronomes sync up. One way to do this is to use the topclock
protocol (the name comes from [TOPLAP](https://toplap.org)). You'll need a
network connection between all the machines---wired is best if you can manage
it, or at least on a private-ish wifi LAN (you'll probably have a bad time
trying to do it over _ANU Secure_).

There's an example in `examples/core/topclock_metro.xtm` which will show you the
details.

The alternative (manual) way to sync up two laptops is to:

1. make sure you're both using the same tempo:

   ```xtlang
   (*metro* 'set-tempo 140) ;; or whatever tempo you like
   ```

2. both starting "playing time", i.e. something simple which is easy to listen
   to and feel the tempo

3. listening carefully, try and figure out if you're
   [rushing or dragging](https://www.youtube.com/watch?v=ZQ_6VUs2VCk), and then
   executing the appropriate `*metro*` function call:

   ```xtlang
   ;; if you're rushing
   (*metro* 'pull)

   ;; if you're dragggin
   (*metro* 'push)
   ```

Pros with this approach: no network connection required, and it's usually not
too tricky to get the timing close enough to jam together. Cons: it's pretty
manual (and requires some careful listening, which is a skill that takes time to
master), and it also doesn't help with getting the exact beat clock synced up
(so that you'll still have to be careful that e.g. your 4-beat bars line up, and
you may have to keep fiddling with some offsets to make it all work).

## Selecting the correct audio device

We discussed this during the demo day class, but you should visit the
[doco website](https://extemporelang.github.io/docs/overview/quickstart/#no-sound-check-your-audio-device)
to see how to do it. The tip about using `--device-name` instead of `--device`
is particularly good advice when you're trying to bump in quickly in a gig
situation.

## Audio underflow: are you pushing extempore too hard?

The sharedsystem is actually kindof heavyweight[^cpu-requirements] (or at least
medium-weight) from a CPU use perspective. It loads up 4 analogue synths and a
sampler, plus some FX (e.g. global convolution reverb) and tries to distribute
them across multiple cores on your machine.

[^cpu-requirements]:
    I mean, it's still supposed to work on a half-decent laptop---it shouldn't
    require a real beast---but if you're on a particularly old/wheezy machine
    then even with the below tricks the sharedsystem might not be a good choice.
    The other examples (e.g. `examples/core/fmsynth.xtm`) show how to create a
    lighter-weight DSP chain, and from there you could add only the instruments
    & effects that you need.

If you're getting lots of "audio underflow" messages, you've got a few options,
in order of easiest fixes to most difficult:

1. don't run any other software on your machine that you don't absolutely need
   for the gig

2. try starting Extempore with a larger frame size (e.g.
   `./extempore --frames 8192`)

3. if you don't need MIDI I/O, just load
   `(sys:load "examples/sharedsystem/audiosetup.xtm")` instead of
   `(sys:load "examples/sharedsystem/setup.xtm")`

4. remove some of the `dspN` (for `N` = 1..5) functions from the signal chain in
   `examples/sharedsystem/audiosetup.xtm` (e.g. if you're only using `syn1` and
   `syn2` you could remove `dsp3` from the signal chain, which uses `dspmt` as
   the final output sink)

5. get your hands on a beefier laptop (not an option for many people, obviously)

If you go with option #4, remember that you can create a new copy of
`audiosetup.xtm` and modify it to your heart's content. Even if you've just been
messing with the original `audiosetup.xtm` file directly, remember that you can
get a "pristine" version at any time from
[GitHub](https://github.com/digego/extempore/blob/master/examples/sharedsystem/audiosetup.xtm).

## Creating a "startup" file

`sys:load` can load any file on your computer (even files outside your
`extempore` directory if you provide a full path). So it's a good idea to put
_everything_ required to set up your Extempore session into one file, then you
can just load that file with e.g.

```xtlang
(sys:load "/Users/ben/Documents/research/extemporelang/xtm/sessions/lens-2021-demo/setup.xtm")
```

and then once that's loaded you're good to go.

Extra tip: also memorise a line of code that you can quickly type & execute to
check if there's sound coming out.
