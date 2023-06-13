/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8f5cf7',
        dark: '#0a0a0a',
        button: '#411a8f',
        highlight: '#0f000f',
        red: '#ff3d4a',
        pink: '#ff8a92',
      }
    },
  },
  plugins: [],
}