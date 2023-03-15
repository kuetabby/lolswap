/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '30%': "30%"
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
}
