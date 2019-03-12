---
title: Tag index
layout: page
permalink: /blog/tag/
---

Click on the tag name to list all the blog posts with a given tag.

<p class="post-tag-container">
  {% for tag in site.tags %}
  {% assign tagname = tag | first %}
  <a class="post-tag" href="{{ site.baseurl }}/blog/tag/{{ tagname }}/">
	{{ tagname }}
  </a>
  {% endfor %}
</p>
