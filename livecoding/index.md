---
layout: doc
title: Livecoding
---

<script setup>
import { data as gigs } from './livecoding.data'
</script>

# Livecoding

<Picture file="images/livecoding/smcclab-live-1.webp" alt="Livecoding performance at SMCClab live #1 in Nov 2025" />

The nature of livecoding is that it is performed (improvised) in-the-moment; the
gig (performance) _is_ the output (that's why it's called **live**coding), and
any artefact (e.g. a video recording) is useful documentation, but only a trace
of the work itself.

Still, documentation is an important part of one's artistic practice, so here's
a bunch of photos and videos from my gigs. Some of them are nice &
slick-looking, some of them are super-grungy videos shot on smartphones in the
crowd. Although I'm working hard to track down any old videos, some of these
gigs are lost to time. I like to assume that they were the best ones ;)

---

<ul class="post-list">
  <li v-for="gig in gigs" :key="gig.slug" class="post-item">
    <a :href="gig.url" class="post-item-title">{{ gig.title }}</a>
    <span class="post-item-date">{{ gig.dateFormatted }}</span>
    <span v-if="gig.venue" class="post-item-venue"> - {{ gig.venue }}</span>
  </li>
</ul>
