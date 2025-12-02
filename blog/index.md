---
layout: doc
aside: false
title: Blog
---

<script setup>
import { data } from './blog.data'
import { ref, computed } from 'vue'

const { posts, tags: allTags } = data

const currentPage = ref(1)
const perPage = 20

const totalPages = computed(() => Math.ceil(posts.length / perPage))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return posts.slice(start, start + perPage)
})
</script>

# Blog

This is my blog. Sometimes in these posts I'll talk about research or art
projects I'm involved with, sometimes I'll just ramble about other stuff which
is keeping me up at night. If you're interested in a certain topic, click on a
tag to see just the posts with that tag:

<TagList :tags="allTags" />

If anything here sparks your interest (or your ire!) then get in touch via
[email](mailto:ben.swift@anu.edu.au) or discuss on
[HN](https://news.ycombinator.com).

---

<ul class="post-list">
  <li v-for="post in paginatedPosts" :key="post.url" class="post-item">
    <a :href="post.url" class="post-item-title">{{ post.title }}</a>
    <span class="post-item-date">{{ post.date.formatted }}</span>
    <p v-if="post.excerpt" class="post-item-excerpt">{{ post.excerpt }}...</p>
  </li>
</ul>

<div class="pagination" v-if="totalPages > 1">
  <button
    @click="currentPage--"
    :disabled="currentPage === 1"
    class="pagination-link"
  >
    ← Newer
  </button>
  <span>Page {{ currentPage }} of {{ totalPages }}</span>
  <button
    @click="currentPage++"
    :disabled="currentPage === totalPages"
    class="pagination-link"
  >
    Older →
  </button>
</div>
