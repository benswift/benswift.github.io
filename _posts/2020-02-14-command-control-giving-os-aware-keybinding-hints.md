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

So, I wrote a little bit of javascript which 

1. scans the document for any <kbd class="nopretty">control</kbd> elements
2. if it detects[^detection] you're viewing the site on macOS, changes it to
   <kbd class="nopretty">⌘</kbd>
   
It actually searches for all of <kbd class="nopretty">control</kbd>, <kbd
class="nopretty">command</kbd>, <kbd class="nopretty">ctrl</kbd>, <kbd
class="nopretty">ctl</kbd> or <kbd class="nopretty">cmd</kbd> and "normalises"
them to <kbd class="nopretty">⌘</kbd> (macOS) or <kbd
class="nopretty">CTRL</kbd> (otherwise).

On the off chance that I actually don't want it to do this, the script will skip
any `<kbd>` element with a `nopretty` class.

[^detection]: it'll work in _most_ cases; foolproof OS autodetection is really hard

If you're interested, the script looks like this:

```javascript
window.addEventListener('DOMContentLoaded', (event) => {

  // replace all these with the appropriate modifier for the platform
  let modKeys = ["control", "command", "ctrl", "ctl", "cmd"];

  let modifier = navigator.appVersion.indexOf("Mac")!=-1 ? "⌘" : "CTRL";

  for (const kbdElement of document.querySelectorAll("kbd")) {
	if (modKeys.includes(kbdElement.textContent.toLowerCase()) && !kbdElement.classList.contains("nopretty")){
	  kbdElement.textContent = modifier;
	}
  }
});
```

In case I make any tweaks, you can always find the latest version in my [blog
source on
GitHub](https://github.com/benswift/benswift.github.io/blob/source/assets/js/os-aware-modifiers.js).
