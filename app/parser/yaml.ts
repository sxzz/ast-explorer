import { yamlTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Yaml from 'yaml'
import type * as YamlEslintParser from 'yaml-eslint-parser'
import type * as YamlUnistParser from 'yaml-unist-parser'

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

const yamlUnistParser: Parser<
  typeof YamlUnistParser,
  YamlUnistParser.ParseOptions
> = {
  id: 'yaml-unist-parser',
  label: 'yaml-unist-parser',
  icon: 'i-vscode-icons:file-type-yaml',
  link: 'https://github.com/prettier/yaml-unist-parser',
  editorLanguage: 'yaml',
  options: {
    configurable: false,
    defaultValue: {
      uniqueKeys: false,
    },
    editorLanguage: 'json',
  },
  pkgName: 'yaml-unist-parser',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}`,
  parse(code, options) {
    return this.parse(code, options)
  },
  getNodeLocation: genGetNodeLocation('positionOffset'),
  hideKeys: ['parent'],
}

export const yaml: LanguageOption = {
  label: 'YAML',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-yaml',
  parsers: [yamlParser, yamlEslintParser, yamlUnistParser],
  codeTemplate: yamlTemplate,
}
