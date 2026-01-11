import { protobufTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Protobuf from 'protobufjs'

const protobufjs: Parser<typeof Protobuf, Protobuf.IParseOptions> = {
  id: 'protobufjs',
  label: 'protobufjs',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-protobuf',
  link: 'https://github.com/protobufjs/protobuf.js',
  editorLanguage: 'protobuf',
  options: {
    configurable: true,
    defaultValue: {
      keepCase: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'protobufjs',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}`,
  parse(code, options) {
    return this.parse(code, options)
  },
}

export const protobuf: LanguageOption = {
  label: 'Protocol Buffers',
  icon: 'i-vscode-icons:file-type-protobuf',
  parsers: [protobufjs],
  codeTemplate: protobufTemplate,
}
