// import { parse } from '@typescript-eslint/parser'
// import { type ParserOptions } from '@typescript-eslint/parser/dist/index'
import { type LanguageOption, type Parser } from '../language'
import type * as Babel from '@babel/parser'
import type * as Swc from '@swc/wasm-web'
import type * as Acorn from 'acorn'
// @unocss-include

const babel: Parser<typeof Babel, Babel.ParserOptions> = {
  id: 'babel',
  label: '@babel/parser',
  icon: 'i-vscode-icons:file-type-babel2',
  version: `@babel/parser@latest`,
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  init() {
    // @ts-expect-error
    return import('https://cdn.jsdelivr.net/npm/@babel/parser/+esm')
  },
  parse(code, options) {
    return this.parse(code, { sourceType: 'module', ...options })
  },
  editorLanguage(options) {
    try {
      const plugins = Array.isArray(options?.plugins) ? options!.plugins : []
      const normalizedPlugins = plugins.map((item) =>
        Array.isArray(item) ? item[0] : item
      )
      if (normalizedPlugins.includes('typescript')) return 'typescript'
    } catch {}
    return 'javascript'
  },
}

const swc: Parser<typeof Swc, Swc.ParseOptions> = {
  id: 'swc',
  label: 'SWC',
  icon: 'i-vscode-icons:file-type-swc',
  version: `@swc/parser@latest`,
  options: {
    configurable: true,
    defaultValue: { syntax: 'ecmascript' },
    editorLanguage: 'json',
  },
  async init() {
    const mod: typeof Swc = await import(
      // @ts-expect-error
      'https://cdn.jsdelivr.net/npm/@swc/wasm-web@1.3.82/wasm-web.js'
    )
    await mod.default()
    return mod
  },
  parse(code, options) {
    return this.parse(code, { ...(options as any) })
  },
  editorLanguage(options) {
    return options?.syntax === 'typescript' ? 'typescript' : 'javascript'
  },
}

const acorn: Parser<typeof Acorn, Acorn.Options> = {
  id: 'acorn',
  label: 'Acorn',
  icon: 'i-vscode-icons:acorn',
  version: `acorn@latest`,
  options: {
    configurable: true,
    defaultValue: { ecmaVersion: 'latest', sourceType: 'module' },
    editorLanguage: 'json',
  },
  init() {
    // @ts-expect-error
    return import('https://cdn.jsdelivr.net/npm/acorn@8.10.0/+esm')
  },
  parse(code, options) {
    return this.parse(code, { ...(options as any) })
  },
  editorLanguage() {
    return 'javascript'
  },
}

// const tsEslint: Parser<undefined, ParserOptions> = {
//   id: 'tsEslint',
//   label: '@typescript-eslint/parser',
//   icon: 'i-vscode-icons:file-type-eslint',
//   version: `@typescript-eslint/parser@latest`,
//   options: {
//     configurable: true,
//     defaultValue: {},
//     editorLanguage: 'json',
//   },
//   parse(code, options) {
//     return parse(code, { ...(options as any) })
//   },
//   editorLanguage: 'typescript',
// }

export const javascript: LanguageOption = {
  label: 'JavaScript',
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: {
    babel,
    swc,
    acorn,
    // tsEslint,
  },
}
