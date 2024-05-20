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
  init: (pkg) =>
    importUrl(`https://esm.sh/${pkg}`, true).then((mod) => mod.default),
  version: fetchVersion,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getAstLocation: getAstLocation('ranges'),
}
