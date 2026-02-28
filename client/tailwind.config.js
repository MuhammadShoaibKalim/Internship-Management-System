/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#09acb4',
        'secondary': '#05a1a8',
        'gray': '#7f7f7f',
        'black': '#000000',
      },
    },
  },
  plugins: [],
}