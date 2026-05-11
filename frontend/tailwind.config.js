/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'kgc-pop': {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.96)' },
          '65%': { opacity: '1', transform: 'translateY(-4px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'kgc-float-soft': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(-0.8deg)' },
          '66%': { transform: 'translateY(-4px) rotate(0.6deg)' },
        },
        'kgc-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'kgc-blob': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(12px, -8px) scale(1.05)' },
          '66%': { transform: 'translate(-8px, 6px) scale(0.98)' },
        },
        'kgc-heart-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '20%': { transform: 'scale(1.06)' },
          '40%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'kgc-pop': 'kgc-pop 0.75s cubic-bezier(0.22, 1, 0.36, 1) both',
        'kgc-float-soft': 'kgc-float-soft 7s ease-in-out infinite',
        'kgc-wiggle': 'kgc-wiggle 2.2s ease-in-out infinite',
        'kgc-blob': 'kgc-blob 18s ease-in-out infinite',
        'kgc-heart-soft': 'kgc-heart-soft 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

