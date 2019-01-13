---
title: Talks
layout: page
hidden: true
---

Sometimes I give talks & presentations on various topics. Click through any of
the titles to see the slides, although often my slides don't make sense in
isolation (if had everything I said written on my slides and just read it out my
talks would be **really boring**).

{% for talk in site.talks reversed %}
{%- unless talk.hidden -%}
<section class="post">
  <p class="post-date">{{ talk.date | date: "%d %b '%y" }}</p>
  <h2><a href="{{ site.baseurl }}{{ talk.url }}">{{ talk.title }}</a></h2>
  {%- if talk.summary -%}
  <p>{{ talk.summary | markdownify }}</p>
  {%- endif -%}
</section>
{%- endunless -%}
{% endfor %}
