import { markdownTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Remark from 'remark'

export interface RemarkOptions {
  mdx?: boolean
  frontmatter?: boolean
  directive?: boolean
  gfm?: boolean
  raw?: boolean
}

// @unocss-include
const remarkAst: Parser<typeof Remark, RemarkOptions> = {
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

export const markdown: LanguageOption = {
  label: 'Markdown',
  icon: 'i-vscode-icons:file-type-markdown',
  parsers: [remarkAst],
  codeTemplate: markdownTemplate,
}
