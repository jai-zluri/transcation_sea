
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',             
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {},
  },
  plugins: [
     require('@tailwindcss/forms'), // Tailwind plugin for form styles
  ],
};

