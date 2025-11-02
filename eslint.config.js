import { sxzz } from '@sxzz/eslint-config'

export default sxzz({ pnpm: true })
  .removeRules('node/no-unsupported-features/es-builtins', 'import/first')
  .append({
    ignores: ['app/parser/template/**'],
  })
