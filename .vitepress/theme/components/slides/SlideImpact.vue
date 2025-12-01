<script setup lang="ts">
defineProps<{
  id?: string;
  bgcol?: string;
}>();
</script>

<template>
  <section
    class="impact center"
    :id="id"
    :data-background-color="bgcol ?? '#262626'"
  >
    <slot />
  </section>
</template>
