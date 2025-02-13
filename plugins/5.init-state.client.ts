import { initParserModule } from '~/state/parser/module'
import { initParserOptionsState } from '~/state/parser/options'
import { initParserState } from '~/state/parser/parser'

export default defineNuxtPlugin({
  hooks: {
    'app:beforeMount': () => {
      initParserState()
      initParserOptionsState()
      initParserModule()
      initUrlState()
    },
  },
})
