/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'
import autoprefixer from 'autoprefixer'
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // fontFamily: {
      //   Karla: ['Karla', 'sans-serif']
      // },
      boxShadow: {
        '4edges': '3px 3px 5px rgb(0 0 0 / 0.2), -3px -3px 5px rgb(0 0 0 / 0.2)'

      },
      colors: {
        'orangeFpt': '#F27125',
        'fbWhite': '#E9EBEE',
        'fbWhite-500': '#dfe3ee',
        'fbWhite-700': '#8b9dc3',
        'fbWhite-900': '#3b5998',
      },
      // keyframes: {
      //   slideDown: {
      //     '0%': { transform: 'translateY(-100%)' },
      //     '100%': { transform: 'translateY(0)' },
      //   },
      //   fadeIn: {
      //     from: { opacity: 0 },
      //     to: { opacity: 1 }
      //   }
      // },
      // animation: {
      //   slideDown: 'slideDown .5s ease-in-out',
      //   fadeIn: 'fadeIn .5s ease-in-out',
      // }
    },
  },
  // corePlugins: {
  //   preflight: false,
  // },
  plugins: [
    typography,
    autoprefixer

  ],
}

