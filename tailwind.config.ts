import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        blue1: 'var(--bg-blue-1)',
        blue2: 'var(--bg-blue-2)',
        blue3: 'var(--bg-blue-3)',
        green1: '#3F9067',
        yellow1: '#FFD700',
        red1: '#D81717',
        pageBackground: '#ECF0F1',
      },
    },
  },
  plugins: [],
};
export default config;
