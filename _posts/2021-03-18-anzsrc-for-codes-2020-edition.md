---
title: ANZSRC FoR Codes 2020 edition
tags: research
---

The Australian Research Council (well, technically the [Australian Bureau
of](https://www.abs.gov.au) + their [NZ
counterparts](https://www.stats.govt.nz)) have updated the [_Field of Research_
codes](https://www.arc.gov.au/grants/grant-application/classification-codes-rfcd-seo-and-anzsic-codes)
which Aussie academics use to classify their work.[^interdisciplinary-complaint]

[^interdisciplinary-complaint]:
    I'm not the first interdisciplinary academic to complain about these types
    of classifications, and I'm sure I won't be the last, but that's not what
    this post is about.

I was trying to browse these new codes recently, and had a bummer of a time
trying to find the actual classification scheme (codes, hierarchy & code names).
The official page seems to be [this
one](https://www.abs.gov.au/AUSSTATS/abs@.nsf/Lookup/1297.0Main+Features12020?OpenDocument),
but the data is only available on sheet 3 of an excel spreadsheet, which is just
a bummer when all you want to do is <kbd>ctrl</kbd>+<kbd>F</kbd> your way around
an HTML table in your web browser.

So, I've copied the relevant part of the spreadsheet into a regular-ol' webpage
here for your browsing pleasure.[^hosting]

[^hosting]:
    Hopefully this is ok---the real data is © ABS and you should always go there
    for the canonical version. ABS people, if I've done something naughty with
    this publicly-available data then please let me know and I'll make it right.

## 2020 ANZRC Field of Research (FoR) Codes

<style>
#FoR-Codes-2020 tr.division-row {
  border-top: 2px solid #be2edd;
  font-weight: 900;
  font-size: 1.1em;
}
#FoR-Codes-2020 tr.group-row {
  border-top: 1px solid #be2edd;
  font-weight: 900;
}
</style>

<table id="FoR-Codes-2020">
  <thead>
    <tr><th>Division</th><th>Group</th><th>Field</th><th>Description</th></tr>
  </thead>
  <tbody>
  {% for code in site.data.FoR-Codes-2020 %}
    <tr
    {% if code.Division != nil %}
    class="division-row"
    {% elsif code.Group != nil %}
    class="group-row"
    {% endif %}
    >
    {% for value in code %}
      <td>{{ value[1] }}</td>
    {% endfor %}
    </tr>
  {% endfor %}
  </tbody>
</table>
