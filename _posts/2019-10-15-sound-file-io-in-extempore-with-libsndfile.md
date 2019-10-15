---
title: Sound file I/O in Extempore with libsndfile
tags: extempore
published: false
---

[libsndfile](https://github.com/erikd/libsndfile/) is "a C library for reading
and writing files containing sampled audio data", and it's pretty great. Here's
a quick crash-course on using [Extempore's libsndfile
bindings](https://github.com/digego/extempore/blob/master/libs/external/sndfile.xtm)
to read, process and write audio data from/to file.

{:.hl-para}

There have been some recent bugfixes in `libsndfile`, and (even more recently)
these have made it into Extempore, which builds it's own `libsndfile` shared
library as part of the CMake build process. So if you want to try this stuff
it's probably best that you've built the latest Extempore from `HEAD`.

## Loading the xtlang wrappers for the sndfile library functions

Once you've got Extempore up and running, the first thing to do is to load the
libsndfile wrapper functions in `libs/external/sndfile.xtm`.

``` extempore
(sys:load "libs/external/sndfile.xtm")
```

If you look through that file, you'll notice that it contains `bind-lib`
definitions for all the functions in the sndfile library (have a look at the [C
header](https://github.com/erikd/libsndfile/blob/master/src/sndfile.h.in) to see
for yourself).

In this example code we're going to be running "thin" xtlang code---calling the
C functions directly wherever possible, and using the same basic types as the
underlying C library. You could easily write xtlang helper functions to make all
this stuff nicer (from a developer perspective) but this is just the bare-bones
way, and it _is_ helpful (I hope) for understanding what's going on.

## Reading the audio file data into memory

## Writing data in memory to an audio file



[c-xtlang-interop]: 
    There's more detail on how this works in the
	[Extempore
    docs](https://extemporelang.github.io/docs/reference/c-xtlang-interop/)
	if you're interested.
