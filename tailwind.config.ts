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
    },
  },
  plugins: [],
} satisfies Config;
