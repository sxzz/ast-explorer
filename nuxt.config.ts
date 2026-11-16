import process from 'node:process'

// cross origin isolation is required since oxc-parser uses shared array buffer
const crossOriginHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

const WORKER_CHUNK_RE = /\.worker-[\w-]+\.js$/

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-monaco-editor',
    '@vercel/analytics',
  ],
  vue: {
    optionsApi: false,
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
        version: 3,
        routes: [
          {
            src: '.*',
            // @ts-expect-error type mismatch with nitro vercel config
            headers: crossOriginHeaders,
          },
        ],
      },
    },
  },
  hooks: {
    'build:manifest': (manifest) => {
      for (const [id, chunk] of Object.entries(manifest)) {
        // Monaco workers are spawned on demand. Preloading them as modules
        // only wastes bandwidth (ts.worker alone is ~7 MB), and `new Worker()`
        // can't reuse a modulepreload, so they would be downloaded twice.
        // The bundled typescript-eslint parser (~4 MB) is rarely used either.
        if (
          WORKER_CHUNK_RE.test(chunk.file) ||
          id.includes('ts-eslint-parser')
        ) {
          chunk.preload = false
          chunk.prefetch = false
        }
      }
    },
  },
  experimental: {
    typescriptPlugin: true,
  },
  devtools: { enabled: false },
  css: [
    '@unocss/reset/tailwind.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    '~/styles/dropdown.css',
    '~/styles/tooltip.css',
  ],
  imports: {
    dirs: ['./composables', './parser', './state', './utils'],
  },
  appConfig: {
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  },
  compatibilityDate: 'latest',
})
