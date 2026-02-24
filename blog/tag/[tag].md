---
layout: doc
aside: false
---

<script setup>
import { useData } from 'vitepress'
import { data } from '../blog.data'

const { posts: allPosts } = data
import { computed, ref } from 'vue'

const { params } = useData()

const posts = computed(() =>
  allPosts.filter(post => post.tags.includes(params.value.tag))
)

const currentPage = ref(1)
const perPage = 20

const totalPages = computed(() => Math.ceil(posts.value.length / perPage))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return posts.value.slice(start, start + perPage)
})
</script>

<p>{{ posts.length }} post{{ posts.length === 1 ? '' : 's' }} with this tag.</p>

<a href="/blog/">← Back to all posts</a>

---

<ul class="post-list">
  <li v-for="post in paginatedPosts" :key="post.url" class="post-item">
    <a :href="post.url" class="post-item-title">{{ post.title }}</a>
    <span class="post-item-date">{{ post.date.formatted }}</span>
    <TagList v-if="post.tags.length" :tags="post.tags" class="post-item-tags" />
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
