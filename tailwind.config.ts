import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        script: ["DancingScript", "font-sans"],
        sans: ["Ubuntu", "font-sans"]
      },
      colors: {
        "primary-light": "#e0f0bb",
        "primary-main": "#436228",
        "primary-dark": "#154D0C",
        "secondary-light": "#9575cd",
        "secondary-main": "#673ab7",
        "secondary-dark": "#512da8"
      }
    },
  },
  plugins: [],
} satisfies Config;
