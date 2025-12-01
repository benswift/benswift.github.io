<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import RevealLayout from "./layouts/RevealLayout.vue";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
</script>

<template>
  <RevealLayout v-if="frontmatter.layout === 'reveal'" />
  <Layout v-else />
</template>
