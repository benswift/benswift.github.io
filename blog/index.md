---
layout: page
pagination:
  enabled: true
---

{% for post in paginator.posts %}
  <h2><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>
{% endfor %}
