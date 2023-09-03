import { type ParserOptions, parse } from '@babel/parser'
import { version as babelVersion } from '@babel/parser/package.json'
import initSwc, { type ParseOptions, parse as swcParse } from '@swc/wasm-web'
import { version as swcVersion } from '@swc/wasm-web/package.json'
import { type LanguageOption } from '../language'

// @unocss-include
export const javascript: LanguageOption = {
  label: 'JavaScript',
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: {
    babel: {
      id: 'babel',
      label: '@babel/parser',
      icon: 'i-vscode-icons:file-type-babel2',
      version: `@babel/parser@${babelVersion}`,
      options: {
        configurable: true,
        defaultValue: {},
        editorLanguage: 'json',
      },
      parse(code, options: ParserOptions | null | undefined) {
        return parse(code, {
          sourceType: 'module',
          ...options,
        })
      },
      editorLanguage(options: ParserOptions | null | undefined) {
        try {
          const plugins = Array.isArray(options?.plugins)
            ? options!.plugins
            : []
          const normalizedPlugins = plugins.map((item) =>
            Array.isArray(item) ? item[0] : item
          )
          if (normalizedPlugins.includes('typescript')) return 'typescript'
        } catch {}
        return 'javascript'
      },
    },
    swc: {
      id: 'swc',
      label: 'SWC',
      icon: 'i-vscode-icons:file-type-swc',
      version: `@swc/parser@${swcVersion}`,
      options: {
        configurable: true,
        defaultValue: { syntax: 'ecmascript' } satisfies ParseOptions,
        editorLanguage: 'json',
      },
      async init() {
        await initSwc()
      },
      parse(code, options: ParseOptions | null | undefined) {
        return swcParse(code, { ...(options as any) })
      },
      editorLanguage(options: ParseOptions | null | undefined) {
        return options?.syntax === 'typescript' ? 'typescript' : 'javascript'
      },
    },
  },
}
