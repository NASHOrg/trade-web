import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1200px',
    },
    extend: {
      colors: {
        main: {
          50: '#fff5ed',
          100: '#ffe8d4',
          200: '#ffcda8',
          300: '#ffa971',
          400: '#ff6e26',
          500: '#fe5611',
          600: '#ef3c07',
          700: '#c62808',
          800: '#9d220f',
          900: '#7e1f10',
          950: '#440c06',
        },
        dark: '#1a1a1a',
        light: '#f7f8fa',
        buy: {
          DEFAULT: '#0AC49E',
          50: '#66F7D9',
          100: '#52F6D5',
          200: '#2BF4CB',
          300: '#0CEBBD',
          400: '#0AC49E',
          500: '#078F73',
          600: '#055948',
          700: '#02241D',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        sell: {
          DEFAULT: '#E24444',
          50: '#F5C0C0',
          100: '#F2AEAE',
          200: '#ED8B8B',
          300: '#E76767',
          400: '#E24444',
          500: '#CE2020',
          600: '#9D1818',
          700: '#6D1111',
          800: '#3C0909',
          900: '#0C0202',
          950: '#000000',
        },
      },
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
      },
      fontFamily: {
        custom: ['Roboto'],
      },
    },
  },
};
