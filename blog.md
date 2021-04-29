---
title: Blog
layout: paginated
permalink: /blog/
pagination:
  enabled: true
---

This is my blog. Sometimes in these posts I'll talk about research or art
projects I'm involved with, sometimes I'll just ramble about other stuff which
is keeping me up at night. If you're interested in a certain topic, click on a
tag to see just the posts with that tag:

{% assign all_tags = site.posts | map: "tags" | uniq | sort %}
{% include taglist.html tags = all_tags %}

If anything here sparks your interest (or your ire!) then get in touch
([twitter](https://twitter.com/benswift), [email](mailto:ben.swift@anu.edu.au))
or discuss on [HN](https://news.ycombinator.com).
