import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/components/ui', pathPrefix: false },
    '~/components',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'deepNavTheme',
    dataValue: 'theme',
    classSuffix: '',
  },

  site: {
    url: 'https://www.deepnav.cn',
    name: '深度指引',
  },

  routeRules: {
    '/profile/**': { robots: false },
    '/profile': { robots: false },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/profile/**', '/search'],
  },

  robots: {
    disallow: ['/profile'],
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      siteUrl: 'https://www.deepnav.cn',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  typescript: {
    strict: true,
  },
})
