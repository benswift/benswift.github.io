import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";

// Custom components
import YouTube from "./components/YouTube.vue";
import Picture from "./components/Picture.vue";
import TagList from "./components/TagList.vue";

// Custom styles
import "./styles/custom.scss";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    app.component("YouTube", YouTube);
    app.component("Picture", Picture);
    app.component("TagList", TagList);
  },
} satisfies Theme;
