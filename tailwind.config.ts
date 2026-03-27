import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bayou-lime': '#00FF00',
        'deep-black': '#000000',
        'olive-green': '#6B8E23',
        'light-gray': '#F5F5F5',
      },
    },
  },
  plugins: [],
};

export default config;
