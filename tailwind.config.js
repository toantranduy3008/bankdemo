/** @type {import('tailwindcss').Config} */
const defaultTheme = import('tailwindcss/defaultTheme')
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      fontFamily: {
        Montserrat: "Montserrat",
      },
      screens: {
        'xs': '300px',
        ...defaultTheme.screens,
      },
    },

  },
  plugins: [],
};
