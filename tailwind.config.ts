import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors: {
        main: {
          50: '#fff2ed',
          100: '#ffe1d4',
          200: '#ffc0a8',
          300: '#ff9471',
          400: '#ff623f',
          500: '#fe3211',
          600: '#ef1907',
          700: '#c60c08',
          800: '#9d0f11',
          900: '#7e1011',
          950: '#44060a',
        },
        dark: '#1a1a1a',
        light: '#f7f8fa',
      },
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
      },
      fontFamily: {
        custom: ['Ark Pixel'],
      },

    },
  },
};
