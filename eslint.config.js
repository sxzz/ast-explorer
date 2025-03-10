import { sxzz } from '@sxzz/eslint-config'

export default sxzz()
  .removeRules('node/no-unsupported-features/es-builtins', 'import/first')
  .append({
    ignores: ['composables/parser/template/**'],
  })
