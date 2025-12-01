<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, watch } from "vue";
import { useData, useRoute, inBrowser } from "vitepress";

// CSS imports as inline strings - injected dynamically to avoid polluting global styles
import resetCss from "reveal.js/dist/reset.css?inline";
import revealCss from "reveal.js/dist/reveal.css?inline";
import themeCss from "../styles/reveal-theme.css?inline";

const { frontmatter } = useData();
const route = useRoute();
const revealRef = ref<HTMLElement | null>(null);
const slidesRef = ref<HTMLElement | null>(null);
let deck: unknown = null;

function revealifyContent() {
    if (!slidesRef.value) return;

    const slides = slidesRef.value;

    // Get all direct children that aren't already sections
    const children = Array.from(slides.children);
    let currentSection: HTMLElement | null = null;
    const fragment = document.createDocumentFragment();

    for (const child of children) {
        const tagName = child.tagName.toLowerCase();

        // Section elements pass through as-is
        if (tagName === "section") {
            if (currentSection) {
                fragment.appendChild(currentSection);
                currentSection = null;
            }
            fragment.appendChild(child.cloneNode(true));
            continue;
        }

        // h1, h2, hr create new sections
        if (tagName === "h1" || tagName === "h2" || tagName === "hr") {
            if (currentSection) {
                fragment.appendChild(currentSection);
            }

            currentSection = document.createElement("section");

            // Hoist data-* and class attributes from the element to section
            const attrsToHoist = ["class", "id"];
            for (const attr of child.attributes) {
                if (
                    attr.name.startsWith("data-") ||
                    attrsToHoist.includes(attr.name)
                ) {
                    currentSection.setAttribute(attr.name, attr.value);
                    // Don't remove from child - keep id on heading for linking
                    if (attr.name !== "id") {
                        child.removeAttribute(attr.name);
                    }
                }
            }

            // hr elements are just split markers, don't add them to the section
            if (tagName !== "hr") {
                currentSection.appendChild(child.cloneNode(true));
            }
            continue;
        }

        // Other elements go into current section
        if (currentSection) {
            currentSection.appendChild(child.cloneNode(true));
        } else {
            // Content before first heading - create a section for it
            currentSection = document.createElement("section");
            currentSection.appendChild(child.cloneNode(true));
        }
    }

    // Don't forget the last section
    if (currentSection) {
        fragment.appendChild(currentSection);
    }

    // Replace slides content
    slides.innerHTML = "";
    slides.appendChild(fragment);
}

async function initReveal() {
    if (!inBrowser) return;

    await nextTick();

    // Transform content into sections
    revealifyContent();

    await nextTick();

    if (revealRef.value) {
        // Dynamically import reveal.js only on client side
        const Reveal = (await import("reveal.js")).default;
        const RevealMath = (await import("reveal.js/plugin/math/math.esm.js"))
            .default;

        // Destroy existing deck if any
        if (deck) {
            (deck as { destroy: () => void }).destroy();
        }

        deck = new Reveal(revealRef.value, {
            width: 1920,
            height: 1080,
            margin: 0.1,
            center: false,
            controls: false,
            transition: "none",
            history: true,
            slideNumber: true,
            plugins: [RevealMath],
            math: {
                mathjax:
                    "https://cdn.jsdelivr.net/gh/mathjax/mathjax@2.7.8/MathJax.js",
                config: "TeX-AMS_HTML-full",
            },
        });

        await (deck as { initialize: () => Promise<void> }).initialize();
    }
}

// Inject reveal.js styles dynamically
let styleElements: HTMLStyleElement[] = [];

function injectStyles() {
    if (!inBrowser || styleElements.length > 0) return;

    const styles = [resetCss, revealCss, themeCss];
    styles.forEach((css, i) => {
        const style = document.createElement("style");
        style.setAttribute("data-reveal-style", String(i));
        style.textContent = css;
        document.head.appendChild(style);
        styleElements.push(style);
    });
}

function removeStyles() {
    styleElements.forEach((style) => style.remove());
    styleElements = [];
}

onMounted(() => {
    injectStyles();
    initReveal();
});

// Re-initialize on route change (for SPA navigation)
watch(
    () => route.path,
    () => {
        initReveal();
    },
);

onUnmounted(() => {
    if (deck) {
        (deck as { destroy: () => void }).destroy();
        deck = null;
    }
    removeStyles();
});
</script>

<template>
    <div class="reveal-container">
        <div ref="revealRef" class="reveal">
            <div ref="slidesRef" class="slides">
                <Content />
            </div>
        </div>
    </div>
</template>

<style scoped>
.reveal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: var(--reveal-background-color, #fafafa);
}
</style>
