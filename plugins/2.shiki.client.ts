import { shikiToMonaco } from '@shikijs/monaco'
import { highlighter } from '~/composables/shiki'

export default defineNuxtPlugin(() => {
  const monaco = useMonaco()!
  monaco.languages.register({ id: 'vue' })
  shikiToMonaco(highlighter, monaco)
})
