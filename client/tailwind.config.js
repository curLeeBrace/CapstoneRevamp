/** @type {import('tailwindcss').Config} */

import withMT from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkgreen: '#006400',
      },
    },
  },
  plugins: [],
})