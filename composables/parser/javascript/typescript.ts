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
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg),
  init: (url) => importUrl(url).then((mod) => mod.default),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.createSourceFile('foo.ts', code, { ...options })
  },
  editorLanguage: 'typescript',
  getAstLocation: genGetAstLocation('typescript'),
  astTitleField: 'kind',
  getAstTitle(value) {
    const kind: Typescript.SyntaxKind | undefined = value?.kind
    if (kind == null) return
    return getSyntaxKind(this, kind)
  },
}

function getSyntaxKind(ts: typeof Typescript, kind: Typescript.SyntaxKind) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const syntaxKinds = {} as Record<Typescript.SyntaxKind, string>
  for (const [key, value] of Object.entries(ts.SyntaxKind)) {
    if (typeof value === 'number' && !syntaxKinds[value]) {
      syntaxKinds[value] = key
    }
  }
  return syntaxKinds[kind]
}
