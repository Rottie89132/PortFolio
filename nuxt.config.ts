// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: {
    enabled: false,
    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-icon',
    '@vite-pwa/nuxt',
    '@vue-macros/nuxt',
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
    'nuxt-mongoose',
    "@formkit/auto-animate/nuxt",
    '@nuxtjs/color-mode',
    'nuxt-rate-limit',
    "nuxt-csurf",
    'nuxt-scheduler',
    '@vue-email/nuxt',
    "nuxt-build-cache"
  ],
  vueEmail: {
    playground: true,
    autoImport: true,
  },
  csurf: {
    https: process.env.production === 'true',
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
    excludedUrls: ['/api/render/verification.vue', '/api/render/success.vue'],
    addCsrfTokenToEventCtx: true
  },
  colorMode: {
    classSuffix: ''
  },
  mongoose: {
    uri: process.env.DataBaseUrl,
  },
  veeValidate: {
    autoImports: true,
  },
  runtimeConfig: {
    Hostadress: process.env.Hostadress,
    SaltToken: process.env.SaltToken,
    AnalyticsID: process.env.AnalyticsID,
    appId: process.env.GitAppId,
    PusherAppID: process.env.PusherAppID,
    PusherAppSecret: process.env.PusherAppSecret,
    privateKey: process.env.GitPrivateKey,
    clientId: process.env.GitClientID,
    clientSecret: process.env.GitClientSecret,
    FetchServer: process.env.FetchServer,
    Sender: process.env.SmtpSender,
    Server: process.env.SmtpServer,
    User: process.env.SmtpUser,
    Password: process.env.SmtpPass,
    public: {
      PusherAppKey: process.env.PusherAppKey,
      cluster: process.env.cluster,
      PusherChannel: process.env.PusherChannel,
    }
  },
  nuxtRateLimit: {
    enabled: true,
    routes: {
      '/api/auth': {
        maxRequests: 10,
        intervalSeconds: 60,
      },
      '/api/contact': {
        maxRequests: 5,
        intervalSeconds: 30,
      },
      '/api/users': {
        maxRequests: 150,
        intervalSeconds: 30,
      },
      '/api/upload': {
        maxRequests: 5,
        intervalSeconds: 10,
      },
    },
  },
  pwa: {
    strategies: "injectManifest",
    registerType: 'autoUpdate',
    manifest: {
      name: "PortFolio",
      short_name: "PortFolio",
      description: "PortFolio is een portfolio website voor het tonen van projecten.",
      prefer_related_applications: true,
      orientation: "portrait",
      background_color: "#171717",
      theme_color: "#171717",
      display_override: ["window-controls-overlay", "standalone", "minimal-ui", "fullscreen", "browser"],
      icons: [
        {
          src: "icons/icon_144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "icons/icon_192.png",
          sizes: "192x192",
          type: "image/svg",
        },
        {
          src: "icons/icon_512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      launch_handler: {
        client_mode: ["navigate-existing", "auto"]
      }
    },
    workbox: {
      navigateFallback: '/',
      // runtimeCaching: [{
      //   urlPattern: ({ url }) => {
      //     const pathSegments = url.pathname.split('/');
      //     return pathSegments.length === 4 && pathSegments[1] === 'api' && pathSegments[2] === 'repo' && /^\d+$/.test(pathSegments[3]) && url.search === '';
      //   },
      //   handler: 'NetworkFirst',
      //   options: {

      //     cacheName: 'api-cache',
      //     cacheableResponse: {
      //       statuses: [0, 200],
      //     },
      //   }
      // }]
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
    },
  },
  
  app: {
    head: {
      meta: [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: "#FFFFFF" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icons/icon_144.png' },
      ],
      charset: 'utf-8',
      viewport: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },
  nitro: {
    imports: {
      dirs: ["./server/serverUtils"],
      presets: [{
        from: "bcrypt",
        imports: [{name: "default", as: "bcrypt"}],
      }],
    },
  }
})