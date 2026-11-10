/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1f2e',
        mist: '#f4f6fb',
        mint: '#2d9f7f',
        sky: '#3b82c4',
        amber: '#d97706',
        chaithu: '#9b8ab8',
        sujesh: '#1e3a5f',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
