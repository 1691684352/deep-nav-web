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
    'shadcn-nuxt',
  ],

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },

  css: ['~/assets/css/main.css'],

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

  // The personal centre renders entirely from localStorage, so server rendering
  // it would only produce a hydration mismatch against the signed-out snapshot.
  routeRules: {
    '/profile/**': { ssr: false, robots: false },
    '/profile': { ssr: false, robots: false },
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
