const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sf: ["SF Pro Rounded", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        tg: {
          bg: "var(--tg-theme-bg-color)",
          text: "var(--tg-theme-text-color)",
          hint: "var(--tg-theme-hint-color)",
          link: "var(--tg-theme-link-color)",
          btn: "var(--tg-theme-button-color)",
          "btn-text": "var(--tg-theme-button-text-color)",
          "secondary-bg": "var(--tg-theme-secondary-bg-color)",
        },
      },
    },
  },
  plugins: [],
};
