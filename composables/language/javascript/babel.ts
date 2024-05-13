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

export function useBabelOptions<T>(
  read: (opt: Babel.ParserOptions) => T,
  write: (value: T, opt: Babel.ParserOptions) => void,
) {
  return computed<T>({
    get: () => read(options.value),
    set(value) {
      const newOpt: Babel.ParserOptions =
        typeof options.value === 'object' ? options.value : {}
      write(value, newOpt)
      options.value = { ...newOpt }
    },
  })
}

export function useOption<K extends keyof Babel.ParserOptions>(
  key: K,
  defaultValue: Babel.ParserOptions[K] = false as any,
) {
  return useBabelOptions<Babel.ParserOptions[K]>(
    (opt) => opt[key] ?? defaultValue,
    (value, opt) => {
      if (value === defaultValue) delete opt[key]
      else opt[key] = value
    },
  )
}

export function usePlugin(
  name: Babel.ParserPlugin,
  deps: Ref<boolean | undefined>[] = [],
) {
  const value = useBabelOptions<boolean>(
    (opt) => !!opt.plugins?.includes?.(name),
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
