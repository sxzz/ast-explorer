import { sxzz } from '@sxzz/eslint-config'

export default sxzz([
  {
    files: ['plugins/**'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
])
