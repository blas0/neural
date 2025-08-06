/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
      colors: {
        cream: {
          50: '#fefdf8',
          100: '#fdfbf1',
          200: '#faf6e1',
          300: '#f5ecc8',
          400: '#ecdaa3',
          500: '#dfc074',
          600: '#d0a548',
          700: '#b8903c',
          800: '#967435',
          900: '#7a5f30',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'tv-static-1': 'tvStatic1 0.1s infinite linear',
        'tv-static-2': 'tvStatic2 0.15s infinite linear',
        'tv-static-3': 'tvStatic3 0.08s infinite linear',
      },
      keyframes: {
        tvStatic1: {
          '0%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2px, -1px)' },
          '20%': { transform: 'translate(1px, 2px)' },
          '30%': { transform: 'translate(-1px, -2px)' },
          '40%': { transform: 'translate(2px, 1px)' },
          '50%': { transform: 'translate(-2px, 2px)' },
          '60%': { transform: 'translate(1px, -1px)' },
          '70%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '90%': { transform: 'translate(-2px, 1px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        tvStatic2: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '15%': { transform: 'translate(1px, -1px) scale(1.01)' },
          '30%': { transform: 'translate(-1px, 1px) scale(0.99)' },
          '45%': { transform: 'translate(1px, 1px) scale(1.01)' },
          '60%': { transform: 'translate(-1px, -1px) scale(0.99)' },
          '75%': { transform: 'translate(1px, -1px) scale(1.01)' },
          '90%': { transform: 'translate(-1px, 1px) scale(0.99)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        tvStatic3: {
          '0%': { opacity: '0.4' },
          '25%': { opacity: '0.6' },
          '50%': { opacity: '0.3' },
          '75%': { opacity: '0.7' },
          '100%': { opacity: '0.4' },
        },
      }
    },
  },
  plugins: [],
}