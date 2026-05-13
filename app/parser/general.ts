import json5 from 'json5'
import type { LanguageOption, Parser } from './index'

const jsonAst: Parser = {
  id: 'json-ast',
  label: 'JSON AST',
  // @unocss-include
  icon: 'i-ri:braces-line',
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

const jsCode: Parser = {
  id: 'js-code',
  label: 'JavaScript Code',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js-official',
  editorLanguage: 'javascript',
  options: {
    configurable: true,
    defaultValue: `return (async () => {
  return { code, tips: 'Write your code in parser options' }\n
  // Example:
  const mod = await import('MODULE_URL')
  return mod.parse(code)
})()`,
    defaultValueType: 'javascript',
    editorLanguage: 'javascript',
  },
  pkgName: '',
  versionOverridable: false,
  init: () => {},
  parse: (code, options) => options,
  getNodeLocation,
}

export const general: LanguageOption = {
  label: 'General',
  icon: 'i-ri:code-line',
  parsers: [jsonAst, jsCode, treeSitter],
  codeTemplate: JSON.stringify(
    {
      type: 'Program',
      body: [{ type: 'ExpressionStatement' }],
    },
    undefined,
    2,
  ),
}
