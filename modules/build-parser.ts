import { addTemplate, defineNuxtModule, useLogger } from '@nuxt/kit'
import { buildTsEslintParser } from '../scripts/build-parser'

export default defineNuxtModule({
  meta: {
    name: 'ts-eslint-parser-setup',
  },
  setup() {
    const logger = useLogger('build-parser')

    addTemplate({
      filename: 'ts-eslint-parser',
      getContents: () => buildTsEslintParser(logger),
    })
  },
})
