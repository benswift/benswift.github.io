---
layout: post
title: Hosting a self-built jekyll site on GH pages
date: 2018-06-22 10:40
tags: meta web
---

This blog is built from [markdown](http://commonmark.org/help/) files using
[Jekyll](https://jekyllrb.com/) hosted on [GitHub
pages](https://pages.github.com/), which saves a lot of hassle involved with DIY
hosting[^hassle]. There are a bunch of [useful
tutorials](http://blog.teamtreehouse.com/using-github-pages-to-host-your-website)
on how to set all this up.

However, I like to have control over which plugins are used, etc. which GitHub
pages doesn't let you do. What it (GH pages) _does_ let you do, though, is dump
a bunch of files (html, js, css) in a repo and just serve them as-is. These
files represent the "built" version of your site, not the source, so you'll
probably want a separate repo for your content (e.g. your markdown files) and
the built site. Handling this stuff can be a hassle, so here's the `Makefile` I
use to make it easy.

The basic process is:

1. create a git repo where you keep your jekyll site (or not, but it's so nice
   to have your blog content under version control)

2. create a separate project on GitLab called
   `$(GH_USERNAME)/$(GH_USERNAME).github.io.git`, but don't create anything in
   there yet

3. `make init` will turn the local jekyll build directory into a git repo

4. `make push` target will build your site (locally) and push it up to GitHub,
   where it'll be served by GitHub pages

After that, you can work on, commit & push your blog wherever you like (I
actually keep the content in the [same GH
repo](https://github.com/benswift/benswift.github.io), but in a `source` branch)
but you can push the built site to the master branch so GH pages will serve it
up for you.

[^hassle]:
    I know that it's not actually _that_ much hassle, especially if you've
    already got a webserver set up for other reasons, but zero hassle still
    beats ε hassle ∀ε>0, especially when there's other work to be done.

```make
BASE_HTML_DIR=_site
GH_USERNAME=benswift # change this to your GH username

all: push

init:
	mkdir -p $(BASE_HTML_DIR) && cd $(BASE_HTML_DIR) && git init . && git remote add origin git@github.com:$(GH_USERNAME)/$(GH_USERNAME).github.io.git

generate-blog:
	bundle exec jekyll build

commit-all: generate-blog
	cd $(BASE_HTML_DIR) && git add . && git commit -m "update blog"

push: commit-all
	cd $(BASE_HTML_DIR) && git push origin master
```
