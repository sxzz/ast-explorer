import { markdownTemplate } from '../template'
import type { LanguageOption, Parser } from '../index'
import type * as Comark from 'comark'
import type * as Marked from 'marked'
import type * as Remark from 'remark'

export interface RemarkOptions {
  mdx?: boolean
  frontmatter?: boolean
  directive?: boolean
  gfm?: boolean
  raw?: boolean
}

export interface ComarkOptions {
  html?: boolean
  autoUnwrap?: boolean
  autoClose?: boolean
}

export interface MarkedOptions {
  gfm?: boolean
  pedantic?: boolean
  breaks?: boolean
}

// @unocss-include
const remark: Parser<typeof Remark, RemarkOptions> = {
  id: 'remark',
  label: 'remark',
  icon: 'https://raw.githubusercontent.com/remarkjs/remark/refs/heads/main/logo-square.svg',
  link: 'https://github.com/remarkjs/remark',
  editorLanguage: 'markdown',
  options: {
    configurable: true,
    defaultValue: {
      mdx: false,
      frontmatter: false,
      directive: false,
      gfm: false,
      raw: false,
    },
    editorLanguage: 'json',
  },
  pkgName: 'remark',
  async parse(code, options) {
    let processor = this.remark()

    const plugins = await Promise.all(
      [
        options?.mdx && 'https://esm.sh/remark-mdx',
        options?.frontmatter && 'https://esm.sh/remark-frontmatter',
        options?.directive && 'https://esm.sh/remark-directive',
        options?.gfm && 'https://esm.sh/remark-gfm',
        options?.raw && 'https://esm.sh/rehype-raw',
      ].map((url) => url && importUrl(url)),
    )
    for (const plugin of plugins) {
      if (plugin?.default) {
        processor = processor.use(plugin.default)
      }
    }

    return processor.parse(code)
  },
  getNodeLocation: genGetNodeLocation('positionOffset'),
  gui: () => import('./RemarkGui.vue'),
}

const comark: Parser<typeof Comark, ComarkOptions> = {
  id: 'comark',
  label: 'Comark',
  icon: 'https://raw.githubusercontent.com/comarkdown/comark/refs/heads/main/docs/public/logo-light.svg',
  link: 'https://comark.dev',
  editorLanguage: 'markdown',
  options: {
    configurable: true,
    defaultValue: {
      html: true,
      autoUnwrap: true,
      autoClose: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'comark',
  parse(code, options) {
    return this.parse(code, options)
  },
  gui: () => import('./ComarkGui.vue'),
}

const marked: Parser<typeof Marked, MarkedOptions> = {
  id: 'marked',
  label: 'marked',
  icon: 'https://raw.githubusercontent.com/markedjs/marked/refs/heads/master/docs/img/logo-black.svg',
  link: 'https://github.com/markedjs/marked',
  editorLanguage: 'markdown',
  options: {
    configurable: true,
    defaultValue: {
      gfm: true,
      pedantic: false,
      breaks: false,
    },
    editorLanguage: 'json',
  },
  pkgName: 'marked',
  parse(code, options) {
    return this.marked.lexer(code, options)
  },
}

export const markdown: LanguageOption = {
  label: 'Markdown',
  icon: 'i-vscode-icons:file-type-markdown',
  parsers: [remark, comark, marked],
  codeTemplate: markdownTemplate,
}
