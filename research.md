---
layout: doc
title: Research
---

<script setup>
import { data as pubs } from './.vitepress/theme/bibliography.data'
import { computed } from 'vue'

// Group publications by year
const pubsByYear = computed(() => {
  const grouped = {}
  pubs.forEach(pub => {
    if (!grouped[pub.year]) grouped[pub.year] = []
    grouped[pub.year].push(pub)
  })
  return grouped
})

const years = computed(() => Object.keys(pubsByYear.value).sort((a, b) => b.localeCompare(a)))
</script>

# Research

<Picture file="images/pages/ben-soundscapes-21.webp" alt="Ben performing at Soundscapes #21" credit="Adam Thomas" />

## Research interests

I'm a livecoder, digital artist, and researcher in the
[ANU School of Cybernetics](https://cybernetics.anu.edu.au/). My research
interests include:

- **Livecoding**: Writing and modifying code in real-time as a form of artistic
  performance
- **Creative computing**: Using computation as a medium for artistic expression
- **Human-computer interaction**: Designing systems that are engaging and
  meaningful
- **AI & creativity**: Exploring the creative potential of AI systems

::: tip Come study with me

If you're interested in doing Honours/Masters/PhD research with me,
[send me an email](mailto:ben.swift@anu.edu.au). I always have a few project
ideas kicking around, but I'm also open to hearing about the project/big idea
that excites _you_. Send me:

1. A **one-paragraph** description of the project you're interested in doing
2. A **link to something you've made**: a livecoding video, a project on GitHub,
   an academic paper---even a blog post

:::

## Peer-reviewed publications

<div class="bibliography">
  <div v-for="year in years" :key="year" class="year-section">
    <h3 :id="year">{{ year }}</h3>
    <div v-for="pub in pubsByYear[year]" :key="pub.key" class="pub-item">
      <p class="pub-title">
        <a v-if="pub.doi" :href="`https://doi.org/${pub.doi}`" target="_blank">{{ pub.title }}</a>
        <a v-else-if="pub.url" :href="pub.url" target="_blank">{{ pub.title }}</a>
        <span v-else>{{ pub.title }}</span>
      </p>
      <p class="pub-authors">{{ pub.authors }}</p>
      <p v-if="pub.venue" class="pub-venue">{{ pub.venue }}</p>
    </div>
  </div>
</div>

## Curated/invited livecoding performances

See the [livecoding page](/livecoding/) for documentation of my performances.
