/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'grid-flow': 'grid-flow 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-delayed': 'fadeIn 0.5s ease-out 0.3s forwards',
        'typing': 'typing 3.5s steps(40, end)',
        'dots': 'dots 1.5s steps(3, end) infinite',
        'data-flow': 'data-flow 2s linear infinite',
        'progress': 'progress 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'grid-flow': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(64px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'typing': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'dots': {
          '0%': { content: '.' },
          '33%': { content: '..' },
          '66%': { content: '...' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '0.2' },
          '100%': { transform: 'translateX(100px) scale(0)', opacity: '0' },
        },
        'progress': {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '100%': { width: '90%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#c9d1d9',
            a: {
              color: '#58a6ff',
              '&:hover': {
                color: '#58a6ff',
              },
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

