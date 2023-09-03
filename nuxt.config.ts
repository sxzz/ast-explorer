// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    '~/styles/dropdown.css',
  ],
  devtools: {
    enabled: true,
  },
  modules: ['@unocss/nuxt', '@vueuse/nuxt', 'nuxt-monaco-editor'],
  vue: {
    defineModel: true,
  },
  vite: {
    define: {
      'process.env': JSON.stringify({}),
    },
    optimizeDeps: {
      exclude: ['@swc/wasm-web'],
    },
  },
  imports: {
    dirs: ['./composables', './composables/language', './utils'],
  },
  ssr: false,
})
