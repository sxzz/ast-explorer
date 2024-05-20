import type { Parser } from '..'
import type Typescript from 'typescript'

export const typescript: Parser<
  typeof Typescript,
  Typescript.CreateSourceFileOptions
> = {
  id: 'typescript',
  label: 'typescript',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-typescript-official',
  link: 'https://www.typescriptlang.org/',
  options: {
    configurable: true,
    defaultValue: {
      languageVersion: 99,
    },
    editorLanguage: 'json',
  },
  pkgName: 'typescript',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/+esm`).then(
      (mod) => mod.default,
    ),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.createSourceFile('foo.ts', code, { ...options })
  },
  editorLanguage: 'typescript',
  getAstLocation: getAstLocation('ts'),
  astTitleField: 'kind',
  getAstTitle(value) {
    const kind = value?.kind
    if (kind == null) return
    return this.SyntaxKind[kind]
  },
}
