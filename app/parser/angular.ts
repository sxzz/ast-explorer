import { angularTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as AngularCompiler from '@angular/compiler'
import type * as AngularHtmlParser from 'angular-html-parser'

const getTplNodeLocation = genGetNodeLocation('angularCompilerTmpl')
const getAstNodeLocation = genGetNodeLocation('angularCompilerAst')

const angularCompiler: Parser<
  typeof AngularCompiler,
  AngularCompiler.ParseTemplateOptions
> = {
  id: 'angular-compiler',
  label: '@angular/compiler',
  // @unocss-include
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
  parse(code, options) {
    return this.parseTemplate(code, 'template.html', options)
  },
  getNodeLocation(node: any) {
    return getTplNodeLocation(node) ?? getAstNodeLocation(node)
  },
  nodeTitle(value) {
    if (!value) return

    const angularCompilerKeys = getCompilerKeys(this)
    const matchingKeys = angularCompilerKeys.filter(
      (k) => value instanceof (this[k] as Function),
    )

    // Many keys can match because of abstract classes. Generic classes are declared before concrete classes. We can take the last one.
    return matchingKeys.at(-1)
  },
}

const cache = new WeakMap<
  typeof AngularCompiler,
  Array<keyof typeof AngularCompiler>
>()

// Node's title rely on the constructor name but because of minification,
// we need to rematch with exported names
function getCompilerKeys(compiler: typeof AngularCompiler) {
  const cached = cache.get(compiler)
  if (cached) return cached

  const keys = Object.entries(compiler)
    .filter(([, v]) => typeof v === 'function')
    .map(([k]) => k) as Array<keyof typeof AngularCompiler>
  cache.set(compiler, keys)
  return keys
}

const angularHtmlParserOptionsForAngular: AngularHtmlParser.ParseOptions = {
  canSelfClose: true,
  allowHtmComponentClosingTags: false,
  isTagNameCaseSensitive: false,
  tokenizeAngularBlocks: true,
  tokenizeAngularLetDeclaration: true,
}
const angularHtmlParser: Parser<
  typeof AngularHtmlParser,
  AngularHtmlParser.ParseOptions
> = {
  id: 'angular-html-parser/angular',
  label: 'angular-html-parser (Angular)',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-angular',
  link: 'https://github.com/prettier/angular-html-parser',
  editorLanguage: 'html',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'angular-html-parser',
  parse(code) {
    return this.parse(code, angularHtmlParserOptionsForAngular)
  },
  getNodeLocation: genGetNodeLocation('angularHtmlParser'),
  hideKeys: ['file', 'tokens'],
}

export const angular: LanguageOption = {
  label: 'Angular',
  icon: 'i-vscode-icons:file-type-angular',
  parsers: [angularCompiler, angularHtmlParser],
  codeTemplate: angularTemplate,
}
