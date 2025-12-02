---
id: task-04
title: Migrate Jekyll content to VitePress-native structure
status: Done
assignee: []
created_date: "2025-12-01 23:32"
updated_date: "2025-12-01 23:59"
labels:
  - migration
  - vitepress
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->

Migrate source content from Jekyll structure to VitePress-native conventions,
eliminating the generation scripts.

## Current state

- Source files in `posts/`, `_talks/`, `_livecoding/`
- Generation scripts transform Jekyll syntax and move to output locations
- `npm run dev` runs generation as a pre-step

## Target state

- Files live at their final URLs: `blog/YYYY/MM/DD/slug.md`, `talks/*.md`,
  `livecoding/*.md`
- No generation scripts
- Clean markdown with Vue components where needed
- Direct `vitepress dev` / `vitepress build`

## Simplifications (Jekyll workarounds we can drop)

- `{% include toc.html %}` → remove (VitePress has sidebar outline) or use
  `[[toc]]`
- `{:.hl-para}` → `::: info` container
- `{% include picture.html %}` → `<Picture />` component (already exists)
- `{% include youtube.html %}` → `<YouTube />` component (already exists)
- `{% link ... %}` → standard markdown links with relative paths
- `{% raw %}...{% endraw %}` → remove (not needed in VitePress)
- `{{ site.baseurl }}` → remove (VitePress handles base URLs)

## Components needed

Already exist: `Picture.vue`, `YouTube.vue`, `TagList.vue`, `ForCodesTable.vue`

For talks (if keeping reveal.js):

- `SlideBackgroundImage.vue`
- `SlideTitle.vue`
- `SlideImpact.vue`
- Plus ~8 more slide components

## Manual cleanup items (defer to separate tasks)

- 3 skipped blog posts with complex HTML
- 1 file with `{% bib_list_pubs %}` custom bibliography
- 2 files with `{% for %}` data iteration (one already has ForCodesTable)
- 12 `{% fa_svg %}` icon references
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

<!-- AC:BEGIN -->

- [x] #1 Generation scripts removed from package.json
- [x] #2 Source files live at final URL locations
- [x] #3 No Jekyll/Liquid syntax in content files (except deferred manual items)
- [x] #4 `npm run dev` runs vitepress directly without pre-generation
- [x] #5 All existing URLs preserved
- [x] #6 Site builds and renders correctly
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->

## Phase 1: Write conversion script

Create a Node.js script to transform all content files:

1. **Link conversion**: `{% link _posts/YYYY-MM-DD-slug.md %}` →
   `/blog/YYYY/MM/DD/slug`

   - `{% link _talks/slug.md %}` → `/talks/slug`
   - `{% link _livecoding/YYYY-MM-DD-slug.md %}` → `/livecoding/YYYY-MM-DD-slug`
   - `{% link assets/... %}` → `/assets/...`

2. **Include conversion**:

   - `{% include picture.html file="X" alt="Y" %}` →
     `<Picture file="X" alt="Y" />`
   - `{% include youtube.html id="X" %}` → `<YouTube id="X" />`
   - `{% include toc.html %}` → `[[toc]]`

3. **Kramdown to VitePress**:

   - `{:.hl-para}` on preceding paragraph → wrap paragraph in
     `::: info\n...\n:::`

4. **Cleanup**:

   - Remove `{% raw %}...{% endraw %}` wrappers
   - Remove `{{ site.baseurl }}`
   - Remove `layout: post` / `layout: page` from frontmatter (use defaults)

5. **Skip items for manual cleanup** (log them):
   - `{% for %}` / `{% unless %}` loops
   - `{% bib_list_pubs %}`
   - `{% fa_svg %}`

## Phase 2: Migrate blog posts and livecoding

1. Run conversion script on `posts/*.md`
2. Move converted files to `blog/YYYY/MM/DD/slug.md` structure
3. Run conversion script on `_livecoding/*.md`
4. Move converted files to `livecoding/*.md`
5. Update data loaders to read from new locations
6. Test blog and livecoding pages render correctly

## Phase 3: Migrate talks (minimal conversion)

For now, just do basic cleanup on talks:

1. Run conversion script on `_talks/*.md` (links, basic includes)
2. Move to `talks/*.md`
3. Leave slide-specific Jekyll includes as-is (they won't render but won't
   break)
4. Mark talks with `hidden: true` in frontmatter if they have broken slide
   syntax

The new slide deck feature (task-06) will provide the proper solution. Once
that's built, talks can be updated to use the new components.

## Phase 4: Cleanup

1. Delete generation scripts
2. Remove `predev`/`prebuild` from package.json
3. Delete old source directories (`posts/`, `_talks/`, `_livecoding/`)
4. Update `srcExclude` in vitepress config
5. Final build and test
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->

Completed migration on 2025-12-02:

- Created blog.data.ts to scan blog/ directory structure instead of posts/
- Updated tag paths loader to scan blog/ directory
- Fixed 3 skipped posts (codesign workshop, extempore tricks, academic
  integrity)
- Fixed SlideStackedPapers include in classics-to-colonialism talk
- Removed generation scripts and source directories (posts/, \_posts/,
  \_livecoding/, \_talks/, scripts/)
- Updated package.json to remove prebuild/predev hooks
- Updated srcExclude in vitepress config
- Build and typecheck pass successfully
<!-- SECTION:NOTES:END -->
