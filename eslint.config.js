import { sxzz } from '@sxzz/eslint-config'

export default sxzz({
  vue: true,
  pnpm: true,
  baseline: {
    ignoreFeatures: ['top-level-await'],
  },
})
  .append({
    files: ['**/*.md/**'],
    rules: {
      'import/first': 'off',
    },
  })
  .append({
    ignores: ['app/parser/template/**'],
  })
