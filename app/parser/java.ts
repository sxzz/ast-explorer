import { javaTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as JavaParser from 'java-parser'

const javaParser: Parser<typeof JavaParser> = {
  id: 'java-parser',
  label: 'java-parser',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-java',
  link: 'https://github.com/jhipster/prettier-java/tree/main/packages/java-parser',
  editorLanguage: 'java',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'java-parser',
  parse(code) {
    return this.parse(code)
  },
  hideKeys: ['tokenType'],
}

export const java: LanguageOption = {
  label: 'Java',
  icon: 'i-vscode-icons:file-type-java',
  parsers: [javaParser],
  codeTemplate: javaTemplate,
}
