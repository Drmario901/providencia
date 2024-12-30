/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,php}"],
  darkMode: 'false',
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ], 
}
