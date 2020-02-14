---
title: 'Command/Control: giving OS aware keybinding hints'
---

As someone who writes a lot of [web-based](https://extemporelang.github.io)
[documentation for](https://cs.anu.edu.au/courses/comp1720/)
[using](https://cs.anu.edu.au/courses/comp2300/)
[computers](https://cs.anu.edu.au/courses/comp2710-lens/), it's often useful to
give people hints about keybindings which could make their lives easier.
However, this is tricky when it comes to the control key/command key keybinding
convention on macOS vs Windows/Linux.

In the past, I've just written things like:

> To save the file, hit <kbd class="nopretty">CTRL</kbd>+<kbd>S</kbd> to save
> (or <kbd class="nopretty">⌘</kbd>+<kbd>S</kbd> if you're on macOS)

which gets _really tedious_ when you have to repeat it every time.

So, I wrote a little bit of javascript which tries to solve the problem. It
auto-detects[^detection] if you're on macOS and if so it replaces
`<kbd>CTRL</kbd>` with `<kbd>⌘</kbd>`. If you're interested, the (very small) js
file is in `assets/js/os-aware-modifiers.js` in my [blog source on
GitHub](https://github.com/benswift/benswift.github.io/blob/source/assets/js/os-aware-modifiers.js).

[^detection]: it'll work in _most_ cases; foolproof OS autodetection is really hard
