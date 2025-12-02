<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import DeckSlide from "./DeckSlide.vue";

const props = defineProps<{
  title?: string;
  subtitle?: string;
  author?: string;
  date?: string;
  event?: string;
}>();

const { frontmatter } = useData();

const displayTitle = computed(() => props.title ?? frontmatter.value.title);
const displaySubtitle = computed(() => props.subtitle ?? frontmatter.value.subtitle);
const displayAuthor = computed(() => props.author ?? frontmatter.value.author);
const displayEvent = computed(() => props.event ?? frontmatter.value.event);

const formattedDate = computed(() => {
  const dateValue = props.date ?? frontmatter.value.date;
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});
</script>

<template>
  <DeckSlide center>
    <h1 class="deck-title__heading">{{ displayTitle }}</h1>
    <p v-if="displaySubtitle" class="deck-title__subtitle">
      {{ displaySubtitle }}
    </p>
    <p v-if="displayAuthor" class="deck-title__author">
      {{ displayAuthor }}
    </p>
    <p v-if="displayEvent" class="deck-title__event">
      {{ displayEvent }}
    </p>
    <p v-if="formattedDate" class="deck-title__date">
      {{ formattedDate }}
    </p>
    <slot />
  </DeckSlide>
</template>

<style scoped>
.deck-title__heading {
  font-size: 2.5em !important;
  margin-bottom: 0.3em !important;
  border-bottom: none !important;
}

.deck-title__subtitle {
  font-size: 1.3em;
  color: #555;
  margin-bottom: 1em !important;
}

.deck-title__author {
  font-size: 1.1em;
  font-weight: 700;
  margin-bottom: 0.3em !important;
}

.deck-title__event {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.3em !important;
}

.deck-title__date {
  font-size: 0.9em;
  font-style: italic;
  color: #888;
}
</style>
