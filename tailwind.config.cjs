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
  plugins: [],
};
