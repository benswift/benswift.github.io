<script setup lang="ts">
import { withBase } from "vitepress";

const props = defineProps<{
  file: string;
  alt?: string;
  credit?: string;
}>();

// Ensure the file path starts with /assets/ if not already
const imageSrc = props.file.startsWith("/")
  ? props.file
  : `/assets/${props.file}`;
</script>

<template>
  <figure class="picture-container">
    <img :src="withBase(imageSrc)" :alt="alt || ''" />
    <figcaption v-if="credit" class="picture-credit">{{ credit }}</figcaption>
  </figure>
</template>

<style scoped>
.picture-container {
  position: relative;
  margin: 1rem 0;
}

.picture-container img {
  width: 100%;
  height: auto;
  display: block;
}

.picture-credit {
  position: absolute;
  bottom: 1em;
  right: 1em;
  color: #ffffff;
  font-weight: 200;
  font-size: 0.875rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.picture-credit::before {
  content: "photo: ";
}
</style>
