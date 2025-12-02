<script setup lang="ts">
import DeckSlide from "./DeckSlide.vue";

defineProps<{
  heading?: string;
  id?: string;
}>();
</script>

<template>
  <DeckSlide :id="id">
    <h2 v-if="heading">{{ heading }}</h2>
    <slot />
  </DeckSlide>
</template>
