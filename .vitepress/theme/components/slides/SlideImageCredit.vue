<script setup lang="ts">
defineProps<{
  artist?: string;
  title?: string;
  year?: string;
  style?: string;
}>();
</script>

<template>
  <div class="image-credit" :style="style">
    <p v-if="artist" class="image-credit-artist">{{ artist }}</p>
    <p v-if="title" class="image-credit-title">{{ title }}</p>
    <p v-if="year" class="image-credit-year">{{ year }}</p>
    <slot />
  </div>
</template>
