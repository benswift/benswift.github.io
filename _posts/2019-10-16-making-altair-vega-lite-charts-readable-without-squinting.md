---
title: Making altair/vega-lite charts readable without squinting
date: 2019-10-16 20:14 +1100
---

My love for the [Grammar of
Graphics](https://www.amazon.com/Grammar-Graphics-Statistics-Computing/dp/0387245448)
runs deep, and in particular for Hadley Wickham's venerable `ggplot2` which
showed me the light back when I was a young PhD student. Seriously, once you
have your head around it it makes playing with different views on data _so
easy_, and the ability to quickly try lots of different datavis approaches feels
like you have superpowers. These days I often work in Python, and for datavis
I'm enjoying [Altair](https://altair-viz.github.io/index.html) which is based
around the same philosophy.

Recently I've needed to (a) create some snazzy graphs with Altair and (b)
display them in a slide deck. Part (a) was actually the easy part---the tricky
part was (b) getting Altair to render charts with text & other marks that
weren't so small that the slide was unreadable.

Here's an example: a [simple line
chart](https://altair-viz.github.io/gallery/simple_line_chart.html) from the
[Altair Example Gallery](https://altair-viz.github.io/gallery/index.html).

``` python
import altair as alt
import numpy as np
import pandas as pd

x = np.arange(100)
source = pd.DataFrame({"x": x, "f(x)": np.sin(x / 5)})

alt.Chart(source).mark_line().encode(x="x", y="f(x)").save(f"{CHART_DIR}/sin-x.svg")
```

which (with default settings) produces a chart that looks like this:

{% asset images/posts/altair-charts/sin-x.svg alt="f(x) = sin(x)/5" %}

## Easy tweaking of "size" through chart themes

Now, that figure might look fairly readable, but when it's on a slide the text,
labels & even lines are quite small[^examples]. I don't need [fine-grained
control](https://github.com/vega/vega-lite/issues/1714) over the relative sizes
of labels vs legend vs title, etc. I just want a simple knob for making all the
text bigger so that my slides don't double as an [eye
chart](https://en.wikipedia.org/wiki/Eye_chart). The vega-lite folks (the
underlying vis engine which Altair uses) [know about the issue, but don't want
to fix it](https://github.com/vega/vega-parser/issues/18).

{:.hl-para}

Note that when I'm talking about "size" I'm **not** talking about the size &
dimensions of the chart---I'm talking about the size of the text, lines & other
marks _relative to_ the overall size of the chart.

The easiest way I found to fix this is to set a small width & height for the
chart, then export to a vector format (e.g. svg) so that when the image gets
displayed everything will be "stretched" up into big, bold sizes (and since it's
a vector format, things will still be nice and crisp). This chart code is the
same except for the `.properties(width=100, height=60)` part:

``` python
alt.Chart(source).mark_line().encode(x="x", y="f(x)").properties(
    width=100, height=60
).save(f"{CHART_DIR}/sin-x-big-text.svg")
```

{% asset images/posts/altair-charts/sin-x-big-text.svg alt="f(x) = sin(x)/5 with bigger labels" %}

Obviously I'm exaggerating here to make a point, but the key point is that there
are just a couple of numbers to tweak (`width` and `height`) which control text
& line size, label sizes, and also titles and legends (if present). And that's
not something that's exposed as simply in any other way by the Altair/Vega Lite
API.

One final tip: if you want to have consistent sizes & aspect ratios across lots
of charts (e.g. you're batch exporting lots of charts for a presentation or
report) you can create [a custom
theme](https://altair-viz.github.io/user_guide/configuration.html#defining-a-custom-theme),
but otherwise you can just do it with a call to the `.properties()` method as
shown.

[^examples]:
    To be honest, these simple examples from the example gallery don't really
    help me make my point, they're still pretty readable. But when the charts
    get more complicated & have more data marks then things get smaller & more
    zoomed out, and the problem gets much worse.
