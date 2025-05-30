import type { Parser } from '..'

export const hermes: Parser<any, any> = {
  id: 'hermes',
  label: 'Hermes',
  icon: 'https://cdn.jsdelivr.net/gh/facebook/hermes@main/doc/img/logo.svg',
  link: 'https://github.com/facebook/hermes',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'hermes-parser',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}`,
  init: (url) => resolveDefault(importUrl(url, true)),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getNodeLocation: genGetNodeLocation('range'),
}
