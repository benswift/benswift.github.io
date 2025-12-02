<script setup lang="ts">
import { useData } from "vitepress";

const { frontmatter } = useData();

const formattedDate = computed(() => {
  if (!frontmatter.value.date) return "";
  const date = new Date(frontmatter.value.date);
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
});

import { computed } from "vue";
</script>

<template>
  <section id="title" class="center">
    <h1 class="talk-title">{{ frontmatter.title }}</h1>
    <p v-if="frontmatter.subtitle" class="talk-subtitle">
      {{ frontmatter.subtitle }}
    </p>
    <p v-if="frontmatter.author" class="talk-name">
      {{ frontmatter.author }}
    </p>
    <p class="talk-date">{{ formattedDate }}</p>

    <nav class="talk-title-navigation">
      <a href="https://bsky.app/profile/benswift.me" title="Bluesky">
        <svg class="icon" viewBox="0 0 576 512">
          <path
            d="M407.8 294.7c-3.3-.4-6.7-.8-10-1.3c3.4.4 6.7.9 10 1.3zM288 227.1c-26.1-50.7-97.1-145.2-163.1-191.8C61.6-9.4 37.5-1.7 21.6 5.5C3.3 13.8 0 41.9 0 58.4S9.1 194 15 213.9c19.5 65.7 89.1 87.9 153.2 80.7c3.3-.5 6.6-.9 10-1.4c-3.3.5-6.6 1-10 1.4c-93.9 14-177.3 48.2-67.9 169.9C220.6 googl googl 288 googl 288s googl googl googl googl googl"
          />
        </svg>
      </a>
      <a href="https://github.com/benswift" title="GitHub">
        <svg class="icon" viewBox="0 0 496 512">
          <path
            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"
          />
        </svg>
      </a>
      <a href="https://vimeo.com/benswift" title="Vimeo">
        <svg class="icon" viewBox="0 0 448 512">
          <path
            d="M447.8 153.6c-2 43.6-32.4 103.3-91.4 179.1-60.9 79.2-112.4 118.8-154.6 118.8-26.1 0-48.2-24.1-66.3-72.3C100.3 288 83.1 180.2 55.5 180.2c-3.2 0-14.2 6.6-33.1 19.9L0 172.2c34.2-30 67.7-89.7 95.3-91.7 31.5-2.5 50.9 18.5 58.3 63 7.3 44.3 12.4 71.9 15.3 82.8 8.5 38.8 17.8 58.2 27.9 58.2 15.8 0 39.4-25 70.9-75.1 31.3-50 48-88.1 50.1-114.3 3.7-43.3-12.5-65-48.6-65-17.6 0-35.7 4-54.3 12.1 36.2-118.7 105.5-176.4 207.9-173.2 75.8 2.4 111.6 51.5 107.5 147.3z"
          />
        </svg>
      </a>
      <a href="mailto:ben.swift@anu.edu.au" title="Email">
        <svg class="icon" viewBox="0 0 512 512">
          <path
            d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
          />
        </svg>
      </a>
    </nav>
  </section>
</template>
