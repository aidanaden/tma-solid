/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sf: ["SF Pro Rounded"],
      },
      colors: {
        tg: {
          bg: "rgb(var(--tg-theme-bg-color))",
          text: "rgb(var(--tg-theme-text-color))",
          hint: "rgb(var(--tg-theme-hint-color))",
          link: "rgb(var(--tg-theme-link-color))",
          btn: "rgb(var(--tg-theme-button-color))",
          "btn-text": "rgb(var(--tg-theme-button-text-color))",
          "secondary-bg": "rgb(var(--tg-theme-secondary-bg-color))",
        },
      },
    },
  },
  plugins: [],
};
