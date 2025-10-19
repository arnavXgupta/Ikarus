/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        secondary: '#9a8c98',
        'bg-dark': '#1A1A1A',
        'card-bg': '#00418b',
        'text-light': '#ffffff',
      },
      perspective: {
        '1000': '1000px',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
