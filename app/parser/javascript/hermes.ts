import type { Parser } from '..'

// https://npmx.dev/package/hermes-parser#user-content-api
export type Options = {
  babel: boolean
  allowReturnOutsideFunction: boolean
  flow: 'all' | 'detect'
  sourceType: 'module' | 'script' | 'unambiguous'
  tokens: boolean
  // Undocumented
  enableExperimentalComponentSyntax: boolean
  // Undocumented
  enableExperimentalFlowMatchSyntax: boolean
}

export const hermes: Parser<any, Options> = {
  id: 'hermes',
  label: 'Hermes',
  icon: 'https://cdn.jsdelivr.net/gh/facebook/hermes@main/doc/img/logo.svg',
  link: 'https://github.com/facebook/hermes',
  options: {
    configurable: true,
    defaultValue: {
      babel: false,
      allowReturnOutsideFunction: true,
      flow: 'all',
      sourceType: 'unambiguous',
      tokens: false,
      enableExperimentalComponentSyntax: true,
      enableExperimentalFlowMatchSyntax: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'hermes-parser',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}`,
  init: (url) => importUrl(url, true),
  parse(code, options) {
    return this.parse(code, options)
  },
  editorLanguage: 'javascript',
  getNodeLocation: genGetNodeLocation('range'),
  gui: () => import('./HermesGui.vue'),
}
