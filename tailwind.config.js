/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        secondary: '#4A90E2',
        background: '#1A1B26',
        surface: '#1F2937',
        text: '#E6E8E6',
      },
      animation: {
        'flame': 'flameAnimation 1s infinite',
        'scroll': 'scroll 20s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}