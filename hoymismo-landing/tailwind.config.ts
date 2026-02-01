import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'hoymismo-orange': '#EA580C',
        'hoymismo-gold': '#F59E0B',
        'hoymismo-navy': '#0F172A',
        'hoymismo-dark': '#1E293B',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Impact', 'sans-serif'],
        'body': ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
