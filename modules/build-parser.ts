import { addVitePlugin, defineNuxtModule, useLogger } from '@nuxt/kit'
import { buildTsEslint } from '../scripts/build-parser'

const VIRTUAL_ID = '/virtual/typescript-eslint/parser'

export default defineNuxtModule(() => {
  const logger = useLogger('build-parser')

  addVitePlugin({
    name: 'virtual-ts-eslint-parser',
    resolveId(id) {
      if (id === VIRTUAL_ID) return id
    },
    async load(id) {
      if (id !== VIRTUAL_ID) return

      const result = await buildTsEslint(logger)
      return result
    },
  })
})
