/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './core/templates/**/*.{html,js}',
    './blog/templates/**/*.{html,js}',
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
      'screen-1720': '1720px',
      '3xl' : '1920px'
    },
    fontFamily: {
      avantGarde: ['AvantGarde Bk BT'],
      roboto: ['Roboto'],
      inter: ['Inter']
    },
    fontSize: {
      'notificacion': '14px',
      'parrafo': '16px',
      'subtitulo': '18px',
      'tituloParrafo': '22px',
      'tituloMob': '32px',
      'titulo': '48px',
    },
    extend: {
      transitionProperty: {
        'height': 'height'
      },
      boxShadow: {
        'blog_post-shadow': '0px 8px 14px 0px #00000026',
        'figmaShadows': '5px 7px 31.6px 0px rgba(0, 0, 0, 0.25)',
        'whiteShadowCTAs': '-2px 7px 20.3px 0px rgba(255, 255, 255, 0.50)',
        'primaryShadowForm': '-2px 7px 20.3px 0px rgba(96, 91, 255, 0.50)',
        'videoCTA': '0px 5px 38px 0px rgba(96, 91, 255, 0.50)'
      },
      spacing: {
        'figmaMargins' : '7.62rem'
      },
      colors: {
        primary: '#FD7400',
        secondary: '#AC010F',
        tertiary: '#AC010F',
        'gray-figma': {
          100: '#F4F4F4',
          200: '#4A4A4A',
          300: '#49454F',
          400: '#555555',
          500: '#575756'
        } 
      }
    },
  },
  plugins: [],
}

