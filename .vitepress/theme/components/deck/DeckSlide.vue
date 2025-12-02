<script setup lang="ts">
import { inject, ref, onMounted, computed, type Ref } from "vue";

const props = defineProps<{
    id?: string;
    bgColor?: string;
    bgImage?: string;
    bgSize?: string;
    bgPosition?: string;
    center?: boolean;
}>();

const slideEl = ref<HTMLElement | null>(null);
const slideIndex = ref(-1);

const registerSlide = inject<(el: HTMLElement | null) => void>("registerSlide");
const currentSlide = inject<Ref<number>>("currentSlide");

onMounted(() => {
    if (slideEl.value && registerSlide) {
        const parent = slideEl.value.parentElement;
        if (parent) {
            const slides = Array.from(
                parent.querySelectorAll(":scope > .deck-slide"),
            );
            slideIndex.value = slides.indexOf(slideEl.value);
        }
        registerSlide(slideEl.value);
    }
});

const isActive = computed(() => {
    return currentSlide?.value === slideIndex.value;
});

const backgroundStyle = computed(() => {
    const style: Record<string, string> = {};

    if (props.bgColor) {
        style.backgroundColor = props.bgColor;
    }

    if (props.bgImage) {
        const imagePath = props.bgImage.startsWith("/")
            ? props.bgImage
            : `/assets/${props.bgImage}`;
        style.backgroundImage = `url(${imagePath})`;
        style.backgroundSize = props.bgSize ?? "cover";
        style.backgroundPosition = props.bgPosition ?? "center";
        style.backgroundRepeat = "no-repeat";
    }

    return style;
});
</script>

<template>
    <div
        ref="slideEl"
        class="deck-slide"
        :class="{
            'deck-slide--active': isActive,
            'deck-slide--center': center,
            'deck-slide--has-bg-image': bgImage,
        }"
        :id="id"
        :style="backgroundStyle"
    >
        <div class="deck-slide__content">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.deck-slide {
    position: absolute;
    inset: 0;
    display: none;
    padding: 2rem 3rem;
    overflow: hidden;
    font-size: clamp(16px, 2.5vw, 32px);
    line-height: 1.4;
    color: var(--deck-text, #333);
    background-color: var(--deck-bg, #fafafa);
}

.deck-slide--active {
    display: block;
}

.deck-slide--center {
    text-align: center;
}

.deck-slide--center .deck-slide__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.deck-slide__content {
    height: 100%;
    overflow: hidden;
}

.deck-slide--has-bg-image :deep(h1),
.deck-slide--has-bg-image :deep(h2),
.deck-slide--has-bg-image :deep(h3),
.deck-slide--has-bg-image :deep(p),
.deck-slide--has-bg-image :deep(blockquote) {
    background-color: rgba(255, 255, 255, 0.9);
    display: inline-block;
    padding: 0.2em 0.4em;
}

.deck-slide :deep(h1) {
    font-size: 2em;
    font-weight: 900;
    margin: 0 0 0.5em;
    border-bottom: 5px solid var(--deck-highlight, #be2edd);
}

.deck-slide :deep(h2) {
    font-size: 1.5em;
    font-weight: 900;
    margin: 0 0 0.5em;
}

.deck-slide :deep(h3) {
    font-size: 1.2em;
    font-weight: 700;
    margin: 0 0 0.5em;
}

.deck-slide :deep(p) {
    margin: 0 0 0.75em;
}

.deck-slide :deep(ul),
.deck-slide :deep(ol) {
    margin: 0 0 0.75em;
    padding-left: 1.5em;
}

.deck-slide :deep(li) {
    margin-bottom: 0.3em;
}

.deck-slide :deep(a) {
    color: #7a538e;
    text-decoration: none;
    font-weight: 700;
}

.deck-slide :deep(a:hover) {
    text-decoration: underline;
}

.deck-slide :deep(code) {
    font-family: "Atkinson Hyperlegible Mono Variable", monospace;
    padding: 0.1em 0.3em;
    border-radius: 0.2em;
    background: linear-gradient(to right, #f5e1fc, #f0d4fa);
    color: #a81fce;
}

.deck-slide :deep(pre) {
    background: #282c34;
    padding: 1em;
    border-radius: 0.5em;
    overflow-x: auto;
}

.deck-slide :deep(pre code) {
    background: none;
    color: #fafafa;
    padding: 0;
}

.deck-slide :deep(blockquote) {
    background-color: #ebebeb;
    border-left: 5px solid #888;
    padding: 0.5em 1em;
    margin: 0 0 0.75em;
    font-style: italic;
}

.deck-slide :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 0.75em;
}

.deck-slide :deep(th),
.deck-slide :deep(td) {
    padding: 0.5em 1em 0.5em 0;
    text-align: left;
}

.deck-slide :deep(thead th) {
    border-bottom: 2px solid var(--deck-highlight, #be2edd);
}

.deck-slide :deep(img) {
    max-width: 100%;
    max-height: 70%;
    object-fit: contain;
}

.deck-slide :deep(strong) {
    font-weight: 900;
}

.deck-slide :deep(em) {
    font-style: italic;
}
</style>
