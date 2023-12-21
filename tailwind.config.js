/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,css}",
  ],
  /* Avoid customizing the tailwind config of this app, and modify the design system instead. */
  theme: {
    extend: {},
  },
  plugins: [],
}

