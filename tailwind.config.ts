import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          800: '#1e40af',
          900: '#1e3a8a',
        },
        orange: {
          500: '#f97316',
          600: '#ea580c',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config; 