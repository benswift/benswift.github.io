---
title: highlight.js with xtlang support
date: 2019-01-17 10:54 +1100
---

> It is a truth, universally acknowledged, that all programming language authors
> must also be expert web developers. &nbsp;&nbsp;&nbsp;**Jane Austen** *(probably)*

I've just spend a solid day wrestling with source code syntax highlighting on my
blog, and I've finally got it figured out. To wit:

```armasm
labelious:
  sub r0, 1
  bne doneski
  b labelious

doneski:
  nop
```

I know you've got questions, so the rest of this post will be structured as an
**FAQ**.

## FAQ

### Why did you even do that? It seemed to be working fine before.

Yes, well, it was mostly working fine. But I was just using an
off-the-shelf[^cdn] disribution of [highlight.js](https://highlightjs.org/),
which supported a bunch of languages, but not all the ones I need. Especially
Extempore, which is super-important for showing off my livecoding stuff on this
blog.

[^cdn]: well, off-the-CDN, anyway

### Does Extempore/xtlang have highlight.js support now?

Yep, [`@blue9`](https://github.com/cyblue9) ported the [Scheme/xtlang
lexer](https://bitbucket.org/birkenfeld/pygments-main/src/7941677dc77d4f2bf0bbd6140ade85a9454b8b80/pygments/lexers/lisp.py?at=default&fileviewer=file-view-default#lisp.py-2420)
that I wrote for Pygments, which is a *big* help to the Extempore community
(thanks `blue9`).

### Isn't it just a matter of adding `xtlang` to the highlight.js build step?

No, because [reasons](https://github.com/highlightjs/highlightjs-xtlang#usage).
It's a real mess, and we're waiting on [this
PR](https://github.com/highlightjs/highlight.js/pull/1888) to land before it
gets easier.

### How'd you get it working, then?

Hacks upon hacks. If you really wanna know, it's in [this
branch](https://github.com/benswift/benswift.github.io/tree/hljs-with-xtlang)
(although the final product, `highlight.pack.js` is in the main `source`
branch).

Basically, I backported the Extempore language support from the new "plugin" way
of doing things (which is better, but doesn't really work yet) to the old
"built-in" way of doing things, and then generated a new, custom build of
highlight.js which included both xtlang and all the other languages that I need
for my blog.

### So can I see some xtlang code, then?

Sure, here's an example function from
[`examples/core/extempore_lang.xtm`](https://github.com/digego/extempore/blob/master/examples/core/extempore_lang.xtm).

```xtlang
(bind-func my-test-7
  (lambda ()
    (let ((a:<i64,double>* (alloc)) ; returns pointer to type <i64,double>
          (b 37)
          (c 6.4))
      (tuple-set! a 0 b) ;; set i64 to 64
      (tset! a 1 c) ;; set double to 6.4 - tset! is an alias for tuple-set!
      (printf "tuple:1 %lld::%f\n" (tuple-ref a 0) (tref a 1))
      ;; we can fill a tuple in a single call by using tfill!
      (tfill! a 77 77.7)
      (printf "tuple:2 %lld::%f\n" (tuple-ref a 0) (tuple-ref a 1))
      (tuple-ref a 0)))) ;; return first element which is i64
```

### When will we get this syntax colouring goodness when viewing Extempore code on GitHub?

GitHub doesn't use highlight.js, it uses
[linguist](https://github.com/github/linguist) for this sort of thing. So
getting it working on GH would involve porting the language definitions to that
project as well.

### Will it always be this complicated to set up?

No, once the [aformentioned issue](https://github.com/highlightjs/highlight.js/pull/1888)
is sorted out, it should be much easier to get a "base" package of highlight.js
from the main download website/CDN, and then to add any extras (e.g.
Extempore/xtlang) as needed. But until that happens, shenanigans are required.

### What's with the Jane Austen quote above, then?

Figuring this all out required a lot of digging around in existing packages,
learning a new [node-based build system](https://www.npmjs.com/package/gear) and
a bunch of other things. I'm pretty capable with this sort of thing, so I got
there in the end. But it does make me a bit sad that the job of building a
community around a programming language involves so much stuff that doesn't use
the language itself, and these days invariably involves poking around various
npm packages and staring at the Chrome developer tools.

### Can I use your build of highlight.js to font-lock xtlang code on my own site?

Sure, I'd be pumped if you did. If you want, you can check out the
[`hljs-with-xtlang`
branch](https://github.com/benswift/benswift.github.io/tree/hljs-with-xtlang) of
this repo and follow the instructions therein to make your own custom build. Or,
if you don't want to do that, you could just use the one you've already
downloaded (since you're visiting this website). Here's a [direct
link]({{site.baseurl}}{% link assets/js/highlight.pack.js %}) if you want to do
things that way.
