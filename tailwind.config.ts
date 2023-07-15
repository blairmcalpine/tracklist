import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        elevated: "#242424",
        highlighted: "#2a2a2a",
        green: "#1ed760",
        gray: "#b3b3b3",
        explicit: "#a0a0a0",
      },
      fontFamily: {
        sans: ["Circular", "sans-serif"],
        thin: ["Circular-Thin", "sans-serif"],
      },
      boxShadow: {
        greenBorder: "0 0 0 3px #1ed760",
      },
      fontSize: {
        "2xs": ".5625rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
