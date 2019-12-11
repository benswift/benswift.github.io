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
   Windows/Linux or **cmd+Shift+P** on macOS. {% include assets/picture.html
   file="images/xinyu-tutorials/TO3.png" alt="the command palette" %}

6.  Type **Extempore Connect** in the opening command palette, the default host
    and port arguments will be `localhost` and `7099` respectively.

{:.hl-para}

**To evaluate Extempore code**: move the cursor into the code you want to
evaluate and hit **cmd+enter** on macOS or **ctrl+enter** on Windows/Linux.

What you might see in the terminal window when you evaluate extempore code:

{% include assets/picture.html file="images/xinyu-tutorials/TO4.png" alt="Extempore log view" %}

> Note: you can use **ctrl+c** in the terminal where extempore is running to kill the extempore process whenever you want.

## Tutorial One

### Predict and Run

Work in pairs or small groups, look at the code below and predict what does this code do:

```xtlang
(bind-val my-pi float 3.1415)
```

> Note: in Extempore, we generally use **kebab-case** case style `my-pi` instead of using **camelCase** `myPi` or **PascalCase** `MyPi`or **snake_case** `my_pi`.

Run the code above. Does the compiler print anything in the log? What does the printed message mean?

{% include assets/picture.html file="images/xinyu-tutorials/my-pi.png" alt="my-pi log view" %}

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

> Note: you can add [comments](https://en.wikipedia.org/wiki/Comment_(computer_programming)) (starting with **;;**) to the program to make some notes for you to understand the code. The comments are generally ignored by compilers and interpreters.

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
> You could use `(random 440.0 700.0)` to randomly generate a value between 440.0 and 700.0

Compare to the `(random)` in the white noise part above, does the `(random)` work differently here? Can you explain how `(random)` can be either for "control" (e.g. see the above sine wave part) or for "signal" (e.g. see the white noise part)?

## Tutorial Two

### Predict and Run

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
```

> Note: The dsp function takes as input:
> - **in**: the input audio sample, e.g. from the microphone.
> - **time**: an `i64` representing the time.
> - **chan**: another `i64` which represents the channel index (0 for L, 1 for R, etc.). Extempore can handle any number of channels.
> - **data**: this is a pointer to a `SAMPLE` type (which is float by default), and can be used to pass arbitrary data into the dsp function.

Think about what is the `i64` type in the above Note?

> Primitive types in Extempore:
>
> Integers: 
> - `i1`:  (boolean) uses 1 bit.
> - `i8`:  (char) uses 8 bits (1 byte), which could store 2^8 = 256 unique integer values, -128 ~ 127.
> - `i32`: uses 32 bits, which could store 2^32 uniquew integer values, -2^31 ~ (2^31 - 1).
> - `i64`: (default) uses 64 bits, which could store 2^63 uniquew integer values, -2^63 ~ (2^63 - 1).
>
> Floats:
> - `float`:     a single precision (32 bit) floating-point data type.
> - `double`:    (default), a double precision (64 bit) floating-point data type.

> Moreover, for your interests:
>
> [Pointer](https://en.wikipedia.org/wiki/Pointer_(computer_programming)) types:
> - `double*`: a pointer to a double.
> - `i64*`: a pointer to a 64-bit integer.
> - `i64**`: a pointer to a pointer to a 64-bit integer.

Now, we could play a note by using the fmsynth instrument that we just defined:

```xtlang
;; play a note on our fmsynth
(play-note (now) fmsynth (random 60 80) 80 *second*)
```
> Note: the parameters for `play-note` are `play-note <start-time> <instrument> <note-frequency> <note-duration>`

What would happend if you play the note for the second time (or multiple times)? Why is the note different?

It's the time to make a loop in Extempore:

```xtlang
;; make a loop
(define my-loop
  (lambda (time)
    (play-note time fmsynth (random 60 80) 80 *second*)
    (callback (+ time *second*) 'my-loop (+ time *second*))))

(my-loop (now))
```

We make a `loop` function above, but how does the `loop` work? let's see a simpler example:

```xtlang
;; let's see a simpler loop example
(define test-loop
 (lambda ()
   (println "I'm looping...")
   (callback (+ (now) 10000 *second*) 'test-loop ()))
)

(test-loop())
```

> Note: the parameters for `callback` are `callback <time> <func> <args>`

Can you predict what will happen when you run the `test-loop` function? Run the code to check your thoughts.

> Note: do not forget to check your terminal panel.

### Investigate

Work in pairs or in small groups, work out the answers to the following questions:

1. What does `my-loop` do?
2. What does the `callback` in the loop do?
3. What is the difference between Scheme lambda expression and xtlang bind-func expression? More information click [here](https://digego.github.io/extempore/scheme-xtlang-interop.html).
4. What is the difference between using **now** versus using **time**?  More information click [here](https://digego.github.io/extempore/time.html).

> Note: you can add [comments](https://en.wikipedia.org/wiki/Comment_(computer_programming)) (starting with `;;`) to the program to make some notes for you to understand the code.

### Modify

Work in pairs or in small groups, can you modify the above code and make a loop with random notes lengths and random notes frequencies.

```xtlang
;; hint
;; make a loop with random note length and random note
(define diff-length
  (lambda (time)
    (let ((note-length (random '(0.5 1.0 1.5 2.0)))
          (pitch (random '(60 63 65 68 70 73 75 78 80))))
        (play-note time fmsynth pitch 80 (* *second* note-length))
        (callback (+ time (* note-length *second*)) 'diff-length (+ time (* note-length *second*)))))))

(diff-length (now))
```

### Make

Can you make a chord (or play different notes at the same time) function by using similar ideas to the previous program?

## Tutorial Three

### Predict and Run

```xtlang
;; loop major scale
(let loop-white-keys((scale '(0 2 4 5 7 9 11 12 14 16 17 19 21 23))
           (time 0))
  (play-note (+ (now) time) synth (+ 60 (car scale)) 80 4000)
  (if (not (null? (cdr scale)))
      (loop-white-keys (cdr scale) (+ time 10000))))
      
;; another loop for notes
(let loop-black-keys ((scale '(1 3 6 8 10 13 15 18 20 22))
           (time 0))
  (play-note (+ (now) time) synth (+ 60 (car scale)) 80 4000)
  (if (not (null? (cdr scale)))
      (loop-black-keys (cdr scale) (+ time 10000))))
```

> Note:
> - `car` return the first element of a list.
> - `cdr` return the rest of the elements in a list, that is, it returns the part of the list that follows the first item.
> - `if <test> <consequent> <alternate>`
> - [more conditionals syntax](https://www.cs.cmu.edu/Groups/AI/html/r4rs/r4rs_6.html).

> Note: the syntax for `let` is: `let <variable> <bindings> <body>`

> Note: in the above examples, we used the named `let`. Therefore, the `<body>` could be repeatly executed by invoking the `let` procedure named by the `<variable>`.

Can you predict what will happen? Then run the code to check your thoughts.

Before you run the code above, do not forget to load the libraries, define and add an instrument `synth` to the `dsp` output sink closure:

```xtlang
;; load the instruments file
(sys:load "libs/core/instruments.xtm")
(sys:load "libs/core/pc_ivl.xtm")

;; define a synth using the provided components
(make-instrument synth fmsynth)

;; add the instrument to the DSP output sink closure
(bind-func dsp:DSP
  (lambda (in time chan dat)
    (synth in time chan dat)))

(dsp:set! dsp)
```
Now, Let's play a chord on a list of frequencies! Can you predict what will happen here:

```xtlang
;; play a chord
(map (lambda (p)
       (play-note (now) synth p 80 44100))
     (list 72 76 79))
```
> Note: again, the parameters for `lambda` is: `lambda <formals> <body>`

> Note: here we have two methods to express a `list`: For example, `(list 72 76 79)` and `'(72 76 79)`.

Can you guess what does `map` do?

Here is another method to play the same chord that we ran above:

```xtlang
;; another method for play the same chord
(define play-a-chord
  (lambda (time chord)
    (for-each (lambda (p)
                (play-note time synth p 80 44100))
              chord)
    ))
    
(play-a-chord (now) '(72 76 79))
```

Can you guess what will happen after running `play-a-chord`?

How about more chords? 

```xtlang
;; markov chord progression
(define my-progression
  (lambda (time chords)
    (play-a-chord time (car chords))
    (define loop-chords '())
    (if (not (null? (cdr chords)))
        (set! loop-chords (cdr chords))
        (set! loop-chords '((72 76 79)(69 72 76)(65 69 72)(67 71 74))))
    (callback (+ time 40000) 'my-progression (+ time 44100) loop-chords))
  )

(my-progression (now) '((72 76 79)(69 72 76)(65 69 72)(67 71 74)))
```
> Note: the syntax for `set!` is `set! <variable> <expression>`, which could assign the `<expression>` to the `<variable>`

Run the code. Dose it work as you predicted?

### Investigate

Work in pairs or in small groups, work out the answers to the following questions:

1. Currently, you have already seen `let`, `define` and `set!`. What are the differences between `let`, `define` and `set!`? E.g:
	- `set!` doesn't define the variable, rather it is used to assign the variable a new value.
	- The scope of variables defined by `let` are bound to the latter.
	`define` doesn't surround the body with parentheses.

2. Here is another method to play the same chord that we predicted and ran before:

```xtlang
;; another method for play the same chord
(define play-a-chord
  (lambda (time chord)
    (for-each (lambda (p)
                (play-note time synth p 80 44100))
              chord)
    ))
    
(play-a-chord (now) '(72 76 79))
```
Compare to the ```map``` one, can you find what is the difference between ```map``` and ```for-each```?	
- Evaluation order?  
- Return?

3. We could use `do` to make a loop on playing the chord with the above `play-a-chord` method:

```xtlang
;; use do to loop the chord
(do ((i 0 (+ i 1)))
    ((> i 3000) ())
    (play-a-chord (now) '(72 76 79)))
```
Compare to other `loop` or other iteration methods, can you find how does the `do` work here?

> Hint: the syntax of `do` is: 
```xtlang
(do ((<variable1> <init1> <step1>) ...)
    (<test> <expression> ...)
    <command> ...)
```
> - if the `<test>` result is `false`, then the sequence of `<command>` would be evaluated.
> - if the `<test>` result is `true`, the sequence of `<expression>` would be evaluated from left to right, and the last `<expression>`'s values would be returned at the end.
> - the [boolean data type](https://en.wikipedia.org/wiki/Boolean_data_type) for understanding `true` and `false`.
	
### Modify

Now, can you please modify the `my-progression` function so that it could loop each chord for four times before going to the next chord?

```xtlang
;; hint
;; modified my-progression
(define my-progression-modify
  (lambda (time chords n)
    
    (let loop ((loop-times 0))
      (if (= loop-times n)
          (display "stopped")
          (begin (play-a-chord (+ time (* loop-times 44100)) (car chords))
            (loop (+ loop-times 1)))))
    ; (loop-n-times n (play-a-chord time (car chords)))
    
    (define loop-chords-modify '())
    (if (not (null? (cdr chords)))
        (set! loop-chords-modify (cdr chords))
        (set! loop-chords-modify '((72 76 79)(69 72 76)(65 69 72)(67 71 74))))
    
    (callback (+ time (* n 40000)) 'my-progression-modify (+ time (* n 44100)) loop-chords-modify n))
  )
  
(my-progression-modify (now) '((72 76 79)(69 72 76)(65 69 72)(67 71 74)) 4)
```

> Note: here we used the `begin` to do the sequencing: `begin <expression 1> <expression 2> ...<expression n>`
> - the sequence of `<expression i>` will be evaluated sequentially from left to right.
> - `begin` will return the value of the last `<expression n>`.

### Make

1. Based on the previous code, can you make some creative melody by yourself?
2. Can you play your melody and the chords at the same time?

## Tutorial Four

### Predict and Run

In this tutorial, we will learn how to do samplers in Extempore. Extempore provides a built-in sampler in `libs/external/instruments_ext.xtm`, so let's load the libraries first:

```xtlang
;; load the libs
(sys:load "libs/external/instruments_ext.xtm")
(sys:load "libs/core/instruments.xtm")
```

We are going to create a drum sampler, can you guess what is happening here:

```xtlang
;; TODO
;; Set/Change the path of the subdirectory “OH” in your code.
;; In my computer it’s like:
(define drum-path "/Users/apple/Downloads/COMP3740/salamanderDrumkit/OH/")

;; Load some wave files into drums sampler:
(set-sampler-index drums (string-append drum-path "kick_OH_F_9.wav") *gm-kick* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "snareStick_OH_F_9.wav") *gm-side-stick* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "snare_OH_FF_9.wav") *gm-snare* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "hihatClosed_OH_F_20.wav") *gm-closed-hi-hat* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "hihatFoot_OH_MP_12.wav") *gm-pedal-hi-hat* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "hihatOpen_OH_FF_6.wav") *gm-open-hi-hat* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "loTom_OH_FF_8.wav") *gm-low-floor-tom* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "hiTom_OH_FF_9.wav") *gm-hi-floor-tom* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "crash1_OH_FF_6.wav") *gm-crash* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "ride1_OH_FF_4.wav") *gm-ride* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "china1_OH_FF_8.wav") *gm-chinese* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "cowbell_FF_9.wav") *gm-cowbell* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "bellchime_F_3.wav") *gm-open-triangle* 0 0 0 1)
(set-sampler-index drums (string-append drum-path "ride1Bell_OH_F_6.wav") *gm-ride-bell* 0 0 0 1)

```
Let's look at the first row of `set-sampler-index`. Can you guess why do we need `*gm-kick*`? What does `string-append drum-path "kick_OH_F_9.wav"` do?

> Note: How to load samples (you can also find more information from [github]( https://digego.github.io/extempore/sampler.html)).
> 1.	Download the instrument samples from [Salamader Drumkit](https://archive.org/download/SalamanderDrumkit/salamanderDrumkit.tar.bz2).
> 2.	Unzip the samples and put them wherever you like on your computer.
> 3.	Set/Change the path of the subdirectory "OH" in your code. In my computer it’s like:   `define drum-path "/Users/apple/Downloads/COMP3740/salamanderDrumkit/OH/"`.


Before you run the code, do not forget to define and add an instrument `drums` to the `dsp` output sink closure, and set the `dsp` as well:

```xtlang
;; define a sampler (called drums) using the default sampler note kernel and effects
(make-instrument drums sampler)
;; define a synth using the provided components
(make-instrument synth fmsynth)

;; add the sampler to the dsp output callback
(bind-func dsp:DSP
  (lambda (in time chan dat)
    (+ (synth in time chan dat)
       (drums in time chan dat))))

(dsp:set! dsp)
```

Sounds could be played by calling the below instructions, the similar things as we did before:

```xtlang
;; evaluate
(play-note (now) drums *gm-open-triangle* 80 44100)
(play-note (now) drums *gm-snare* 80 44100)
(play-note (now) drums *gm-closed-hi-hat* 80 44100)
```

Can you predict what will happen after you run above three lines respectively? Then run the code to check your thoughts.

---

Now, a cool thing we will do is to define a `metronome` to evenly distribute our beats with respect to tempo changes.

Can you predict what is happening here?

```xtlang
;; create a metronome starting at 120 bpm
(define *metro1* (make-metro 120))

;; beat loop along the metronome
(define drum-loop
  (lambda (time duration drum)
    (println time duration)
    (play-note (*metro1* time) drums drum 80 (*metro1* 'dur duration))
    (callback (*metro1* (+ time (* .5 duration))) 'drum-loop (+ time duration)
              duration drum)))

(drum-loop (*metro1* 'get-beat) 1 *gm-hi-floor-tom*)
```

Let's define another metronome `metronome2`:

```xtlang
;; create another metronome starting at 120 bpm
(define *metro2* (make-metro 120))
```
Can you guess what will happen after you evaluate this `drum-loop-tempo-shift`? What does `println` will do?

```xtlang
;; set tempo shift
(define drum-loop-tempo-shift
  (lambda (time duration drum)
    (*metro2* 'set-tempo (+ 20 (* 6. (cos (modulo time 9)))))
    (println (+ 20 (* 6. (cos (modulo time 9)))))
    (play-note (*metro2* time) drums drum 80 (*metro2* 'dur duration))
    (callback (*metro2* (+ time (* .5 duration))) 'drum-loop-tempo-shift (+ time duration)
              (random (list 0.5)) drum)))

(drum-loop-tempo-shift (*metro2* 'get-beat) 0.5 *gm-cowbell*)
```

> Note: `println` calls the polymorphic function `print` for each supplied argument, but `println` automatically provides both spaces and a carriage return.

Run the code. Did it work as you predicted?

### Investigate

Work in pairs or in small groups, work out the answers to the following questions:

1. What does the function `make-metro` do?
2. What does `*metro* 'get-beat` do?
3. What does `*metro* 'dur` do?
4. What does `*metro* set-tempo` do?
	
### Modify

Work in pairs or in small groups, work out the answers to the following questions:

1. Can you load the piano samples as well? ([Salamander piano](http://download.linuxaudio.org/lau/SalamanderGrandPianoV2/SalamanderGrandPianoV2_44.1khz16bit.tar.bz2)).
2. Can you pay multiple drums with different tempo at the same time?

```xtlang
;;hint
(drum-loop (*metro1* 'get-beat) 1 *gm-hi-floor-tom*)
(drum-loop (*metro1* 'get-beat) 0.3 *gm-open-triangle* )
```

### Make

Combine the knowledge that you learned before. Now you can use drums, synth, piano and metronome to create your own music.

## Going further

As well as the [Extempore documentation
website](https://extemporelang.github.io), the best place to start messing
around is with more examples: e.g. the `examples/core/fmsynth.xtm` file in your
Extempore folder.
