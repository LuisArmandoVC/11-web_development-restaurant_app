/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './core/templates/**/*.{html,js}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '2rem',
        lg: '4rem',
        xl: '7.62rem',
        '2xl': '14.06rem'
      },
    },
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl' : '1920px'
    },
    fontFamily: {
      avantGarde: ['AvantGarde Bk BT'],
      roboto: ['Roboto'],
      inter: ['Inter']
    },
    extend: {
      boxShadow: {
        'figmaShadows': '5px 7px 31.6px 0px rgba(0, 0, 0, 0.25)'
      },
      spacing: {
        'figmaMargins' : '7.62rem'
      },
      colors: {
        primary: '#3F3CBC',
        secondary: '#605BFF',
        tertiary: '#030229',
        'gray-figma': {
          100: '#F4F4F4',
          200: '#4A4A4A'
        } 
      }
    },
  },
  plugins: [],
}

