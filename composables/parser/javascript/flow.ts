import type { Parser } from '..'

export const flow: Parser<any, any> = {
  id: 'flow',
  label: 'Flow',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-flow',
  link: 'https://github.com/facebook/flow/tree/main/packages/flow-parser',
  options: {
    configurable: true,
    defaultValue: {
      enums: true,
      types: true,
      components: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'flow-parser',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}`,
  init: (url) => resolveDefault(importUrl(url, true)),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getNodeLocation: genGetNodeLocation('range'),
}
