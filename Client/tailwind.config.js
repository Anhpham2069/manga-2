/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#4176ed",
        "text-color": "#D9E4FB",
        text_darkMode: "#e4e6eb",
        "primary-color": "#5585EF",
        "bd-color": "#A2BCF6",
        bg_dark: "#1A1A1A",
        bg_light: "#E8EBF5",
        bg_dark_light: "#242526",
        bg_hover: "#E6F4FF",
      },
      height: {
        440: "28rem",
      },
      screens: {
        phone: "390px",
        // => @media (min-width: 390px) { ... }

        tablet: "640px",
        // => @media (min-width: 640px) { ... }

        laptop: "1024px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1280px",
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
};
