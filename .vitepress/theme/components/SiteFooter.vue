<script setup lang="ts">
import { useData } from "vitepress";
import { Icon } from "@iconify/vue";

const { page } = useData();

const cafeUrls = [
    "https://tilleys.com.au",
    "https://www.harvestcoffee.com.au",
    "https://www.facebook.com/goodbrothercbr",
    "https://frontgallerycafe.com",
    "https://redbrick.coffee",
];

function randomCafe(event: Event) {
    event.preventDefault();
    window.location.href =
        cafeUrls[Math.floor(Math.random() * cafeUrls.length)];
}

const repoBase = "https://github.com/benswift/benswift.github.io";
</script>

<template>
    <footer class="site-footer">
        <p>
            designed &amp; built with
            <a href="https://vitepress.dev" title="VitePress website"
                ><Icon icon="fa6-solid:bolt" inline /></a
            >,
            <a
                href="#"
                @click="randomCafe"
                title="See Ben's favourite coffee shops"
                ><Icon icon="fa6-solid:mug-hot" inline
            /></a>
            and
            <a
                href="https://www.youtube.com/watch?v=6H2FRxvsd2M"
                title="What is love?"
                ><Icon icon="fa6-solid:heart" inline
            /></a>
            on unceded
            <a href="https://www.nca.gov.au/welcome-ngunnawal-country"
                >Ngunnawal Country</a
            >
            by Ben Swift
        </p>

        <p class="footer-links">
            <a
                rel="license"
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                class="licence"
                aria-label="Creative Commons Attribution-ShareAlike 4.0 licence"
                >cc by-sa</a
            >
            ·
            <a :href="`${repoBase}/blob/main/${page.relativePath}`">source</a>
            ·
            <a :href="`${repoBase}/commits/main/${page.relativePath}`"
                >history</a
            >
        </p>
    </footer>
</template>

<style scoped>
.site-footer {
    border-top: 1px solid var(--vp-c-divider);
    padding: 1.5rem 0;
    margin-top: 2rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
}

.site-footer p {
    margin: 0.5rem 0;
}

.site-footer a {
    color: var(--vp-c-text-2);
    transition: color 0.2s ease;
}

.site-footer a:hover {
    color: var(--vp-c-brand-1);
}

.site-footer svg {
    display: inline-block !important;
    vertical-align: -0.125em;
}

.footer-links {
    font-family: var(--vp-font-family-mono);
    font-size: 0.8rem;
}
</style>
