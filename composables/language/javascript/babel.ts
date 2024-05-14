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
  init: (pkg) => importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/+esm`),
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
  getAstLocation: getAstLocationBabel,
  gui: () => import('./BabelGui.vue'),
}

export const useOption = makeUseOption<Babel.ParserOptions>()
export function usePlugin(
  name: Babel.ParserPlugin,
  deps: Ref<boolean | undefined>[] = [],
) {
  const value = useOptions(
    (opt: Babel.ParserOptions) => !!opt.plugins?.includes?.(name),
    (value, opt) => {
      if (!Array.isArray(opt.plugins)) opt.plugins = []

      if (value) {
        deps.forEach((dep) => !dep.value && (dep.value = true))
        opt.plugins.push(name)
      } else {
        opt.plugins = del(opt.plugins, [name])
      }
    },
  )

  watch(
    () => deps.map((dep) => dep.value),
    (deps) => {
      if (value.value && deps.some((dep) => !dep)) {
        value.value = false
      }
    },
  )

  return value
}
