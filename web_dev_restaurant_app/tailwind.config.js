/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './core/templates/**/*.{html,js}',
    './blog/templates/**/*.{html,js}',
    './products/templates/**/*.{html,js}',
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
      'screen-360' : '360px',
      'screen-420': '420px',
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

      // Desktop font sizes

      //Headings
      'desktop-heading-large': '38px',
      'desktop-heading-medium': '28px',
      'desktop-heading-small': ['20px', {
        letterSpacing: '0.07em',
        fontWeight: '700',
      }],
      'desktop-heading-block': '22px',
      //Paragraph
      'desktop-paragraph-large': '16px',
      'desktop-paragraph-standard': '14px',
      //Notifications
      'desktop-notification': '11px',




      // Mobile font sizes

      //Headings
      'mobile-heading-large': '28px',
      'mobile-heading-medium': '22px',
      'mobile-heading-small': ['18px', {
        letterSpacing: '0.07em',
        fontWeight: '700',
      }],
      'mobile-heading-block': '20px',
      //Paragraph
      'mobile-paragraph-large': '14px',
      'mobile-paragraph-standard': '13px',
      //Notifications
      'mobile-notification': '10px',
    },
    extend: {
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height'
      },
      boxShadow: {
        'checkoutSections': '0px 4px 4px 0px #00000040',
        'blog_post-shadow': '0px 8px 14px 0px #00000026',
        'figmaShadows': '5px 7px 31.6px 0px rgba(0, 0, 0, 0.25)',
        'whiteShadowCTAs': '-2px 7px 20.3px 0px rgba(255, 255, 255, 0.50)',
        'primaryShadowForm': '-2px 7px 20.3px 0px rgba(96, 91, 255, 0.50)',
        'videoCTA': '0px 5px 38px 0px rgba(96, 91, 255, 0.50)',
        'shoppingCarShadow': '0px 1px 10px 0px #00000040'
      },
      spacing: {
        'figmaMargins' : '7.62rem'
      },
      colors: {
        // ORANGE
        primary: '#FD7400',
        // RED
        secondary: '#AC010F',
        //YELLOW
        tertiary: '#FFAD1F',
        specialBg: '#fe8e0e',
        'gray-figma': {
          100: '#F4F4F4',
          200: '#4A4A4A',
          300: '#49454F',
          400: '#555555',
          500: '#575756',
          600: '#B9B9B9',
          700: '#D9D9D9',
          800: '#6F6E6E',
          900: '#6F6F6F',
          1000: '#313131',
          1100: '#EEEEEE',
          1200: '#9292921A'
        },
        'sucessGreen': '#2B9943'
      }
    },
  },
  plugins: [],
}

