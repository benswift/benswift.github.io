<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import TagList from "../components/TagList.vue";
import SiteFooter from "../components/SiteFooter.vue";

const { Layout } = DefaultTheme;
const { page } = useData();

const postDate = computed(() => {
    // Extract date from path: blog/YYYY/MM/DD/slug.md
    const match = page.value.relativePath.match(
        /blog\/(\d{4})\/(\d{2})\/(\d{2})\//,
    );
    if (!match) return null;
    const [, year, month, day] = match;
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
            <p v-if="postDate" class="post-date">{{ postDate }}</p>
            <TagList />
        </template>
        <template #doc-footer-before>
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
