<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import RevealLayout from "./layouts/RevealLayout.vue";
import PostLayout from "./layouts/PostLayout.vue";
import GigLayout from "./layouts/GigLayout.vue";
import SiteFooter from "./components/SiteFooter.vue";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
</script>

<template>
    <RevealLayout v-if="frontmatter.layout === 'reveal'" />
    <PostLayout v-else-if="frontmatter.isPost" />
    <GigLayout v-else-if="frontmatter.isGig" />
    <Layout v-else>
        <template #doc-before>
            <h1
                v-if="frontmatter.layout === 'doc' && frontmatter.title"
                class="page-title"
            >
                {{ frontmatter.title }}
            </h1>
        </template>
        <template #doc-footer-before>
            <SiteFooter />
        </template>
        <template #layout-bottom>
            <SiteFooter v-if="frontmatter.layout === 'home'" />
        </template>
    </Layout>
</template>
