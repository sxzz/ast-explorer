import { initParserModule } from '~/state/parser/module'
import { initParserOptionsState } from '~/state/parser/options'
import { initParserState } from '~/state/parser/parser'
import { initUrlState } from '~/state/url'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  hooks: {
    'app:beforeMount': () => {
      initUrlState()
      initParserState()
      initParserOptionsState()
      initParserModule()
    },
  },
})
