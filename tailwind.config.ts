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
          50: '#FFF4F0',
          100: '#FFE9E0',
          200: '#FFD3C2',
          300: '#FFB699',
          400: '#FF9166',
          500: '#FF5A19',
          600: '#F04400',
          700: '#D13B00',
          800: '#AD3100',
          900: '#802400',
          950: '#5C1A00',
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
        custom: ['Inter'],
      },

    },
  },
};
