<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import SiteFooter from "../components/SiteFooter.vue";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();

const gigDate = computed(() => {
    if (!frontmatter.value.date) return null;
    const d = new Date(frontmatter.value.date);
    return d.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
});

const gigType = computed(() => {
    const t = frontmatter.value.type;
    if (!t) return null;
    return t.charAt(0).toUpperCase() + t.slice(1);
});
</script>

<template>
    <Layout>
        <template #doc-before>
            <h1>{{ frontmatter.title }}</h1>
            <p v-if="gigDate" class="post-date">{{ gigDate }}</p>

            <dl class="gig-meta">
                <template v-if="frontmatter.venue">
                    <dt>Venue</dt>
                    <dd>
                        <a
                            v-if="frontmatter.venue_url"
                            :href="frontmatter.venue_url"
                            >{{ frontmatter.venue }}</a
                        >
                        <template v-else>{{ frontmatter.venue }}</template>
                    </dd>
                </template>

                <template v-if="gigType">
                    <dt>Type</dt>
                    <dd>{{ gigType }}</dd>
                </template>

                <template v-if="frontmatter.event_url">
                    <dt>Event</dt>
                    <dd>
                        <a :href="frontmatter.event_url">Event page</a>
                    </dd>
                </template>

                <template v-if="frontmatter.video_url">
                    <dt>Video</dt>
                    <dd>
                        <a :href="frontmatter.video_url">Watch</a>
                    </dd>
                </template>

                <template v-if="frontmatter.curators">
                    <dt>Curators</dt>
                    <dd>{{ frontmatter.curators }}</dd>
                </template>

                <template v-if="frontmatter.artists">
                    <dt>Artists</dt>
                    <dd>{{ frontmatter.artists }}</dd>
                </template>
            </dl>
        </template>
        <template #doc-footer-before>
            <SiteFooter />
        </template>
    </Layout>
</template>

<style scoped>
h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.25;
    margin: 0;
}

@media (min-width: 640px) {
    h1 {
        font-size: 2.5rem;
    }
}

.post-date {
    color: var(--vp-c-text-2);
    font-style: italic;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.gig-meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25rem 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
}

.gig-meta dt {
    font-weight: 600;
    color: var(--vp-c-text-2);
}

.gig-meta dd {
    margin: 0;
}
</style>
