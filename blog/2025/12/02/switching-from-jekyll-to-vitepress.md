---
title: "Switching from Jekyll to VitePress"
tags: [dev, web]
---

This site has run on Jekyll since 2014 (or even before, I think; but some
secrets are lost to time). Ten years is a good run for any technology choice,
but I've finally made the switch to [VitePress](https://vitepress.dev/). The
source is open, so you can
[check it out for yourself](https://github.com/benswift/benswift.github.io/).

Jekyll still works fine for pure markdown→HTML, and so-called "content sites".
The problem is everything around the edges, and especially things which use
packages from npm. My site has accumulated interactive components, reveal.js
slide decks, custom syntax highlighting for obscure languages, and enough Ruby
plugins that I'd forgotten what half of them did. And while Jekyll is mature, it
does seem like it's kindof in maintenance mode these days.

I'd been using VitePress for a few other projects and kept being impressed by
how much you get out of the box. Vue components, TypeScript, with a
lightning-fast developer experience. Hot module replacement actually
works---something Jekyll's `--livereload` never quite managed reliably.

But the real appeal is that the escape hatches are sensible. When you need
custom behaviour, you write TypeScript or Vue instead of Ruby plugins and Liquid
templates. The mental model is cleaner: it's just Vite with some markdown
conventions.[^vite]

[^vite]:
    If you're not familiar with [Vite](https://vite.dev/), it's the modern build
    tool that replaced webpack in most of my projects. Fast, and also other
    things, but mostly fast.

## The migration

If you're gonna make the same move, here are a few things to note. Honestly,
just point Claude at this blog post, because this sort of thing (moving from one
well-known stack to another) is the sort of thing that LLMs shine at.

### Content structure

Jekyll wants posts in `_posts/YYYY-MM-DD-slug.md`. VitePress doesn't care, so I
reorganised into `blog/YYYY/MM/DD/slug.md`. This preserves my existing URLs
while making the directory structure more navigable.
[Cool URIs don't change](https://www.w3.org/Provider/Style/URI).

The trick is extracting dates from the URL path rather than requiring them in
frontmatter. VitePress lets you do this with `transformPageData`:

```ts
transformPageData(pageData) {
  const dateMatch = pageData.relativePath.match(
    /blog\/(\d{4})\/(\d{2})\/(\d{2})/
  )
  if (dateMatch) {
    const [, year, month, day] = dateMatch
    pageData.frontmatter.date = `${year}-${month}-${day}`
  }
}
```

### Custom components

All my Jekyll includes became Vue components. A YouTube embed that was 20 lines
of Liquid with magic width calculations became:

```vue
<template>
  <div class="youtube-wrapper">
    <iframe :src="embedUrl" allowfullscreen />
  </div>
</template>
```

At a certiain level of complexity, having a proper programming language (not
just a templating system) becomes worth the tradeoffs. The component is
type-safe, composable, and I can actually read it six months later.

### Reveal.js slides

::: info

Honestly, the reveal.js stuff is still a work in progress, and I'm not super
happy with it just yet.

:::

This was the fiddly bit. I had a custom Jekyll plugin that transformed markdown
into reveal.js slides. I rewrote this as a `markdown-it` plugin that runs at
build time, splitting content on h1/h2 headers and hoisting `data-*` attributes
onto the reveal sections.

### Data loading

Jekyll has `_data` files that become available in templates. VitePress has
`.data.ts` files that can do the same thing---but with TypeScript, so you can
parse BibTeX files, fetch from APIs, or do whatever processing you need:

```ts
export default {
  load() {
    const publications = parseBibtex("_data/ben-pubs.bib");
    return publications.sort((a, b) => b.year - a.year);
  },
};
```

The data is computed at build time and available in your pages. No runtime
overhead.

## The wash-up: what's nice about the new setup?

**Dev experience.** Instant hot reload. Actual error messages instead of Liquid
stack traces.

**Type safety.** Configuration, data loaders, components---it's all TypeScript.
I catch errors at build time instead of discovering them in production.

**Component model.** Vue single-file components are a better abstraction than
Liquid includes. State, props, slots---the concepts map cleanly to what you're
actually trying to do.

**Performance.** The production build is smaller and faster. Though honestly
this was never really a problem---static sites are fast by definition.

Should you switch? If your Jekyll site is just markdown and you're happy with
it, stay put. Jekyll still does that well.

But if you're fighting Liquid templates, maintaining Ruby plugins you don't
understand, or wanting to add interactive components without a whole separate
build system---VitePress is worth considering. The migration isn't trivial, but
it's straightforward if you take it piece by piece.

The old Jekyll site is preserved on the
[`jekyll` tag](https://github.com/benswift/benswift.github.io/tree/jekyll) if
you want to compare. Or browse the current
[`main` branch on GitHub](https://github.com/benswift/benswift.me) to see how it
all fits together.

If there's something which was on the old site that you can't find on the new
one, then [drop me a line](mailto:ben@benswift.me) and I'll try to help you find
it.
