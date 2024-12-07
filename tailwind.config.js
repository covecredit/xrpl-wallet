/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        text: 'var(--text)',
      },
      backgroundColor: {
        'primary-opacity': 'rgba(var(--primary-rgb), 0.1)',
        'background-opacity': 'rgba(var(--background-rgb), 0.95)',
      },
      borderColor: {
        'primary-opacity': 'rgba(var(--primary-rgb), 0.3)',
      },
      textColor: {
        'primary-opacity': 'rgba(var(--primary-rgb), 0.7)',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-primary',
    'bg-secondary',
    'bg-background',
    'text-primary',
    'text-secondary',
    'text-background',
    'text-text',
    'border-primary',
    'border-secondary',
    'border-background',
  ]
}