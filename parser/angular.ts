import { angularTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as AngularCompiler from '@angular/compiler'

// @unocss-include

// Node's title rely on the constructor name but because of minification, we need to rematch with exported names
let angularCompilerKeys: Array<keyof typeof AngularCompiler> | undefined

const getTplNodeLocation = genGetNodeLocation('angularCompilerTmpl')
const getAstNodeLocation = genGetNodeLocation('angularCompilerAst')

const angularCompiler: Parser<
  typeof AngularCompiler,
  AngularCompiler.ParseTemplateOptions
> = {
  id: 'angular-compiler',
  label: '@angular/compiler',
  icon: 'i-vscode-icons:file-type-angular',
  link: 'https://angular.dev',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: {
      preserveWhitespaces: true,
      preserveLineEndings: true,
      preserveSignificantWhitespace: true,
      leadingTriviaChars: [],
    },
    editorLanguage: 'json',
  },
  pkgName: '@angular/compiler',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}/es2022/compiler.mjs`,
  parse(code, options) {
    return this.parseTemplate(code, 'template.html', options)
  },
  init: async (url) => {
    const mod = await importUrl(url)
    angularCompilerKeys ??= Object.keys(mod).filter(
      (k) => typeof mod[k] === 'function',
    ) as Array<keyof typeof AngularCompiler>
    return mod
  },
  getNodeLocation(node: any) {
    return getTplNodeLocation(node) ?? getAstNodeLocation(node)
  },
  nodeTitle(value) {
    if (!value || !angularCompilerKeys) return

    const matchingKeys = angularCompilerKeys.filter(
      (k) => value instanceof (this[k] as Function),
    )

    // Many keys can match because of abstract classes. Generic classes are declared before concrete classes. We can take the last one.
    return matchingKeys.at(-1)
  },
}

export const angular: LanguageOption = {
  label: 'Angular',
  icon: 'i-vscode-icons:file-type-angular',
  parsers: [angularCompiler],
  codeTemplate: angularTemplate,
}
