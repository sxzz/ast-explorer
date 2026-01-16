import { graphqlTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as GraphQL from 'graphql'

// @unocss-include

const graphqlParser: Parser<typeof GraphQL, GraphQL.ParseOptions> = {
  id: 'graphql',
  label: 'graphql',
  icon: 'i-vscode-icons:file-type-graphql',
  link: 'https://www.graphql-js.org/docs/',
  editorLanguage: 'graphql',
  options: {
    configurable: true,
    defaultValue: {
      noLocation: false,
    },
    editorLanguage: 'json',
  },
  pkgName: 'graphql',
  parse(code, options) {
    return this.parse(code, options)
  },
  getNodeLocation: genGetNodeLocation('graphql'),
}

export const graphql: LanguageOption = {
  label: 'GraphQL',
  icon: 'i-vscode-icons:file-type-graphql',
  parsers: [graphqlParser],
  codeTemplate: graphqlTemplate,
}
