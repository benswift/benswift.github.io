<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const props = defineProps<{
    tags?: string[];
}>();

const { frontmatter } = useData();
const tags = computed(() => props.tags || frontmatter.value.tags || []);
</script>

<template>
    <p v-if="tags && tags.length > 0" class="tag-container">
        <a
            v-for="tag in tags"
            :key="tag"
            :href="withBase(`/blog/tag/${tag}`)"
            class="tag"
        >
            {{ tag }}
        </a>
    </p>
</template>

<style scoped>
.tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.5rem 0;
}

.tag {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: var(--vp-c-bg-soft);
    border-radius: 4px;
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition:
        background-color 0.2s,
        color 0.2s;
}

.tag:hover {
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}
</style>
