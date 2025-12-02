<script setup lang="ts">
const props = defineProps<{
  type: "error" | "warning" | "info" | "success" | "think" | "talk" | "push" | "extension";
}>();

const backgroundColours: Record<string, string> = {
  error: "#f99",
  warning: "#ffe699",
  info: "#b6daf2",
  success: "#93e7b6",
  think: "#f9cbe1",
  talk: "#aef4e6",
  push: "#ff9854",
  extension: "#dbc3e5",
};

const bgColour = backgroundColours[props.type] ?? "#b6daf2";
</script>

<template>
  <section :class="`${type}-box`" :data-background-color="bgColour">
    <h2>{{ type }}</h2>
    <slot />
  </section>
</template>
