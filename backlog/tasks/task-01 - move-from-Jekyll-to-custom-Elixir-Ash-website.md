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

We need to move this website from a static Jekyll site to a custom Elixir/Ash
(non-static) website. A sketch of the plan would be:

- keep the blog posts and other "web content" md files as-is, and wrap them in a
  custom Ash resource/action which used MDEx to convert them on the fly in
  response to requests
- use phoenix liveview and presences to add cool dynamic features that aren't
  currently possible with a static website
- ditch pretty much all the sass/css from the current website; re-write a new
  site using tailwind 4 and the new daisyUI components shipped with the new
  Phoenix 1.18

Post authoring would still be done by writing new md files in the git repo (this
does mean that creating/updating a post would require a full update and restart
of the app, but I'm fine with that in the short term). Aside from that, the new
Elixir app might not even need a data layer (e.g. sqlite, postgres). But that's
a TBC that I will clarify through the design & build process---it may be
necessary to add a proper data layer to add additional features in the future
(e.g. user accounts? not sure I want them, though).

Part of the migration approach would be to use the jekyll-sitemap plugin to
generate a sitemap.xml containing full paths to all pages on the current
(static) site, and then part of the testing for the new website would be to
iterate through every page and make sure that the new one responded with the
same content (modulo styling changes... in the short term, checking that it
least didn't 404).

Additionally, google pagespeed insights and a11y would need to be part of the
tests as well---that stuff has been a priority for the jeykll site, and should
continue to be so going forward.

The current jekyll site has one particular custom plugin which reads a BibTeX
(`*.bib`) file and uses that information to populate a list of citations on e.g.
the main "Research" page. I would need to duplicate this in Ash/Elixir as well.

### Libraries

- latest Ash/Phoenix (must be 1.8 - rc is ok)/Phoenix LiveView (1.18)
- daisyUI for frontend components (as per Phoenix 1.8 defaults)
- use igniter wherever possible to install libraries
