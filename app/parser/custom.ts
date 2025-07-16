import json5 from 'json5'
import type { LanguageOption, Parser } from './index'

// @unocss-include

const customParser: Parser = {
  id: 'custom-parser',
  label: 'custom',
  icon: 'i-ri:magic-fill',
  editorLanguage: 'json',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: '',
  init: () => {},
  parse(code) {
    return json5.parse(code || '{}')
  },
}

export const custom: LanguageOption = {
  label: 'JSON AST',
  icon: 'i-ri:magic-line',
  parsers: [customParser],
  codeTemplate: JSON.stringify(
    {
      type: 'Program',
      body: [],
      sourceType: 'module',
    },
    undefined,
    2,
  ),
}
