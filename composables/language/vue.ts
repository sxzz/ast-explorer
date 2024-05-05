import type { LanguageOption, Parser } from '../language'
import type * as Vue3Sfc from '@vue/compiler-sfc'
import type * as Vue3Dom from '@vue/compiler-dom'
import type * as VueVaporCompiler from '@vue-vapor/compiler-vapor'
// @unocss-include

const vue3Sfc: Parser<typeof Vue3Sfc, Vue3Sfc.SFCParseOptions> = {
  id: 'vue3-sfc',
  label: '@vue/compiler-sfc',
  icon: 'i-vscode-icons:file-type-vue',
  link: 'https://github.com/vuejs/core/tree/main/packages/compiler-sfc#api',
  editorLanguage: 'vue',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: '@vue/compiler-sfc',
  init: (pkg) =>
    importUrl(
      `https://cdn.jsdelivr.net/npm/${pkg}/dist/compiler-sfc.esm-browser.js`,
    ),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

const vue3SfcCompiled: Parser<
  typeof Vue3Sfc,
  { parse?: Vue3Sfc.SFCParseOptions; compile: Vue3Sfc.SFCScriptCompileOptions }
> = {
  ...vue3Sfc,
  id: 'vue3-script-setup',
  label: '@vue/compiler-sfc (script setup)',
  editorLanguage: 'vue',
  options: {
    configurable: true,
    defaultValue: {
      parse: {},
      compile: {
        id: 'foo.vue',
      },
    },
    editorLanguage: 'json',
  },
  parse(code, options) {
    const result = { ...this.parse(code, { ...options.parse }) }
    result.descriptor = { ...result.descriptor }
    result.descriptor.scriptSetup = this.compileScript(result.descriptor, {
      ...options.compile,
    })
    return result
  },
}

const vue3DomParse: Parser<typeof Vue3Dom, Vue3Dom.ParserOptions> = {
  id: 'vue3-dom-parse',
  label: '@vue/compiler-dom (parse)',
  icon: 'i-vscode-icons:file-type-vue',
  link: 'https://github.com/vuejs/core/tree/main/packages/compiler-dom',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: 'return {}',
    defaultValueType: 'javascript',
    editorLanguage: 'javascript',
  },
  pkgName: '@vue/compiler-dom',
  init: (pkg) =>
    importUrl(
      `https://cdn.jsdelivr.net/npm/${pkg}/dist/compiler-dom.esm-browser.js`,
    ),
  version: (pkg) => fetchVersion(pkg),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

const vue3DomCompile: Parser<typeof Vue3Dom, Vue3Dom.CompilerOptions> = {
  ...vue3DomParse,
  id: 'vue3-dom-compile',
  label: '@vue/compiler-dom (compile)',
  parse(code, options) {
    return this.compile(code, {
      nodeTransforms: [...this.DOMNodeTransforms],
      ...options,
    }).ast
  },
}

const vueVapor: Parser<
  typeof VueVaporCompiler,
  VueVaporCompiler.CompilerOptions
> = {
  id: 'vue-vapor',
  label: '@vue-vapor/compiler-vapor',
  icon: 'i-vscode-icons:file-type-vue',
  link: 'https://github.com/vuejs/core-vapor/tree/main/packages/compiler-vapor',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: 'return {}',
    defaultValueType: 'javascript',
    editorLanguage: 'javascript',
  },
  pkgName: '@vue-vapor/compiler-vapor',
  init: (pkg) =>
    importUrl(
      `https://cdn.jsdelivr.net/npm/${pkg}/dist/compiler-vapor.esm-browser.js`,
    ),
  version: fetchVersion,
  parse(code, options) {
    return this.compile(code, { ...options }).ast
  },
}

export const vue: LanguageOption = {
  label: 'Vue',
  icon: 'i-vscode-icons:file-type-vue',
  parsers: [vue3Sfc, vue3SfcCompiled, vue3DomParse, vue3DomCompile, vueVapor],
}
