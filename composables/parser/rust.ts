import { rustTemplate } from './template'
import type { LanguageOption, Parser } from './index'

// @unocss-include

const syn: Parser<any, any> = {
  id: 'syn',
  label: 'syn',
  icon: 'i-vscode-icons:file-type-rust',
  link: 'https://docs.rs/syn',
  editorLanguage: 'rust',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'astexplorer-syn',
  nodeTitle: '_type',
  init: async (url) => {
    const mod = await importUrl(url)
    await mod.default()
    return mod
  },
  parse(code, options) {
    return this.parseFile(code, { ...options })
  },
}

export const rust: LanguageOption = {
  label: 'Rust',
  icon: 'i-vscode-icons:file-type-rust',
  parsers: [syn],
  codeTemplate: rustTemplate,
}
