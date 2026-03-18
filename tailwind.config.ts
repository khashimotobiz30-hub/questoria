import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "cyber-black": "#0A0A0F",
        "cyber-cyan": "#00E5FF",
        "cyber-gold": "#FFD700",
        "cyber-purple": "#9C27B0",
        "cyber-dark": "#12121A",
      },
    },
  },
  plugins: [],
};

export default config;
