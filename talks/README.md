# Talks

This folder contains slide decks for presentations. There are two systems
available:

1. **reveal.js** (legacy) - uses `layout: reveal` in frontmatter
2. **Vue slide deck** (new) - uses `<SlideDeck>` component

## Vue slide deck

A simple, modern slide deck system with no heavy dependencies.

### Usage

```vue
<SlideDeck>
  <DeckTitle />
  <DeckText heading="Topic">Bullet points here</DeckText>
  <DeckSplit image="images/photo.webp" heading="Split">Text on one side</DeckSplit>
  <DeckImage image="images/bg.webp" heading="Full background" />
  <DeckImpact>**Bold statement**</DeckImpact>
</SlideDeck>
```

### Components

| Component    | Purpose                                                              |
| ------------ | -------------------------------------------------------------------- |
| `SlideDeck`  | Container with navigation, fullscreen, progress bar                  |
| `DeckTitle`  | Title slide using frontmatter (title, subtitle, author, date, event) |
| `DeckText`   | Heading with body text/bullets                                       |
| `DeckSplit`  | Half-half layout with text and image                                 |
| `DeckImage`  | Fullscreen background image with optional heading                    |
| `DeckImpact` | Large centered text for emphasis                                     |

### DeckTitle

Uses frontmatter values automatically:

```yaml
---
title: "My Talk"
subtitle: "A subtitle"
author: "Ben Swift"
date: "2025-12-02"
event: "Conference Name"
---
```

Or override with props: `<DeckTitle title="Custom Title" />`

### DeckText

```vue
<DeckText heading="My heading">

- Bullet point one
- Bullet point two

</DeckText>
```

### DeckSplit

```vue
<DeckSplit
  image="images/photo.webp"
  heading="Split layout"
  imagePosition="right"
  imageFit="cover"
>

Text content on the left side.

</DeckSplit>
```

Props:

- `image` - path to image (relative to `/assets/` or absolute)
- `heading` - optional heading text
- `imagePosition` - `"left"` or `"right"` (default: `"right"`)
- `imageFit` - `"cover"` or `"contain"` (default: `"cover"`)

### DeckImage

```vue
<DeckImage
  image="images/background.webp"
  heading="Optional heading"
  bgSize="cover"
  bgPosition="center"
  bgColor="#222"
/>
```

Props:

- `image` - path to background image
- `heading` - optional heading with semi-transparent background
- `bgSize` - CSS background-size (default: `"cover"`)
- `bgPosition` - CSS background-position (default: `"center"`)
- `bgColor` - background colour behind image

### DeckImpact

```vue
<DeckImpact bgColor="#7a538e">

**Bold statement** for emphasis

</DeckImpact>
```

Props:

- `bgColor` - background colour (default: `"#262626"`)

Use `**bold**` for orange highlighted text.

### Keyboard navigation

| Key                | Action            |
| ------------------ | ----------------- |
| → ↓ Space PageDown | Next slide        |
| ← ↑ PageUp         | Previous slide    |
| Home               | First slide       |
| End                | Last slide        |
| F                  | Toggle fullscreen |
| Escape             | Exit fullscreen   |

### Shareable URLs

Slides update the URL hash (e.g. `#slide-3`) for direct linking to specific
slides.

### Notes

- Keep slide content concise---dense slides may get clipped
- Images should be placed in `/assets/images/`
- The deck uses a 16:9 aspect ratio
