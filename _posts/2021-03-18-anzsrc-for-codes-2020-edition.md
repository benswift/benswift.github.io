---
title: ANZSRC FoR Codes 2020 edition
tags: research
---

The Australian Research Council (well, technically the [Australian Bureau of
Statistics](https://www.abs.gov.au) and their [NZ
counterparts](https://www.stats.govt.nz)) have updated the [_Field of Research_
codes](https://www.arc.gov.au/grants/grant-application/classification-codes-rfcd-seo-and-anzsic-codes)
which Aussie/NZ academics use to classify their
work.[^interdisciplinary-complaint]

[^interdisciplinary-complaint]:
    I'm not the first interdisciplinary academic to complain about these types
    of classifications, and I'm sure I won't be the last, but that's not what
    this post is about.

I was trying to browse these new codes recently, and had a hard time trying to
find the actual classification scheme (codes, hierarchy & code names). The
official page seems to be [this
one](https://www.abs.gov.au/AUSSTATS/abs@.nsf/Lookup/1297.0Main+Features12020?OpenDocument),
but the data is only available on sheet 3 of an excel spreadsheet, which is just
a bummer when all you want to do is <kbd>ctrl</kbd>+<kbd>F</kbd> your way around
an HTML table in your web browser.

So, I've copied the relevant part of that spreadsheet into a regular-ol' webpage
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
#FoR-Codes-2020 .search {
  width: 100%;
  line-height: 1.6;
  font-size: 1rem;
  padding: 0.3rem 0.6rem;
  border: 2pt solid #be2edd;
  border-radius: 3px;
  margin-bottom: 1rem;
}
</style>

<div id="FoR-Codes-2020">
<input class="search" placeholder="type to filter FoR codes..." />
<table>
  <thead>
    <tr><th>FoR&nbsp;Code</th><th>Description</th></tr>
  </thead>
  <tbody class="list">
  {% for code in site.data.FoR-Codes-2020-processed %}
    <tr>
      <td class="FoR-code">{{ code.Field }}</td>
      <td class="FoR-description">{{ code.Description }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
</div>

<script src="{% link assets/js/list.min.js %}"></script>

<script>
  const forCodeList = new List("FoR-Codes-2020", {valueNames: ["FoR-code", "FoR-description"]});
</script>
