/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    // Mobile-first breakpoints
    screens: {
      'xs': '475px',
      'sm': '640px', 
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
      // Fluid typography system
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.75rem + 2.5vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 2.25rem + 3.75vw, 4rem)',
        'fluid-6xl': 'clamp(3.75rem, 2.75rem + 5vw, 5rem)',
        'fluid-7xl': 'clamp(4.5rem, 3.25rem + 6.25vw, 6rem)',
        // Mobile-safe input sizes (prevent iOS zoom)
        'input-mobile': '16px', // Fixed 16px for mobile inputs to prevent zoom
        'input-fluid': 'clamp(16px, 1rem + 0.375vw, 1.125rem)', // 16px min to prevent zoom
      },
      // Mobile-optimized spacing
      spacing: {
        'touch': '44px', // Minimum touch target size
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
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
        // Mobile-optimized animations (slower for battery life)
        'tv-static-1-mobile': 'tvStatic1 0.2s infinite linear',
        'tv-static-2-mobile': 'tvStatic2 0.3s infinite linear',
        'tv-static-3-mobile': 'tvStatic3 0.15s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}