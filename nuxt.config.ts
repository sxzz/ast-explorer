import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@vueuse/nuxt', 'nuxt-monaco-editor', 'nuxt-shiki'],
  extends: ['nuxt-umami'],
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
  appConfig: {
    umami: {
      version: 2,
      autoTrack: false,
      ignoreLocalhost: true,
    },
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  },
  shiki: {
    bundledLangs: ['javascript'],
    bundledThemes: ['vitesse-dark', 'vitesse-light'],
  },
})
