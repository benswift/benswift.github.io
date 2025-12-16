---
id: task-15
title: blog posts (and maybe livecoding gig pages) aren't showing up in search
status: Done
assignee: []
created_date: '2025-12-03 02:52'
updated_date: '2025-12-03 03:26'
labels: []
dependencies: []
---

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Fix Applied

The issue was that VitePress local search indexes markdown headings, but blog posts have their titles only in frontmatter (rendered by Vue's PostLayout component, not in markdown source).

### Solution

Added a custom `_render` function to the search configuration in `.vitepress/config.ts` that:
1. Renders the markdown first to populate `env.frontmatter`
2. Checks if the page has an existing h1 heading
3. If no h1 exists and frontmatter has a title, prepends the title as a markdown h1 and re-renders

```typescript
search: {
  provider: "local",
  options: {
    _render(src, env, md) {
      const html = md.render(src, env);
      if (env.frontmatter?.search === false) return "";
      const hasH1 = /^#\s+/m.test(src);
      if (env.frontmatter?.title && !hasH1) {
        const modifiedSrc = `# ${env.frontmatter.title}\n\n${src}`;
        return md.render(modifiedSrc, env);
      }
      return html;
    },
  },
},
```

### Testing
- Searching for "DeepSeek" now returns the blog post "DeepSeek and Shallow Moats: Implications for Higher Education"
- Searching for "livecoding" returns many blog post titles that were previously not indexed
<!-- SECTION:NOTES:END -->
