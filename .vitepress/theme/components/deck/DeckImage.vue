<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  image: string;
  heading?: string;
  alt?: string;
  bgSize?: string;
  bgPosition?: string;
  bgColor?: string;
  id?: string;
  overlay?: boolean;
}>();

const imageUrl = computed(() => {
  return props.image.startsWith("/") ? props.image : `/assets/${props.image}`;
});
</script>

<template>
  <DeckSlide
    :id="id"
    :bg-image="image"
    :bg-size="bgSize ?? 'cover'"
    :bg-position="bgPosition ?? 'center'"
    :bg-color="bgColor"
    center
    class="deck-image"
  >
    <div v-if="overlay" class="deck-image__overlay" />
    <h2 v-if="heading" class="deck-image__heading">{{ heading }}</h2>
    <slot />
  </DeckSlide>
</template>

<style scoped>
.deck-image :deep(.deck-slide__content) {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 2rem 3rem;
}

.deck-image__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.deck-image__heading {
  background-color: rgba(255, 255, 255, 0.9) !important;
  padding: 0.3em 0.6em !important;
  margin: 0 !important;
  display: inline-block !important;
}
</style>
