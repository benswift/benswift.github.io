<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div class="youtube-embed">
    <div class="youtube-embed-container">
      <iframe
        :src="`https://www.youtube.com/embed/${id}`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />
    </div>
  </div>
</template>

<style scoped>
.youtube-embed {
  width: 100%;
  margin: 0 auto 1rem;
}

.youtube-embed-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
}

.youtube-embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
