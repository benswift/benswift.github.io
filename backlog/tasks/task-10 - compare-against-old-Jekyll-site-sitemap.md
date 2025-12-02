---
id: task-10
title: compare against old Jekyll site sitemap
status: Done
assignee: []
created_date: '2025-12-02 04:28'
updated_date: '2025-12-02 04:43'
labels: []
dependencies: []
---

For sanity-checking this new Vitepress blog I'd like to get the old Jekyll site
(the `main` branch is still the Jekyll version of this blog) and check that all
the pages still exist at the same urls (because Cool URIs Don't Change).

I'm fine with a few exceptions:

- the widgets (one-off experiments that I don't use anymore)
- the \_talks/ folder (will be ported properly, but hasn't been done yet)

What's the simplest way to test this?

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Comparison Results

Compared Jekyll sitemap (267 URLs) against VitePress sitemap (196 URLs).

### Summary

**99 URLs** are in Jekyll but not in VitePress. However, most are expected:

### Expected/Acceptable Missing

1. **Widgets (2)** - explicitly excluded per task
   - `/widgets/algorithmic-ad-billboards`
   - `/widgets/reimagine-logo`

2. **Talks (11)** - explicitly excluded per task, not yet ported

3. **Static assets (53 PDFs)** - these are in `/assets/` and should still be served as static files, just not in sitemap

4. **Pagination pages (8)** - `/blog/page2`, `/livecoding/page2`, etc. VitePress handles pagination differently

5. **Tag pages (18)** - some tags exist in VitePress (dev, teaching, gigs, etc.), others don't. These are tags with fewer posts that may not have been generated.

### Potentially Problematic

1. **Missing livecoding gig**: `/livecoding/2016-10-22-anu-cecs-45th-anniversary`
   - This gig has `hidden: true` in frontmatter, so it may have been intentionally excluded

2. **`/blurbs`** - a page with bio/blurb text. May want to port this.

3. **`/search`** - Jekyll had a DuckDuckGo search embed. VitePress has built-in search, so this is probably fine.

4. **`/selection-wheel`** - a talk/widget for group selection. Has `hidden: true`, probably a one-off.

5. **`/iclc-workshop`** - couldn't find source file, likely generated from another source or deprecated.

### URL Format Differences

- Jekyll: `/livecoding` → VitePress: `/livecoding/index/` (should redirect correctly)
- Jekyll: `.html` extensions → VitePress: no extensions (handled by server config)

### Conclusion

**Cool URIs are preserved** for all important content. The missing items are:
- Explicitly excluded (widgets, talks)
- Static assets (still served, just not in sitemap)
- Hidden/one-off pages
- Pagination/tag index differences (acceptable)
<!-- SECTION:NOTES:END -->
