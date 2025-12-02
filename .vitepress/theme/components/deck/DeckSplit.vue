<script setup lang="ts">
import { computed } from "vue";
import DeckSlide from "./DeckSlide.vue";

const props = defineProps<{
    image?: string;
    imageAlt?: string;
    imagePosition?: "left" | "right";
    imageFit?: "cover" | "contain";
    heading?: string;
    id?: string;
}>();

const imageUrl = computed(() => {
    if (!props.image) return "";
    return props.image.startsWith("/") ? props.image : `/assets/${props.image}`;
});

const position = computed(() => props.imagePosition ?? "right");
const fit = computed(() => props.imageFit ?? "cover");
</script>

<template>
    <DeckSlide :id="id" class="deck-split">
        <div
            class="deck-split__container"
            :class="`deck-split__container--image-${position}`"
        >
            <div class="deck-split__text">
                <h2 v-if="heading">{{ heading }}</h2>
                <slot />
            </div>
            <div class="deck-split__image" v-if="image">
                <img
                    :src="imageUrl"
                    :alt="imageAlt ?? 'Slide image'"
                    :style="{ objectFit: fit }"
                />
            </div>
        </div>
    </DeckSlide>
</template>

<style scoped>
.deck-split :deep(.deck-slide__content) {
    padding: 0;
    overflow: hidden;
}

.deck-split__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    height: 100%;
}

.deck-split__container--image-left {
    grid-template-columns: 1fr 1fr;
}

.deck-split__container--image-left .deck-split__image {
    order: -1;
}

.deck-split__text {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: auto;
}

.deck-split__text h2 {
    margin-top: 0;
}

.deck-split__image {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    overflow: hidden;
}

.deck-split__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
