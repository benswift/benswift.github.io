---
title: A dynamic Reimagine logo
date: 2019-02-21 10:36 +1100
tags: widgets reimagine web
---

I keep harping on about the **Reimagine project** because I'm super pumped about
what it means for the way we do Engineering Computer Science here at the ANU
(see [here]({% link assets/pdf/reimagine-fellow-PD.pdf %}) and
[here](https://cecs.anu.edu.au/reimagine) for more info).

Reimagine branding is starting to go up around campus, so I decided to put
together an interactive version of the logo (because giant vinyl prints are
cool, but they don't spin on mouse-over).

It's made with [clojurescript](https://clojurescript.org) using
[Reagent](https://reagent-project.github.io), and as always on my blog you can
look at the
[source](https://github.com/benswift/benswift.github.io/blob/source/_cljs/reimagine_logo/src/reimagine_logo/core.cljs)
to see how it works. If you want to really immerse yourself in the thing,
there's a fullsreen version [here]({% link
widgets/reimagine-logo.html %}).

<div style="position:relative;padding-top:100%;margin:0;">
  <iframe src="{% link widgets/reimagine-logo.html %}"
          frameborder="0"
          style="position:absolute;top:0;left:0;width:100%;height:100%;">
  </iframe>
</div>

If you're looking to use this logo yourself in some other page, you could use an
`<iframe>` like so:

```html
<div style="position:relative;padding-top:100%;margin:0;">
  <iframe
    src="https://benswift.me/widgets/reimagine-logo/"
    frameborder="0"
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
  >
  </iframe>
</div>
```
