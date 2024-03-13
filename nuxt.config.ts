import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@vueuse/nuxt', 'nuxt-monaco-editor'],
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
    define: {
      'process.env': JSON.stringify({}),
      'process.versions.node': JSON.stringify('18.17.1'),
    },
    plugins: [
      nodePolyfills({
        overrides: {
          fs: 'memfs',
        },
      }),
      {
        name: 'fix-monaco-platform',
        transform(code, id) {
          if (!id.includes('monaco-editor/esm/vs/base/common/platform.js'))
            return
          return code.replace('typeof process', "'undefined'")
        },
      },
    ],
  },
  future: {
    typescriptBundlerResolution: true,
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
})
