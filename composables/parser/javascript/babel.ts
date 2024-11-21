import type { Parser } from '..'
import type * as Babel from '@babel/parser'

export const babel: Parser<typeof Babel, Babel.ParserOptions> = {
  id: 'babel',
  label: '@babel/parser',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-babel2',
  link: 'https://babeljs.io/docs/babel-parser',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      plugins: [],
    },
    editorLanguage: 'json',
  },
  pkgName: '@babel/parser',
  getModuleUrl: getJsdelivrUrl,
  version: fetchVersion,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage(options) {
    try {
      const plugins = Array.isArray(options?.plugins) ? options!.plugins : []
      const normalizedPlugins = plugins.map((item) =>
        Array.isArray(item) ? item[0] : item,
      )
      if (normalizedPlugins.includes('typescript')) return 'typescript'
    } catch (error) {
      console.error(error)
    }
    return 'javascript'
  },
  getAstLocation,
  gui: () => import('./BabelGui.vue'),
}
