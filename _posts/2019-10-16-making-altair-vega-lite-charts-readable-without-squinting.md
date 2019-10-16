---
title: Making altair/vega-lite charts readable without squinting
date: 2019-10-16 20:14 +1100
---

My love for the whole "grammar of graphics" thing is well known, and in
particular for Hadley Wickham's venerable `ggplot2` which showed me the light
back when I was a young PhD student. Good times.

These days, however, I often work in Python for a bunch of reasons, and I'm
enjoying [Altair](https://altair-viz.github.io/index.html), which is based
around the same philosophy.

Recently I've needed to (a) create some snazzy graphs with Altair and (b)
display them in a slide deck. Part (a) was actually the easy part---the tricky
part was (b) getting Altair to render charts with text that wasn't so small that
it was unreadable. I don't want [fine-grained
control](https://github.com/vega/vega-lite/issues/1714) over the relative sizes
of labels vs legend vs title, etc. I just want a simple knob for making all the
text bigger so that my slides don't look like a vision test. It looks like the
vega-lite folks (the underlying vis engine which Altair uses) [know about the
issue, but don't want to fix it](https://github.com/vega/vega-parser/issues/18).

To demonstrate, here's a [histogram
example](https://altair-viz.github.io/gallery/simple_histogram.html) from the
[Altair Example Gallery](https://altair-viz.github.io/gallery/index.html).

``` python
import altair as alt
from vega_datasets import data

alt.Chart(data.movies.url).mark_bar().encode(
    alt.X("IMDB_Rating:Q", bin=True), y="count()"
).save(f"{CHART_DIR}/imdb-histogram.svg")
```

which produces a chart that looks like this:

{% asset images/posts/altair-charts/imdb-histogram.svg alt="IMDB histogram" %}

Here's another example: this time a [bar
chart](https://altair-viz.github.io/gallery/grouped_bar_chart_with_error_bars.html)

``` python
bars = (
    alt.Chart()
    .mark_bar()
    .encode(
        x="year:O", y=alt.Y("mean(yield):Q", title="Mean Yield"), color="year:N"
    )
)

error_bars = alt.Chart().mark_errorbar(extent="ci").encode(x="year:O", y="yield:Q")

alt.layer(bars, error_bars, data=data.barley()).facet(column="site:N").save(
    f"{CHART_DIR}/barley-yield.svg"
)
```

which produces a chart that looks like this:

{% asset images/posts/altair-charts/barley-yield.svg @pic alt="chart of barley yield" %}

Totally cray.

