---
title: "Sound file I/O in Extempore with libsndfile"
tags:
  - extempore
---

[libsndfile](https://github.com/erikd/libsndfile/) is "a C library for reading
and writing files containing sampled audio data", and it's pretty great. Here's
a quick crash-course on using [Extempore's libsndfile
bindings](https://github.com/digego/extempore/blob/master/libs/external/sndfile.xtm)
to read, process and write audio data files.

## Loading the xtlang wrappers for the sndfile library functions

Once you've got Extempore up and running, the first thing to do is to load the
libsndfile wrapper functions:

``` xtlang
(sys:load "libs/external/sndfile.xtm")
```

`libs/external/sndlib.xtm` contains `bind-lib` definitions for all[^pm-all] the
functions in the libsndfile library (compare that file to the [C
header](https://github.com/erikd/libsndfile/blob/master/src/sndfile.h.in) to see
for yourself).

[^pm-all]: well, _pretty much_ all

In this blog post I'm mostly going to write "thin" xtlang code---calling the C
functions directly wherever possible, and using the same basic types as the
underlying C library. You could easily write xtlang helper functions to make all
this stuff nicer, and `libs/external/sndfile.xtm` actually has a bunch of these
as well (down the bottom of that file). However, I hope this bare-bones approach
is helpful for understanding what's going on (and how you might use other C
shared libs if you wanted to).

## Reading the audio file data into memory

In a fairly common API design pattern, to get info about a sound file (length, channels,
sample rate, format, etc.) we need to:

1. use `sf_open` to give us a pointer to the data structure which libsndfile
   uses to represent the audio file (a `SNDFILE*`)

2. pass a pointer to another data structure (a `SF_INFO*`) which `sf_open` will
   populate with info about the file

`sf_open` doesn't read the audio data into memory (where we can do stuff with
it) though---because first we need to figure out how big a buffer to allocate
for the data---and to do that, we need to know how many frames there are in the
audio file, and how many channels per frame.

Looking at the documentation (i.e. the comment above the function declaration in
the C header file) for `SF_INFO` we see that the first (tuple index `0`) and third
(tuple index `2`) fields are going to be useful

``` c
struct SF_INFO
{   sf_count_t  frames ;        /* Used to be called samples.  Changed to avoid confusion. */
    int         samplerate ;
    int         channels ;
    int         format ;
    int         sections ;
    int         seekable ;
} ;
```

Using all this info, then, we can make a simple xtlang function to return the
number of frames

``` xtlang
(bind-func get_number_of_frames
  (lambda (filename)
    (let ((info:SF_INFO* (salloc))
          ;; call sf_info to populate info with data about the file
          (sfile (sf_open filename SFM_READ info)))
      (sf_close sfile)
      ;; return the number of frames
      (tref info 0))))

;; test it out using a wave file from the Extempore assets directory
;; (it should return the number 288366)
(get_number_of_frames "assets/samples/piano/60.wav")
```

::: tip
Most of the code in this post doesn't check for e.g. bad filenames or other
potential errors, so if that's a thing which might happen in your situation then
you'll need to check that `sf_open` doesn't return `null`.
:::

We can do the exact same thing to get the number of channels per frame (just
returning a different element of the `info` struct):

``` xtlang
(bind-func get_number_of_channels
  (lambda (filename)
    (let ((info:SF_INFO* (salloc))
          (sfile (sf_open filename SFM_READ info)))
      (sf_close sfile)
      ;; return the number of channels
      (tref info 2))))

;; returns 2 (it's a stereo file)
(get_number_of_channels "assets/samples/piano/60.wav")
```

Finally, we can calculate how many samples (num frames × num channels) we'll
need in our "audio data" buffer. We can then use `sf_read` to read the audio
data from the file into our buffer, converting it to e.g. `float` (or whatever
the type of `SAMPLE` is) as we go (libsndfile can read audio files in a bunch of
different formats, but for working with it in Extempore we just want floating
point values).

First, set up a DSP callback---just playing white noise so that we can check
that it's working.

``` xtlang
(bind-func dsp:DSP
  (lambda (in time chan dat)
    (random .1)))

(dsp:set! dsp)
```

Now, we add a bunch of sndfile-related stuff to the top-level `dsp` closure
environment (the outer `let`) to

1. get the number of frames/channels from the file
2. allocate a `SAMPLE`[^sample] buffer big enough to fit all the audio data
3. read the audio file data into this buffer

Finally, in the inner `lambda` we have a super-naive playback loop (look at the
way we're incrementing `i`---this will only work if the number of output
channels matches the number of channels in the audio file).

[^sample]: `SAMPLE` is an alias for `float` by default

``` xtlang
(bind-func dsp:DSP 10000000 ;; allocate plenty of memory for our DSP closure

  (let ((filename "assets/samples/piano/60.wav")
        (nframes (get_number_of_frames filename))
        (nchan (convert (get_number_of_channels filename)))
        (nsamp (* nframes nchan))
        (info:SF_INFO* (alloc))
        (sfile (sf_open filename SFM_READ info)) ;; SFM_READ = open the audio file in "read-only" mode
        ;; here's the pointer to the audio data
        (data:SAMPLE* (alloc nsamp))
        (i 0))

    (println "read" (sf_read sfile data nsamp) "frames")
    (sf_close sfile)

    (lambda (in time chan dat)
      ;; a super-naive "playback" loop
      (set! i (% (+ i 1) nsamp))
      (* .2 (pref data i)))))
```

If it's all worked, you should hear a piano playing repeated (legato) notes on
middle C.

Of course, we could have simplified this by just calling `sf_open` and
populating the `info` with data once at the top of an xtlang function, then
doing stuff based on that information and finally `sf_close`ing the file at the
end. That's left as an exercise for the reader 😉

::: tip
One thing worth noting with all this is that calling a C lib from Extempore
doesn't obviate the need to understand how the C library works, e.g. we still
need to match every call to `sf_open` with a call to `sf_close` as stated in the
libsndfile docs.
:::

## Writing data in memory to an audio file

There's one more thing we want to do with our libsndfile library: write a bunch
of audio data (which we've gloriously munged in Extempore) and write it back to
an audio file.

Here's a simple munging function which will replace the first `22050` samples
with white noise, then leave the next `22050` untouched, then replace the next
`22050` with more white noise, and so on. I'm sure you can come up with
something more (sonically) interesting; this is just an easy one to test (by
ear) if it's working.

``` xtlang
(bind-func munge_audio_data
  (lambda (data:SAMPLE* nsamp)
    (doloop (i nsamp)
      (if (< (modulo i 44100) 22050)
          (pset! data i (random .1))))))
```

The final thing to do is to create _another_ `SNDFILE` object (this time opened
in `SFM_WRITE` mode) where we'll write the audio data. We'll make some small
additions to our `dsp` closure:

``` xtlang
(bind-func dsp:DSP 10000000 ;; allocate plenty of memory for our DSP closure

  (let ((filename "assets/samples/piano/60.wav")
        (nframes (get_number_of_frames filename))
        (nchan (convert (get_number_of_channels filename)))
        (nsamp (* nframes nchan))
        (info:SF_INFO* (alloc))
        (srcfile (sf_open filename SFM_READ info))
        (dstfile (sf_open  "assets/samples/piano/60-munged.wav" SFM_WRITE info))
        ;; here's the pointer to the audio data
        (data:SAMPLE* (alloc nsamp))
        (i 0))

    (println "read" (sf_read srcfile data nsamp) "frames")
    (sf_close srcfile)

    ;; munge the audio data
    (munge_audio_data data nsamp)

    (println "wrote" (sf_write dstfile data nsamp) "frames")
    (sf_close dstfile)

    (lambda (in time chan dat)
      ;; a super-naive "playback" loop
      (set! i (% (+ i 1) nsamp))
      (* .2 (pref data i)))))
```

If you re-evaluate _that_ `dsp` closure, you should (a) hear the munged audio
and (b) it should have been written to the "assets/samples/piano/60-munged.wav"
file. Note that we re-used the `info` data structure (which was populated with
the info from `srcfile`) in the `dstfile` call---this is deliberate, and makes
sure that we use the same file format for the output file as for the input file.
If you want to write it in some _other_ format, then look at the libsndfile
docs---there are lots of options.

## Wrapping up

There's lots more to explore, but I'll leave it here for now. If you've got any
comments, then get in touch on the [Extempore mailing
list](mailto:extemporelang@googlegroups.com).

[c-xtlang-interop]:
    There's more detail on how this works in the
    [Extempore
    docs](https://extemporelang.github.io/docs/reference/c-xtlang-interop/)
    if you're interested.
