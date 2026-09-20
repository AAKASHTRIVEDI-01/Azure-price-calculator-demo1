/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        azure: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#0078D4', // Microsoft Azure Primary Blue
          600: '#106EBE', // Azure Hover Blue
          700: '#005A9E', // Azure Darker Blue
          800: '#004578',
          900: '#002451', // Azure Deep Navy
        },
      },
      fontFamily: {
        sans: [
          '"Segoe UI"',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
