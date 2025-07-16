import { solidityTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as SolidityParser from '@solidity-parser/parser'

// @unocss-include

const solidityParser: Parser<
  typeof SolidityParser,
  SolidityParser.ParseOptions
> = {
  id: 'solidity-parser',
  label: 'solidity-parser',
  icon: 'i-vscode-icons:file-type-solidity',
  link: 'https://github.com/solidity-parser/parser',
  editorLanguage: 'solidity',
  options: {
    configurable: true,
    defaultValue: {
      range: true,
    },
    editorLanguage: 'json',
  },
  pkgName: '@solidity-parser/parser',
  parse(code, options) {
    return this.default.parse(code, { ...options })
  },
  getNodeLocation: genGetNodeLocation('range'),
}

export const solidity: LanguageOption = {
  label: 'Solidity',
  icon: 'i-vscode-icons:file-type-solidity',
  parsers: [solidityParser],
  codeTemplate: solidityTemplate,
}
