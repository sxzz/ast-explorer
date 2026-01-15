import type { Parser } from '..'

// https://github.com/facebook/flow/tree/main/packages/flow-parser#options
export interface Options {
  // Basic options
  types?: boolean
  use_strict?: boolean
  comments?: boolean
  all_comments?: boolean
  tokens?: boolean

  // Language features
  enums: boolean
  match: boolean
  components: boolean
  assert_operator: boolean
  esproposal_decorators: boolean
  // Undocumented, it seems the correct one for `match` option
  pattern_matching: boolean
  // Undocumented
  records: boolean
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
      types: true,
      enums: true,
      match: true,
      components: true,
      assert_operator: true,
      esproposal_decorators: true,
      pattern_matching: true,
      records: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'flow-parser',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}`,
  init: (url) => importUrl(url, true),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getNodeLocation: genGetNodeLocation('range'),
  gui: () => import('./FlowGui.vue'),
}
