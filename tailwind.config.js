/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy / dark blue
        navy: {
          950: '#060b18',
          900: '#0a1224',
          800: '#0f1a30',
          700: '#152238',
          600: '#1c2d4a',
          500: '#243b5c',
        },
        // Warm beige / cream
        beige: {
          50:  '#fdfbf7',
          100: '#f9f3e9',
          200: '#f0e6d4',
          300: '#e4d5b8',
          400: '#d4c09a',
          500: '#c4a97c',
          600: '#b08f5e',
        },
        // Soft accent gold
        gold: {
          400: '#e8c97a',
          500: '#d4b05a',
          600: '#c49a3c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(212, 176, 90, 0.25)',
        'card': '0 8px 32px -8px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
