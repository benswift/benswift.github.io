<script setup lang="ts">
defineProps<{
  imagePath: string;
  link?: string;
  alt?: string;
  width?: string;
  id?: string;
}>();
</script>

<template>
  <section :id="id">
    <div class="stacked-paper" :style="width ? { width } : {}">
      <a v-if="link" :href="link">
        <img :src="imagePath" :alt="alt ?? 'stacked paper image'" />
      </a>
      <img v-else :src="imagePath" :alt="alt ?? 'stacked paper image'" />
    </div>
    <slot />
  </section>
</template>
