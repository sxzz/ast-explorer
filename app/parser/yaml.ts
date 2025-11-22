import { yamlTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Yaml from 'yaml'
import type * as YamlEslintParser from 'yaml-eslint-parser'

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
  parse(code, options) {
    return this.parseAllDocuments(code, { ...options })
  },
  getNodeLocation: genGetNodeLocation('range'),
}

const yamlEslintParser: Parser<typeof YamlEslintParser, any> = {
  id: 'yaml-eslint-parser',
  label: 'yaml-eslint-parser',
  icon: 'i-vscode-icons:file-type-yaml',
  link: 'https://github.com/ota-meshi/yaml-eslint-parser',
  editorLanguage: 'yaml',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'yaml-eslint-parser',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}`,
  parse(code, options) {
    return this.parseYAML(code, options)
  },
  getNodeLocation: genGetNodeLocation('range'),
  hideKeys: ['parent'],
}

export const yaml: LanguageOption = {
  label: 'YAML',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-yaml',
  parsers: [yamlParser, yamlEslintParser],
  codeTemplate: yamlTemplate,
}
