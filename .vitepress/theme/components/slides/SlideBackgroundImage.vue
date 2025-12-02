<script setup lang="ts">
defineProps<{
  image: string;
  heading?: string;
  bgsize?: string;
  bgpos?: string;
  id?: string;
  center?: boolean;
  alt?: string;
  bgcol?: string;
}>();
</script>

<template>
  <section
    :id="id"
    :class="{ center: center }"
    :data-background-color="bgcol"
    :data-background-image="`/assets/${image}`"
    :data-background-size="bgsize ?? 'cover'"
    :data-background-position="bgpos ?? 'center'"
    role="img"
    :aria-label="alt ?? 'fullscreen background image for slide'"
  >
    <h2 v-if="heading">{{ heading }}</h2>
    <slot />
  </section>
</template>
