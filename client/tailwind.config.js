// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Asegúrate de incluir todos los archivos que puedan tener clases de Tailwind
  ],
  theme: {
    extend: {
      colors: {
        red: '#FF0000',
        black: '#000000',
        darkGray: '#333333',
        lightGray: '#666666',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}


