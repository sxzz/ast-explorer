import process from 'node:process'

// cross origin isolation is required since oxc-parser uses shared array buffer
const crossOriginHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-monaco-editor',
    '@nuxtjs/plausible',
  ],
  plausible: {
    domain: 'ast-explorer.dev',
    apiHost: 'https://evt.sxzz.dev',
  },
  vite: {
    resolve: {
      alias: {
        path: 'pathe',
      },
    },
    server: {
      headers: crossOriginHeaders,
    },
    build: {
      // rolldownOptions: {
      //   output: {
      //     advancedChunks: {
      //       groups: [
      //         { name: 'monaco-editor', test: /monaco-editor/ },
      //         { name: 'shiki', test: /shiki/ },
      //         { name: 'vendor', test: /node_modules/ },
      //       ],
      //     },
      //   },
      // },
    },
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: crossOriginHeaders,
      },
    },
    vercel: {
      config: {
        routes: [
          {
            src: '.*',
            // @ts-expect-error - type dismatch in `nitropack`
            headers: crossOriginHeaders,
          },
        ],
      },
    },
  },
  experimental: {
    typescriptPlugin: true,
  },
  devtools: { enabled: false },
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    '~/styles/dropdown.css',
  ],
  imports: {
    dirs: ['./composables', './parser', './state', './utils'],
  },
  appConfig: {
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  },
  compatibilityDate: 'latest',
})
