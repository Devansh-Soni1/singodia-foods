/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF5',
          100: '#FAF6EF',
          200: '#F5EEDB',
          300: '#EDE2C8',
        },
        brand: {
          green: '#1E4334',
          'green-dark': '#143025',
          'green-light': '#2A5E49',
          'green-soft': '#EBF2EE',
        },
        mustard: {
          DEFAULT: '#F3A222',
          dark: '#D98218',
          light: '#FDEBC8',
          yellow: '#FFB800',
        },
        chilli: {
          DEFAULT: '#C6321F',
          dark: '#9F2213',
          light: '#FDE8E5',
        },
        earth: {
          brown: '#6B5441',
          light: '#8C735E',
        },
        charcoal: {
          DEFAULT: '#22201D',
          muted: '#524F4A',
          border: '#E8E3D8',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Quicksand', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 67, 52, 0.08)',
        'card': '0 2px 12px rgba(34, 32, 29, 0.06)',
        'hover': '0 12px 28px -4px rgba(30, 67, 52, 0.16)',
      }
    },
  },
  plugins: [],
}

