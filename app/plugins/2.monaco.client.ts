import { loadMonaco } from '~/composables/monaco'
import { defineNuxtPlugin } from '#app'

// Start downloading Monaco right away, but don't block app mounting on it.
export default defineNuxtPlugin(() => {
  loadMonaco()
})
