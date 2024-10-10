import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@vueuse/nuxt', 'nuxt-monaco-editor', 'nuxt-umami'],
  vite: {
    esbuild: {
      legalComments: 'external',
    },
    resolve: {
      alias: {
        path: 'pathe',
      },
    },
  },
  devtools: {
    enabled: true,
  },
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    '~/styles/dropdown.css',
  ],
  imports: {
    dirs: [
      './composables',
      './composables/state',
      './composables/parser',
      './utils',
    ],
  },
  umami: {
    autoTrack: false,
    ignoreLocalhost: true,
  },
  appConfig: {
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  },
  compatibilityDate: '2024-10-10',
})
