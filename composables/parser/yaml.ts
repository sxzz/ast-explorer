import { markdownTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Yaml from 'yaml'

const yamlParser: Parser<
  typeof Yaml,
  Yaml.ParseOptions & Yaml.DocumentOptions & Yaml.SchemaOptions
> = {
  id: 'yaml',
  label: 'yaml',
  icon: 'https://raw.githubusercontent.com/eemeli/yaml-docs/5b416c12ce605370bb1df76833d19fd0df51f70c/source/images/logo.png',
  link: 'https://eemeli.org/yaml/',
  editorLanguage: 'yaml',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'yaml',
  getModuleUrl: getJsdelivrUrl,
  version: fetchVersion,
  parse(code, options) {
    return this.parseDocument(code, { ...options })
  },
  getAstLocation: genGetAstLocation('range'),
}

export const yaml: LanguageOption = {
  label: 'YAML',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-yaml',
  parsers: [yamlParser],
  codeTemplate: markdownTemplate,
}
