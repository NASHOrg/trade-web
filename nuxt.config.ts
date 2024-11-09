// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  devServer: {
    port: 4000,
  },

  css: ['~/assets/styles/fonts.css', '~/assets/styles/main.css'],

  nitro: {
    compressPublicAssets: true,
  },

  runtimeConfig: {
    public: {
      baseUrl: '',
      network: '',
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/blocks',
      pathPrefix: false,
    },
  ],

  i18n: {
    langDir: 'locales',
    lazy: true,
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'zh',
        iso: 'zh-CN',
        file: 'zh.json',
        name: '中文',
      },
    ],
  },

  plugins: ['~/plugins/api', '~/plugins/chart.ts'],

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@hypernym/nuxt-gsap',
    'nuxt-svgo',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/ui',
  ],

  svgo: {
    componentPrefix: 'icon',
    defaultImport: 'component',
    svgo: false,
  },

  colorMode: {
    preference: 'dark',
    disableTransition: false,
  },

  eslint: {
    config: {
      stylistic: {
        semi: true,
        indent: 2,
      },
      autoInit: false,
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => ['w3m-button'].includes(tag),
    },
  },

  vite: {
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
        },
      }),
    ],
  },

  compatibilityDate: '2024-07-25',
});
