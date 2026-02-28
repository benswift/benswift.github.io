<script setup lang="ts">

const props = defineProps<{
  bgColor?: string;
  id?: string;
}>();

const backgroundColor = props.bgColor ?? "#262626";
</script>

<template>
  <DeckSlide :id="id" :bg-color="backgroundColor" center class="deck-impact">
    <slot />
  </DeckSlide>
</template>

<style scoped>
.deck-impact :deep(.deck-slide__content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fafafa;
  font-size: 1.8em;
  font-weight: 900;
  text-align: center;
}

.deck-impact :deep(strong) {
  color: #f39c12;
}

.deck-impact :deep(a) {
  color: #d896ff;
}

.deck-impact :deep(h1),
.deck-impact :deep(h2),
.deck-impact :deep(p) {
  background: none !important;
  color: #fafafa;
}
</style>
