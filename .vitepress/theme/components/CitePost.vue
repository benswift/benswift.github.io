<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { generateBibtex, generateCiteKey } from "../../utils/citation";

const { frontmatter, page } = useData();
const copied = ref(false);

const postUrl = computed(
    () =>
        `https://benswift.me/${page.value.relativePath.replace(/\.md$/, "")}`,
);

const year = computed(() => frontmatter.value.date?.split("-")[0] ?? "");
const month = computed(() => frontmatter.value.date?.split("-")[1] ?? "");

const slug = computed(() => {
    const match = page.value.relativePath.match(
        /blog\/\d{4}\/\d{2}\/\d{2}\/(.+)\.md$/,
    );
    return match?.[1] ?? "post";
});

const citeKey = computed(() => generateCiteKey(year.value, slug.value));

const bibtex = computed(() =>
    generateBibtex({
        citeKey: citeKey.value,
        author: "Ben Swift",
        title: frontmatter.value.title ?? "",
        url: postUrl.value,
        year: year.value,
        month: month.value,
        atUri: frontmatter.value.atUri,
    }),
);

async function copyBibtex() {
    await navigator.clipboard.writeText(bibtex.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
    <details class="cite-post">
        <summary>Cite this post</summary>
        <div class="cite-content">
            <pre><code>{{ bibtex }}</code></pre>
            <button class="cite-copy" @click="copyBibtex">
                {{ copied ? "Copied" : "Copy BibTeX" }}
            </button>
        </div>
    </details>
</template>

<style scoped>
.cite-post {
    margin-top: 2rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    padding: 0.75rem 1rem;
}

.cite-post summary {
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    user-select: none;
}

.cite-content {
    margin-top: 0.75rem;
}

.cite-content pre {
    background: var(--vp-c-bg-soft);
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.8rem;
    line-height: 1.5;
}

.cite-copy {
    margin-top: 0.5rem;
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: all 0.2s ease;
}

.cite-copy:hover {
    color: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
}
</style>
