import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#245343",
        sage: "#86a58f",
        olive: "#c8d2a2",
        silver: "#d7ded9"
      }
    }
  },
  plugins: []
} satisfies Config;

