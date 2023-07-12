import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        green: "#1ed760",
        gray: "#b3b3b3",
      },
      fontFamily: {
        sans: ["Circular", "sans-serif"],
        thin: ["Circular-Thin", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
