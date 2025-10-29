import FloatingVue from 'floating-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue)
})

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    VMenu: typeof import('floating-vue').Menu
    VDropdown: typeof import('floating-vue').Dropdown
  }
}
