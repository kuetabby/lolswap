/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark-primary': '#06070A',
        'dark-secondary': 'rgb(19, 24, 35)',
        'dark-switcher': '#324054',
        'dark-hover': '#99a1bd14'
      },
      boxShadow: {
        'dark-shadow': 'inset 0 0 0 1px #202835',
      },
      width: {
        '17.5%': "17.5%",
        '30%': "30%",
        "47.5%": "47.5%"
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
}
