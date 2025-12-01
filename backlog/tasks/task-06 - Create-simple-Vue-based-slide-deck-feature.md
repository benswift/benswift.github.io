---
id: task-06
title: Create simple Vue-based slide deck feature
status: To Do
assignee: []
created_date: '2025-12-01 23:36'
labels:
  - vitepress
  - feature
  - talks
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace the reveal.js slide system with a simple, modern Vue-based slide deck that supports basic presentation needs.

## Goals
- Simple, maintainable code (no heavy dependencies like reveal.js)
- Works well with VitePress
- Keyboard navigation (arrow keys, escape)
- Basic slide templates covering common use cases
- No speaker notes needed

## Slide templates needed

1. **Title slide** - Talk title, subtitle, author, date
2. **Text + heading** - Heading with body text/bullets
3. **Half-half (text/image)** - Split layout with text on one side, image on other
4. **Fullscreen image** - Background image with optional overlay text
5. **Impact** - Large centered text for emphasis/quotes

## Technical approach

- `SlideDeck.vue` - Container component handling navigation state
- Individual slide components or slots for each slide
- CSS for fullscreen presentation mode
- Keyboard event handling for navigation
- URL hash or query param for slide position (shareable links)

## Navigation
- Arrow keys (left/right) for prev/next
- Escape to exit fullscreen/presentation mode
- Optional: swipe on touch devices
- Optional: progress indicator

## Migration path for existing talks
- Map old Jekyll slide includes to new components
- `{% include slides/title.html %}` → `<SlideTitle />`
- `{% include slides/background-image.html %}` → `<SlideImage />` 
- etc.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 SlideDeck container component with keyboard navigation
- [ ] #2 Title slide template
- [ ] #3 Text + heading slide template
- [ ] #4 Half-half (text/image) slide template
- [ ] #5 Fullscreen image slide template
- [ ] #6 Impact/quote slide template
- [ ] #7 Works in VitePress markdown files
- [ ] #8 Shareable URLs with slide position
<!-- AC:END -->
