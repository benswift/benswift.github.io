---
title: Xinyu's Extempore tutorials
tags: livecoding extempore
---

These tutorials are part of Xinyu Hou's research project to create a set of
[PRIMM](https://blogs.kcl.ac.uk/cser/2017/09/01/primm-a-structured-approach-to-teaching-programming/)-style
tutorials for learning to make sound/music in Extempore.

They're currently a work-in-progress---when they're done they'll be hosted on
the main Extempore docs site, but for now they're here on my blog.

{% include toc.html %}

## Preliminaries

### Setting Up Environment

#### Installing Extempore

Install Extempore by following the steps [here](https://extemporelang.github.io/docs/overview/install/).

#### Installing VSCode

Install VSCode (a text editor) by following the steps [here](https://extemporelang.github.io/docs/overview/editor-support/).

{:.hl-para}

Note: if you want to use a different text editor, [there are other options as
well](https://extemporelang.github.io/docs/overview/editor-support/).

### Evaluating Extempore Code

Evaluate the extempore code on VSCode by following the steps below:

1. Start VSCode

2. Go to **File** -> **Open**, then open your Extempore directory.

3. In the VSCode built-in terminal window (**ctrl+\`**) move into the extempore
   directory, and start extempore (type `./extempore` and hit return).

4. Open or create an Extempore file (**.xtm** file)

5. Connect to the Extempore process: you can do this in VSCode through the
   “**command palette**”, which can be brought up with **ctrl+Shift+P** on
   Windows/Linux or **cmd+Shift+P** on macOS. {% asset
   images/xinyu-tutorials/TO3.png @pic alt="the command palette" %}

6.  Type **Extempore Connect** in the opening command palette, the default host
    and port arguments will be `localhost` and `7099` respectively.

{:.hl-para}

**To evaluate Extempore code**: move the cursor into the code you want to
evaluate and hit **cmd+enter** on macOS or **ctrl+enter** on Windows/Linux.

What you might see in the terminal window when you evaluate extempore code:

{% asset images/xinyu-tutorials/TO4.png @pic alt="Extempore log view" %}

> Note: you can use **ctrl+c** in the terminal where extempore is running to kill the extempore process whenever you want.

## Tutorial One

### Predict and Run

Work in pairs or small groups, look at the code below and predict what does this code do:

```xtlang
(bind-val my-pi float 3.1415)
```

> Note: in Extempore, we generally use **kebab-case** case style `my-pi` instead of using **camelCase** `myPi` or **PascalCase** `MyPi`or **snake_case** `my_pi`.

Run the code above. Does the compiler print anything in the log? What does the printed message mean?

{% asset images/xinyu-tutorials/my-pi.png @pic alt="my-pi log view" %}

Now, it's time to produce a sound in Extempore!

Work in pairs or small groups again, look at the code below and predict/guess what might happen when it runs:

```xtlang
(bind-func dsp:DSP
  (lambda (in time chan dat)
    (let ((amplitude 0.1)
          (frequency 440.0)
          (two-pi (* 2.0 my-pi)))
      (* amplitude
         (sin (/ (* frequency
                    two-pi
                    (convert time)) SRf))))))

(dsp:set! dsp)
```

Does it work as predicted?

> Hint:
> we set up the xtlang callback:
> ```xtlang
> (bind-func dsp:DSP
>   (lambda (in time chan dat)
>     0.0))
> ```
> - **in:SAMPLE**
> sample from input device
> - **time:i64**
> sample number
> - **chan:i64**
> audio channel
> - **dat:SAMPLE**
> user data
> - **`<return>`:SAMPLE**
> sample at given channel and time
> - sample value range from -1.0 to 1.0
>
> Note: In Extempore, we represent the mathematical operation *2 * PI* as `(* 2 PI)`
>
> Note: `SRf` refers to the current sampling frequency
>
> Note: The form of a `let` statement is as follows:
> `(let ((var_name_1 var_value_1) ... (var_n val_n)) (<body>))`
>
> Note: `convert` allows us to make a `SAMPLE` typed value from `time`.
>
> Note: We only can set `dsp` function once, but then redefine it as many times as we want.

What about white noise in Extempore?

```xtlang
(bind-func dsp:DSP
  (lambda (in time chan data)
    (* 0.2 (random))))
```

Can you explain what happened here?

### Investigate

Work in pairs or in small groups, work out the answers to the following questions:
1. In what order did you compile (execute) the code in this program?
2. What happened after you evaluated each "chunk" of Extempore code?
3. Can you guess what would happen if you compile the code in a different order?

> Note: you can add comments (starting with **;;**) to the program to make some notes for you to understand the code. The comments are generally ignored by compilers and interpreters.

### Modify

1. Can you play a sound with a frequency of 460.0?
2. Can you make the sound louder by just changing the code? (don't use your volume buttons!)

### Make

Now, let’s move `amplitude`, `frequency` and `two-pi` outside of lambda to make our `dsp` function controllable outside as below:

```xtlang
(bind-func dsp:DSP
  (let ((amplitude 0.1)
        (frequency 440.0)
        (two-pi (* 2.0 my-pi)))
    (lambda (in time chan dat)
      (* amplitude
         (sin (/ (* frequency
                    two-pi
                    (convert time)) SRf))))))
```

Can you play a random frequency sound every time when you redefine the `dsp` function?
> Note:
> - You could use `(random 440.0 700.0)` to randomly generate a value between 440.0 and 700.0

Compare to the `(random)` in the white noise part above, does the `(random)` work differently here? Can you explain how `(random)` can be either for "control" (e.g. see the above sine wave part) or for "signal" (e.g. see the white noise part)?

## Tutorial Two

### Predict

Work in pairs or small groups, look at the code below and predict what might happen when it runs.

```xtlang
;; load the instruments file
(sys:load "libs/core/instruments.xtm")

;; define an fmsynth using the built-in components
(make-instrument fmsynth fmsynth)

;; add the instrument to the DSP output sink closure
(bind-func dsp:DSP
  (lambda (in time chan dat)
    (fmsynth in time chan dat)))

(dsp:set! dsp)

;; play a note on our fmsynth
(play-note (now) fmsynth (random 60 80) 80 *second*)

;; make a loop
(define my-loop
  (lambda (time)
    (play-note time fmsynth (random 60 80) 80 *second*)
    (callback (+ time *second*) 'my-loop (+ time *second*))))

(my-loop (now))
```

> Note: The dsp function takes as input:
> - in: the input audio sample, e.g. from the microphone.
> - time: an i64 representing the time.
> - chan: another i64 which represents the channel index (0 for L, 1 for R, etc.). Extempore can handle any number of channels..
> - data: this is a pointer to a SAMPLE type (which is float by default), and can be used to pass arbitrary data into the dsp function.

### Run

Run the code. Dose it work as predicted?

### Investigate

Work in pairs or in small groups, work out the answers to the following questions:

1. What is the difference between Scheme lambda expression and xtlang bind-func expression? More information click [here](https://digego.github.io/extempore/scheme-xtlang-interop.html)
2. What is the difference between using **now** versus using **time**?  More information click [here](https://digego.github.io/extempore/time.html)

> Note: you can add comments (starting with `;;`) to the program to make some notes for you to understand the code.

### Modify

Work in pairs or in small groups, can you modify the above code and make a loop with random notes lengths and random notes frequencies.

```xtlang
;; hint
;; make a loop with random note length and random note
(define diff-length
  (lambda (time)
    (let ((note-length (random '(0.5 1.0 1.5 2.0))))
      (let ((pitch (random '(60 63 65 68 70 73 75 78 80))))
        (play-note time fmsynth pitch 80 (* *second* note-length))
        (callback (+ time (* note-length *second*)) 'diff-length (+ time (* note-length *second*)))))))

(diff-length (now))
```

### Make

Can you make a chord (or play different notes at the same time) function by using similar ideas to the previous program?

## Going further

As well as the [Extempore documentation
website](https://extemporelang.github.io), the best place to start messing
around is with more examples: e.g. the `examples/core/fmsynth.xtm` file in your
Extempore folder.
