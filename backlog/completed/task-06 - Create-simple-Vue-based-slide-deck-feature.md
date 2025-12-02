---
id: task-06
title: Create simple Vue-based slide deck feature
status: Done
assignee: []
created_date: "2025-12-01 23:36"
updated_date: "2025-12-02 02:12"
labels:
  - vitepress
  - feature
  - talks
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->

Replace the reveal.js slide system with a simple, modern Vue-based slide deck
that supports basic presentation needs.

## Goals

- Simple, maintainable code (no heavy dependencies like reveal.js)
- Works well with VitePress
- Keyboard navigation (arrow keys, escape)
- Basic slide templates covering common use cases
- No speaker notes needed

## Slide templates needed

1. **Title slide** - Talk title, subtitle, author, date
2. **Text + heading** - Heading with body text/bullets
3. **Half-half (text/image)** - Split layout with text on one side, image on
   other
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

- [x] #1 SlideDeck container component with keyboard navigation
- [x] #2 Title slide template
- [x] #3 Text + heading slide template
- [x] #4 Half-half (text/image) slide template
- [x] #5 Fullscreen image slide template
- [x] #6 Impact/quote slide template
- [x] #7 Works in VitePress markdown files
- [x] #8 Shareable URLs with slide position
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->

## Implementation completed

Created a Vue-based slide deck system with the following components:

### Core components

- `SlideDeck.vue` - Container with keyboard navigation (arrows, space, f for
  fullscreen), URL hash support (#slide-N), progress bar, and fullscreen mode
- `DeckSlide.vue` - Base slide component with background image/colour support

### Slide templates

- `DeckTitle.vue` - Title slide using frontmatter (title, subtitle, author,
  date, event)
- `DeckText.vue` - Heading with body text/bullets
- `DeckSplit.vue` - Half-half layout (text/image) with configurable image
  position
- `DeckImage.vue` - Fullscreen background image with optional heading overlay
- `DeckImpact.vue` - Large centered text on dark background for emphasis

### Usage in markdown

```vue
<SlideDeck>
  <DeckTitle />
  <DeckText heading="My Slide">Content here</DeckText>
  <DeckSplit image="path/to/image.jpg" heading="Split">Text content</DeckSplit>
  <DeckImage image="path/to/bg.jpg" heading="Background" />
  <DeckImpact>**Bold statement**</DeckImpact>
</SlideDeck>
```

### Key features

- No reveal.js dependency
- Keyboard navigation: arrows, space, PageUp/Down, Home/End, F for fullscreen
- Shareable URLs with #slide-N hash
- Progress bar
- Responsive sizing with 16:9 aspect ratio
- Automatic scroll reset when changing slides
<!-- SECTION:NOTES:END -->
