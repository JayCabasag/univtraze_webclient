/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        main: '#000a47',
        secondary: '#001a93',
        purple: '#7e5bef',
        pink: '#ff49db',
        orange: '#ff7849',
        green: {
          100: '#E6F0FF',
          200: '#BFDFFF',
          300: '#99C2FF',
          400: '#4D9CFF',
          500: '#256676',
          600: '#2e7f8e',
          700: '#005599',
          800: '#004366',
          900: '#002233',
        },
        black: '#0a1929',
      },
      fontFamily: { sans: ['Brown', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'] },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        tiny: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      width: {
        'max-xl': '1090px',
        'max-sm': '519px',
      },
      maxWidth: {
        'max-xl': '1090px',
        'max-sm': '519px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
