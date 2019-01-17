---
title: highlight.js with xtlang support
date: 2019-01-17 10:54 +1100
---

> It is a truth, universally acknowledged, that all programming language authors
> must also be expert web developers. -*Jane Austen* (probably)

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

And just to make sure that it still works with the other languages that I like.

```scheme
(define ben-doubler 
  (lambda (x)
    (* x 2)))
```

```armasm
labelious:
  sub r0, 1
  bne doneski
  b labelious

doneski:
  nop
```

Wow. That's so great.
