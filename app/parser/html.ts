import { htmlTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as HtmlEslintParser from '@html-eslint/parser'
import type * as AngularHtmlParser from 'angular-html-parser'
import type * as Htmlparser2 from 'htmlparser2'
import type * as Rehype from 'rehype'
import type * as Ultrahtml from 'ultrahtml'

// @unocss-include

const htmlparser2: Parser<typeof Htmlparser2, Htmlparser2.Options> = {
  id: 'htmlparser2',
  label: 'htmlparser2',
  icon: 'i-vscode-icons:file-type-html',
  link: 'https://feedic.com/htmlparser2/',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: `return { withStartIndices: true, withEndIndices: true }`,
    editorLanguage: 'javascript',
    defaultValueType: 'javascript',
  },
  pkgName: 'htmlparser2',
  parse(code, options) {
    return this.parseDocument(code, options)
  },
  getNodeLocation: genGetNodeLocation('htmlparser2'),
  hideKeys: ['parent', 'prev', 'next'],
}

const rehypeAst: Parser<typeof Rehype> = {
  id: 'rehype',
  label: 'rehype',
  icon: 'https://avatars.githubusercontent.com/u/25711728',
  link: 'https://github.com/rehypejs/rehype',
  editorLanguage: 'html',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'javascript',
  },
  pkgName: 'rehype',
  parse(code) {
    return this.rehype().parse(code)
  },
  getNodeLocation: genGetNodeLocation('positionOffset'),
}

const htmlEslintParser: Parser<
  typeof HtmlEslintParser,
  HtmlEslintParser.ParserOptions
> = {
  id: 'html-eslint-parser',
  label: '@html-eslint/parser',
  icon: 'https://raw.githubusercontent.com/yeonjuan/html-eslint/main/packages/website/src/assets/logo_180x180.png',
  link: 'https://github.com/yeonjuan/html-eslint',
  editorLanguage: 'html',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: '@html-eslint/parser',
  parse(code, options) {
    return this.parseForESLint(code, { ...options }).ast
  },
  getNodeLocation: genGetNodeLocation('range'),
}

const ultrahtmlParser: Parser<typeof Ultrahtml> = {
  id: 'ultrahtml-parser',
  label: 'ultrahtml',
  icon: 'i-vscode-icons:file-type-html',
  link: 'https://github.com/natemoo-re/ultrahtml/',
  editorLanguage: 'html',
  options: {
    configurable: false,
    defaultValue: '{}',
    editorLanguage: 'javascript',
  },
  pkgName: 'ultrahtml',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/dist/index.js`),
  parse(code) {
    return this.parse(code)
  },
  valueHint(key, value) {
    if (key !== 'type') return
    switch (value) {
      case this.DOCUMENT_NODE:
        return 'DOCUMENT_NODE'
      case this.ELEMENT_NODE:
        return 'ELEMENT_NODE'
      case this.TEXT_NODE:
        return 'TEXT_NODE'
      case this.COMMENT_NODE:
        return 'COMMENT_NODE'
      case this.DOCTYPE_NODE:
        return 'DOCTYPE_NODE'
      default:
        return `NodeType.${value}`
    }
  },
  getNodeLocation: genGetNodeLocation('ultrahtml'),
  hideKeys: ['parent'],
}

const angularHtmlParser: Parser<typeof AngularHtmlParser> = {
  id: 'angular-html-parser',
  label: 'angular-html-parser',
  icon: 'i-vscode-icons:file-type-html',
  link: 'https://github.com/prettier/angular-html-parser/',
  editorLanguage: 'html',
  options: {
    configurable: false,
    defaultValue: '{}',
    editorLanguage: 'javascript',
  },
  pkgName: 'angular-html-parser',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg),
  parse(code) {
    return this.parse(code)
  },
  getNodeLocation: genGetNodeLocation('angularHtmlParser'),
  hideKeys: ['file'],
}

export const html: LanguageOption = {
  label: 'HTML',
  icon: 'i-vscode-icons:file-type-html',
  parsers: [
    htmlparser2,
    rehypeAst,
    htmlEslintParser,
    ultrahtmlParser,
    angularHtmlParser,
  ],
  codeTemplate: htmlTemplate,
}
