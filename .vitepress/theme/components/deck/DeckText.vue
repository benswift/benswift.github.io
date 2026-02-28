<script setup lang="ts">

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
