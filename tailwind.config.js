/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0d9488', // teal-600
        'primary-focus': '#0f766e', // teal-700
        'primary-content': '#ffffff',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        medicare: {
          "primary": "#0d9488",
          "secondary": "#14b8a6",
          "accent": "#f59e0b",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
      },
      "light",
    ],
  },
}
