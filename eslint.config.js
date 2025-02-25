import { sxzz } from '@sxzz/eslint-config'
export default sxzz([
  {
    rules: {
      'node/no-unsupported-features/es-builtins': 'off',
      'import/first': 'off',
    },
  },
  {
    ignores: ['composables/parser/template/**'],
  },
  {
    files: ['modules/**'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
])
