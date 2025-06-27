import type { Parser } from '..'

// https://github.com/facebook/flow/tree/main/packages/flow-parser#options
type Options = {
  all_comments?: boolean
  comments?: boolean
  enums: boolean
  esproposal_decorators: boolean
  esproposal_export_star_as: boolean
  tokens?: boolean
  types: boolean
  use_strict?: boolean
  // Undocumented
  components: boolean
  // Undocumented
  pattern_matching: boolean
}

export const flow: Parser<any, Options> = {
  id: 'flow',
  label: 'Flow',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-flow',
  link: 'https://github.com/facebook/flow/tree/main/packages/flow-parser',
  options: {
    configurable: true,
    defaultValue: {
      enums: true,
      esproposal_decorators: true,
      esproposal_export_star_as: true,
      types: true,
      components: true,
      pattern_matching: true,
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
  gui: () => import('./FlowGui.vue'),
}
