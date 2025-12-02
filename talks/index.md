---
layout: doc
title: Talks
---

<script setup>
import { data as talks } from './talks.data'
</script>

# Talks

I'm often invited to give talks & presentations. Because knowledge is better
when it's shared, I've made all my slides freely available here---just click on
any of the titles below. However, often my slides don't make sense in isolation
(if I had everything I said written on my slides and just read it out my talks
would be **really boring**).

I am available as a guest speaker (and [livecoding](/livecoding/) performer) for
both scholarly and corporate events. If you're interested then
[drop me a line](mailto:ben.swift@anu.edu.au) and we can discuss making it
happen.

---

<ul class="post-list">
  <li v-for="talk in talks" :key="talk.slug" class="post-item">
    <a :href="talk.url" class="post-item-title">{{ talk.title }}</a>
    <span class="post-item-date">{{ talk.dateFormatted }}</span>
    <span v-if="talk.event" class="post-item-event"> - {{ talk.event }}</span>
  </li>
</ul>
