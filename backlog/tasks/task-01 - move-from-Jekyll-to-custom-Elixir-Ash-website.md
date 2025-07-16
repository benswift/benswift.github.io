---
id: task-01
title: move from Jekyll to custom Elixir/Ash website
status: To Do
assignee: []
created_date: "2025-07-16"
labels: []
dependencies: []
---

## Description

This describes a plan for moving this website from a static Jekyll site to a
custom Elixir/Ash (non-static) website. A sketch of the plan would be:

- keep the blog posts and other "web content" md files as-is, and wrap them in a
  custom Ash resource/action which used MDEx to convert them on the fly in
  response to requests
- use phoenix liveview and presences to add cool dynamic features that aren't
  currently possible with a static website
- ditch pretty much all the sass/css from the current website; re-write a new
  site using tailwind 4 and the new daisyUI components shipped with the new
  Phoenix 1.18

Part of the migration approach would be to use the jekyll-sitemap plugin to
generate a sitemap.xml containing full paths to all pages on the current
(static) site, and then part of the testing for the new website would be to
iterate through every page and make sure that the new one responded with the
same content (modulo styling changes... in the short term, checking that it
least didn't 404).
