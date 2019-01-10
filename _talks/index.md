---
title: Talks
layout: page
hidden: true
---

{% for talk in site.talks %}
{%- unless talk.hidden -%}
<section class="post">
  <p class="post-date">{{ talk.date | date: "%d %b '%y" }}</p>
  <h2><a href="{{ site.baseurl }}{{ talk.url }}">{{ talk.title }}</a></h2>
  {%- if talk.summary -%}
  <p>{{ talk.summary }}</p>
  {%- endif -%}
</section>
{%- endunless -%}
{% endfor %}
