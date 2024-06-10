const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pop': ['Poppins', 'sans-serif'],
        'mont': ['Montserrat', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        purple1: "#181E30",
        bgcol: '#F8F8F8'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

