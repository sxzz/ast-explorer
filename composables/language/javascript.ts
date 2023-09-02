import { ParserOptions } from '@babel/parser'
import { parse } from '@babel/parser'
import { LanguageOption } from '../language'

// @unocss-include
export const javascript: LanguageOption = {
  label: 'JavaScript',
  icon: 'i-vscode-icons:file-type-js-official',
  language(options: ParserOptions | null | undefined) {
    const normalizedPlugins = (options?.plugins || []).map((item) =>
      Array.isArray(item) ? item[0] : item
    )
    if (normalizedPlugins.includes('typescript')) return 'typescript'
    return 'javascript'
  },
  options: {
    configurable: true,
    defaultValue: {},
    language: 'json',
  },
  parse(code, options: ParserOptions | null | undefined) {
    return parse(code, {
      sourceType: 'module',
      ...options,
    })
  },
}
