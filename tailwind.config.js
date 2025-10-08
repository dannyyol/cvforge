/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: [...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: colors.blue,
        secondary: colors.cyan,
        success: colors.green,
        warning: colors.yellow,
        error: colors.red,
        info: colors.sky,
        accent: colors.teal,
        neutral: colors.gray,
      },
    },
  },
  plugins: [],
};
