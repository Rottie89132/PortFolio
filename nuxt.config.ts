// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],
  app: {
    head: {
      script: [{ src: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' }],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  }
})
