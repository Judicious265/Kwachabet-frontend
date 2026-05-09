/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#00C853', dark: '#009624', light: '#5EFC82' },
        dark: { DEFAULT: '#0D1117', surface: '#161B22', card: '#1C2128', border: '#30363D', hover: '#21262D' },
        accent: { gold: '#FFD700', red: '#F85149', orange: '#FB8500' },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'ticker': 'ticker 35s linear infinite',
      },
      keyframes: {
        slideUp: { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        ticker: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(-200%)' } },
      },
    },
  },
  plugins: [],
};
