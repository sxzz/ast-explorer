import {
  COMMENT_NODE,
  DOCTYPE_NODE,
  DOCUMENT_NODE,
  ELEMENT_NODE,
  TEXT_NODE,
} from 'ultrahtml'
import { htmlTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as HtmlEslintParser from '@html-eslint/parser'
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
  parse(code) {
    return this.parse(code)
  },
  valueHint(key, value) {
    if (key !== 'type') return
    if (value === DOCUMENT_NODE) {
      return 'DOCUMENT_NODE'
    } else if (value === ELEMENT_NODE) {
      return 'ELEMENT_NODE'
    } else if (value === TEXT_NODE) {
      return 'TEXT_NODE'
    } else if (value === COMMENT_NODE) {
      return 'COMMENT_NODE'
    } else if (value === DOCTYPE_NODE) {
      return 'DOCTYPE_NODE'
    } else {
      return `NodeType.${value}`
    }
  },
  getNodeLocation: genGetNodeLocation('ultrahtml'),
  hideKeys: ['parent'],
}

export const html: LanguageOption = {
  label: 'HTML',
  icon: 'i-vscode-icons:file-type-html',
  parsers: [htmlparser2, rehypeAst, htmlEslintParser, ultrahtmlParser],
  codeTemplate: htmlTemplate,
}
