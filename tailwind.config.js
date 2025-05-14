/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0055A4',
        'brand-secondary': '#FFDD00',
        'accent': '#00A651',
        'text-primary': '#171717',
        'text-secondary': '#555555',
        'background-light': '#FFFFFF',
        'background-dark': '#0A0A0A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Open Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-delay': 'fade-in 0.6s ease-out 0.2s forwards',
        'fade-in-delay-2': 'fade-in 0.6s ease-out 0.4s forwards',
      },
    },
  },
  plugins: [],
};