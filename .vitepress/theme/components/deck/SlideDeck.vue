<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, watch } from "vue";
import { useRoute, useRouter } from "vitepress";

const props = defineProps<{
    aspectRatio?: string;
}>();

const route = useRoute();
const router = useRouter();

const currentSlide = ref(0);
const totalSlides = ref(0);
const isFullscreen = ref(false);
const deckRef = ref<HTMLElement | null>(null);

const slideRefs = ref<HTMLElement[]>([]);

const registerSlide = (el: HTMLElement | null) => {
    if (el && !slideRefs.value.includes(el)) {
        slideRefs.value.push(el);
        totalSlides.value = slideRefs.value.length;
    }
};

provide("registerSlide", registerSlide);
provide("currentSlide", currentSlide);

const aspectRatioStyle = computed(() => {
    const ratio = props.aspectRatio ?? "16/9";
    return { aspectRatio: ratio };
});

const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides.value) {
        currentSlide.value = index;
        updateHash(index);
    }
};

const nextSlide = () => {
    if (currentSlide.value < totalSlides.value - 1) {
        goToSlide(currentSlide.value + 1);
    }
};

const prevSlide = () => {
    if (currentSlide.value > 0) {
        goToSlide(currentSlide.value - 1);
    }
};

const toggleFullscreen = async () => {
    if (!deckRef.value) return;

    if (!document.fullscreenElement) {
        await deckRef.value.requestFullscreen();
        isFullscreen.value = true;
    } else {
        await document.exitFullscreen();
        isFullscreen.value = false;
    }
};

const updateHash = (index: number) => {
    const newHash = index > 0 ? `#slide-${index + 1}` : "";
    if (window.location.hash !== newHash) {
        history.replaceState(null, "", newHash || window.location.pathname);
    }
};

const parseHashSlide = (): number => {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
        const slideNum = parseInt(match[1], 10);
        return Math.max(0, slideNum - 1);
    }
    return 0;
};

const handleKeydown = (e: KeyboardEvent) => {
    if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
    ) {
        return;
    }

    switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
            e.preventDefault();
            nextSlide();
            break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
            e.preventDefault();
            prevSlide();
            break;
        case "Home":
            e.preventDefault();
            goToSlide(0);
            break;
        case "End":
            e.preventDefault();
            goToSlide(totalSlides.value - 1);
            break;
        case "f":
        case "F":
            e.preventDefault();
            toggleFullscreen();
            break;
        case "Escape":
            if (isFullscreen.value) {
                document.exitFullscreen();
            }
            break;
    }
};

const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
};

const handleHashChange = () => {
    const slideIndex = parseHashSlide();
    if (slideIndex !== currentSlide.value && slideIndex < totalSlides.value) {
        currentSlide.value = slideIndex;
    }
};

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("hashchange", handleHashChange);

    setTimeout(() => {
        const initialSlide = parseHashSlide();
        if (initialSlide < totalSlides.value) {
            currentSlide.value = initialSlide;
        }
    }, 0);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    window.removeEventListener("hashchange", handleHashChange);
});

const progress = computed(() => {
    if (totalSlides.value <= 1) return 0;
    return (currentSlide.value / (totalSlides.value - 1)) * 100;
});

watch(currentSlide, () => {
    if (deckRef.value) {
        deckRef.value.querySelectorAll("*").forEach((el) => {
            if (el instanceof HTMLElement && el.scrollTop > 0) {
                el.scrollTop = 0;
            }
        });
    }
});
</script>

<template>
    <div
        ref="deckRef"
        class="slide-deck"
        :class="{ 'slide-deck--fullscreen': isFullscreen }"
    >
        <div class="slide-deck__viewport" :style="aspectRatioStyle">
            <div class="slide-deck__slides">
                <slot />
            </div>
        </div>

        <div class="slide-deck__controls">
            <button
                class="slide-deck__nav slide-deck__nav--prev"
                :disabled="currentSlide === 0"
                @click="prevSlide"
                aria-label="Previous slide"
            >
                ←
            </button>

            <span class="slide-deck__counter">
                {{ currentSlide + 1 }} / {{ totalSlides }}
            </span>

            <button
                class="slide-deck__nav slide-deck__nav--next"
                :disabled="currentSlide === totalSlides - 1"
                @click="nextSlide"
                aria-label="Next slide"
            >
                →
            </button>

            <button
                class="slide-deck__fullscreen"
                @click="toggleFullscreen"
                :aria-label="
                    isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                "
            >
                {{ isFullscreen ? "⛶" : "⛶" }}
            </button>
        </div>

        <div class="slide-deck__progress">
            <div
                class="slide-deck__progress-bar"
                :style="{ width: `${progress}%` }"
            />
        </div>
    </div>
</template>

<style scoped>
.slide-deck {
    --deck-bg: #fafafa;
    --deck-text: #333;
    --deck-highlight: #be2edd;
    --deck-control-bg: rgba(0, 0, 0, 0.7);
    --deck-control-text: #fff;

    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    background: var(--deck-bg);
    font-family:
        "Atkinson Hyperlegible Next Variable",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        sans-serif;
}

.slide-deck--fullscreen {
    position: fixed;
    inset: 0;
    max-width: none;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #000;
}

.slide-deck__viewport {
    position: relative;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    background: var(--deck-bg);
}

.slide-deck--fullscreen .slide-deck__viewport {
    max-height: calc(100vh - 60px);
    width: auto;
    height: calc(100vh - 60px);
}

.slide-deck__slides {
    position: relative;
    width: 100%;
    height: 100%;
}

.slide-deck__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--deck-control-bg);
    color: var(--deck-control-text);
}

.slide-deck__nav,
.slide-deck__fullscreen {
    background: transparent;
    border: 1px solid var(--deck-control-text);
    color: var(--deck-control-text);
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    font-size: 1rem;
    transition:
        background-color 0.2s,
        opacity 0.2s;
}

.slide-deck__nav:hover:not(:disabled),
.slide-deck__fullscreen:hover {
    background: rgba(255, 255, 255, 0.2);
}

.slide-deck__nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.slide-deck__counter {
    font-size: 0.9rem;
    min-width: 5rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
}

.slide-deck__progress {
    height: 4px;
    background: rgba(0, 0, 0, 0.2);
}

.slide-deck__progress-bar {
    height: 100%;
    background: var(--deck-highlight);
    transition: width 0.3s ease;
}
</style>
