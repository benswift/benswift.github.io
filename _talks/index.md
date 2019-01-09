---
layout: default
hidden: true
---

{% for talk in site.collections %}
<section class="post">
  <!-- <p class="post-date">{{ post.date | date: "%d %b '%y" }}</p> -->
  <h2><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.summary }}</p>
</section>
{% endfor %}
