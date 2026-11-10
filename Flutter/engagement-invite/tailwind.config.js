/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          DEFAULT: '#9b8ab8',
          light: '#c4b8dc',
          soft: '#e8e0f4',
          deep: '#7a6898',
        },
        navy: {
          DEFAULT: '#1e3a5f',
          light: '#2c5282',
          deep: '#152a45',
        },
        cream: '#faf8fc',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
};
