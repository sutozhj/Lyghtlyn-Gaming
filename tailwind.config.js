/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1A1A2E',
          secondary: '#16213E',
          accent: '#0F3460',
        },
        purple: {
          accent: '#8B5CF6',
          hover: '#7C3AED',
        }
      }
    },
  },
  plugins: [],
}

