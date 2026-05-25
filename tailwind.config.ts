import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Fleur primary — rose petal
        rose: {
          50:  '#FDF6F0',
          100: '#FAE8E0',
          200: '#F5CECC',
          300: '#EFB0B4',
          400: '#E8A598',
          500: '#D4829A',
          600: '#C47B8E',
          700: '#A65A72',
          800: '#7A3A50',
          900: '#4D2030',
        },
        // Fleur secondary — warm mauve
        mauve: {
          50:  '#F9F0F5',
          100: '#F0DCE8',
          200: '#E2C0D4',
          300: '#CFA0BB',
          400: '#B87FA2',
          500: '#9B6086',
          600: '#7E4469',
          700: '#622F50',
          800: '#441D37',
          900: '#270D1F',
        },
        // Fleur neutral — warm cream
        cream: {
          50:  '#FFFDF9',
          100: '#FDF6F0',
          200: '#F9EDE3',
          300: '#F5E0D0',
          400: '#EDD0BC',
          500: '#D9B49A',
          600: '#C09070',
          700: '#9A6E4E',
          800: '#6B4A32',
          900: '#3D2814',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.5s ease forwards',
        'slide-right':'slideRight 0.35s ease forwards',
        'shimmer':    'shimmer 1.6s linear infinite',
        'float':      'float 4s ease-in-out infinite',
        'petal':      'petal 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'none' } },
        slideRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        petal: {
          '0%,100%': { transform: 'rotate(-3deg) scale(1)' },
          '50%':     { transform: 'rotate(3deg) scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}

export default config