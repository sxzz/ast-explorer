import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@vueuse/nuxt', 'nuxt-monaco-editor'],
  extends: ['nuxt-umami'],
  app: {
    head: {
      title: 'AST Explorer',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/logo.svg',
        },
      ],
    },
  },
  ssr: false,
  vite: {
    esbuild: {
      legalComments: 'external',
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
    dirs: ['./composables', './composables/language', './utils'],
  },
  hooks: {
    'build:manifest': (manifest) => {
      for (const key of Object.keys(manifest)) {
        manifest[key].dynamicImports = []
      }
    },
  },
  appConfig: {
    umami: {
      version: 2,
      autoTrack: false,
      ignoreLocalhost: true,
    },
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  },
})
