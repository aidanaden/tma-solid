import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
} from "unocss";
import { presetScrollbarHide } from "unocss-preset-scrollbar-hide";

export default defineConfig({
  transformers: [transformerDirectives()],
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetScrollbarHide(),
  ],
  theme: {
    extend: {
      fontFamily: {
        sf: ["SF Pro Rounded"],
      },

      colors: {
        tg: {
          bg: "var(--telegram-bg-color)",
          text: "var(--telegram-text-color)",
          hint: "var(--telegram-hint-color)",
          link: "var(--telegram-link-color)",
          btn: "var(--telegram-button-color)",
          "btn-text": "var(--telegram-button-text-color)",
          "secondary-bg": "var(--telegram-secondary-bg-color)",
        },
      },
    },
  },
});
