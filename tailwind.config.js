/** @type {import('tailwindcss').Config} */

//TODO: add custom colors
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "loadingLight" : "#d9d9d9"
      }
    },
  },
  plugins: [],
}
