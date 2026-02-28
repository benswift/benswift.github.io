<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();

const postDate = computed(() => {
    if (!frontmatter.value.date) return null;
    const d = new Date(frontmatter.value.date);
    return d.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "2-digit",
    });
});
</script>

<template>
    <Layout>
        <template #doc-before>
            <h1 class="page-title">{{ frontmatter.title }}</h1>
            <p v-if="postDate" class="post-date">{{ postDate }}</p>
            <TagList />
        </template>
        <template #doc-footer-before>
            <CitePost />
            <SiteFooter />
        </template>
    </Layout>
</template>

<style scoped>
.post-date {
    color: var(--vp-c-text-2);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}
</style>
