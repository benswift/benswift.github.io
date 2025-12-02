<script setup lang="ts">
defineProps<{
  id: string;
  heading?: string;
}>();
</script>

<template>
  <section class="center">
    <h2 v-if="heading">{{ heading }}</h2>
    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      class="r-stretch"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </section>
</template>
