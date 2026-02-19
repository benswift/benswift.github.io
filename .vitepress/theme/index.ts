import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";

// Custom Layout wrapper
import Layout from "./Layout.vue";

// Custom components
import YouTube from "./components/YouTube.vue";
import Picture from "./components/Picture.vue";
import TagList from "./components/TagList.vue";
import ForCodesTable from "./components/ForCodesTable.vue";
import NeonPerceptron from "./components/NeonPerceptron.vue";
import CitePost from "./components/CitePost.vue";

// Slide components for reveal.js presentations
import SlideTitle from "./components/slides/SlideTitle.vue";
import SlideBackgroundImage from "./components/slides/SlideBackgroundImage.vue";
import SlideImpact from "./components/slides/SlideImpact.vue";
import SlideFin from "./components/slides/SlideFin.vue";
import SlideYouTube from "./components/slides/SlideYouTube.vue";
import SlideBox from "./components/slides/SlideBox.vue";
import SlideImageCredit from "./components/slides/SlideImageCredit.vue";
import SlideQuestions from "./components/slides/SlideQuestions.vue";
import SlideStackedPapers from "./components/slides/SlideStackedPapers.vue";
import SlideAckCountry from "./components/slides/SlideAckCountry.vue";

// Vue-based slide deck components (reveal.js replacement)
import {
  SlideDeck,
  DeckSlide,
  DeckTitle,
  DeckText,
  DeckSplit,
  DeckImage,
  DeckImpact,
} from "./components/deck";

// Fonts (Atkinson Hyperlegible - variable fonts for flexibility)
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css";
import "@fontsource-variable/atkinson-hyperlegible-mono";
import "@fontsource-variable/atkinson-hyperlegible-mono/wght-italic.css";

// Custom styles
import "./styles/custom.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Register global components
    app.component("YouTube", YouTube);
    app.component("Picture", Picture);
    app.component("TagList", TagList);
    app.component("ForCodesTable", ForCodesTable);
    app.component("NeonPerceptron", NeonPerceptron);
    app.component("CitePost", CitePost);

    // Register slide components (for use in reveal.js presentations)
    app.component("SlideTitle", SlideTitle);
    app.component("SlideBackgroundImage", SlideBackgroundImage);
    app.component("SlideImpact", SlideImpact);
    app.component("SlideFin", SlideFin);
    app.component("SlideYouTube", SlideYouTube);
    app.component("SlideBox", SlideBox);
    app.component("SlideImageCredit", SlideImageCredit);
    app.component("SlideQuestions", SlideQuestions);
    app.component("SlideStackedPapers", SlideStackedPapers);
    app.component("SlideAckCountry", SlideAckCountry);

    // Register Vue-based slide deck components
    app.component("SlideDeck", SlideDeck);
    app.component("DeckSlide", DeckSlide);
    app.component("DeckTitle", DeckTitle);
    app.component("DeckText", DeckText);
    app.component("DeckSplit", DeckSplit);
    app.component("DeckImage", DeckImage);
    app.component("DeckImpact", DeckImpact);
  },
} satisfies Theme;
