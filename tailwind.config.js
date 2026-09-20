/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07090A',
          900: '#0C1014',
          850: '#10151C',
          800: '#161D26',
          700: '#212B38',
        },
        azure: {
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0078D4',
          600: '#0284C7',
          700: '#0369A1',
        },
        gold: {
          300: '#FDE047',
          400: '#D4AF37',
          500: '#B89628',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
