import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      appName: 'StudyEAD',
    },
  },

  nitro: {
    // When building on Vercel, output to the PROJECT ROOT .vercel/output
    // so Vercel's Build Output API picks it up automatically
    preset: process.env.VERCEL ? 'vercel' : 'node-server',
    ...(process.env.VERCEL && {
      output: {
        dir: resolve(__dirname, '../../.vercel/output'),
        serverDir: resolve(__dirname, '../../.vercel/output/functions/__fallback.func'),
        publicDir: resolve(__dirname, '../../.vercel/output/static'),
      },
    }),
  },

  app: {
    head: {
      title: 'Plataforma EAD — Cursinho Preparatório',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Plataforma completa de ensino a distância com videoaulas, banco de questões e simulados.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
});
