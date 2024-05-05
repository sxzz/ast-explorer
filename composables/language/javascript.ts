import type { LanguageOption, Parser } from '../language'
import type * as TsEslint from '@typescript-eslint/parser'
import type * as Babel from '@babel/parser'
import type * as Swc from '@swc/wasm-web'
import type * as Acorn from 'acorn'
import type * as Ts from 'typescript'
import type * as Oxc from '@oxc-parser/wasm/web/oxc_parser_wasm'

// @unocss-include

const getAstLocationBabel = getAstLocation.bind(null, 'babel')

const babel: Parser<typeof Babel, Babel.ParserOptions> = {
  id: 'babel',
  label: '@babel/parser',
  icon: 'i-vscode-icons:file-type-babel2',
  link: 'https://babeljs.io/docs/babel-parser',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      plugins: [],
    },
    editorLanguage: 'json',
  },
  pkgName: '@babel/parser',
  init: (pkg) => importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/+esm`),
  version: fetchVersion,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage(options) {
    try {
      const plugins = Array.isArray(options?.plugins) ? options!.plugins : []
      const normalizedPlugins = plugins.map((item) =>
        Array.isArray(item) ? item[0] : item,
      )
      if (normalizedPlugins.includes('typescript')) return 'typescript'
    } catch (error) {
      console.error(error)
    }
    return 'javascript'
  },
  getAstLocation: getAstLocationBabel,
}

function adjustSwcOffsetOfAst(obj: unknown, startOffset: number) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => adjustSwcOffsetOfAst(item, startOffset))
  } else if (isRecord(obj)) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'span' && value && isSpan(value)) {
        const span = value
        span.start -= startOffset
        span.end -= startOffset
      } else {
        adjustSwcOffsetOfAst(obj[key], startOffset)
      }
    })
  }

  function isRecord(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && obj !== null
  }

  function isSpan(obj: unknown): obj is { start: number; end: number } {
    return (
      typeof obj === 'object' && obj !== null && 'start' in obj && 'end' in obj
    )
  }
}

const swc: Parser<typeof Swc, Swc.ParseOptions> = {
  id: 'swc',
  label: 'SWC',
  icon: 'i-vscode-icons:file-type-swc',
  link: 'https://swc.rs/docs/usage/core#parse',
  options: {
    configurable: true,
    defaultValue: {
      syntax: 'ecmascript',
      jsx: false,
      decorators: false,
      importAssertions: false,
    },
    editorLanguage: 'json',
  },
  pkgName: '@swc/wasm-web',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/wasm-web.js`).then(
      async (mod: typeof Swc) => {
        await mod.default()
        return mod
      },
    ),
  version: fetchVersion,
  async parse(code, options) {
    const result = await this.parse(code, { ...(options as any) })
    adjustSwcOffsetOfAst(result, result.span.start)
    return result
  },
  editorLanguage(options) {
    return options?.syntax === 'typescript' ? 'typescript' : 'javascript'
  },
  getAstLocation: getAstLocation.bind(null, 'swc'),
}

const oxc: Parser<typeof Oxc, Partial<Oxc.ParserOptions>> = {
  id: 'oxc',
  label: 'Oxc',
  icon: 'i-vscode-icons:file-type-js-official',
  link: 'https://oxc-project.github.io/docs/guide/usage/parser.html',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      sourceFilename: 'foo.ts',
    },
    editorLanguage: 'json',
  },
  pkgName: '@oxc-parser/wasm',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/oxc_parser_wasm.js`).then(
      async (mod: typeof Oxc) => {
        await mod.default()
        return mod
      },
    ),
  version: fetchVersion,
  parse(code, options) {
    const { program, errors } = this.parseSync(code, { ...options })
    return { program, errors }
  },
  editorLanguage(options) {
    return options.sourceFilename?.endsWith('.ts') ? 'typescript' : 'javascript'
  },
  getAstLocation: getAstLocation.bind(null, 'babel'),
}

const acorn: Parser<typeof Acorn, Acorn.Options> = {
  id: 'acorn',
  label: 'Acorn',
  icon: 'i-vscode-icons:file-type-js-official',
  link: 'https://github.com/acornjs/acorn',
  options: {
    configurable: true,
    defaultValue: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    editorLanguage: 'json',
  },
  pkgName: 'acorn',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/dist/acorn.mjs`),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getAstLocation: getAstLocationBabel,
}

const ts: Parser<typeof Ts, Ts.CreateSourceFileOptions> = {
  id: 'typescript',
  label: 'typescript',
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
  getAstLocation: getAstLocation.bind(null, 'ts'),
}

const espree: Parser<any, any> = {
  id: 'espree',
  label: 'espree',
  icon: 'i-vscode-icons:file-type-eslint',
  link: 'https://github.com/eslint/espree',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      loc: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'espree',
  init: (pkg) => importUrl(`https://cdn.skypack.dev/${pkg}?min`),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getAstLocation: getAstLocation.bind(null, 'babel'),
}

const tsEslint: Parser<typeof TsEslint, TsEslint.ParserOptions> = {
  id: 'typescript-eslint',
  label: '@typescript-eslint/parser',
  icon: 'i-vscode-icons:file-type-eslint',
  link: 'https://typescript-eslint.io/packages/parser/',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      // loc: true,
      range: true,
    },
    editorLanguage: 'json',
  },
  pkgName: '@typescript-eslint/parser',
  init: () => import('@typescript-eslint/parser'),
  async version() {
    return (await this).version
  },
  versionOverridable: false,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'typescript',
  getAstLocation: getAstLocation.bind(null, 'ranges'),
}

export const javascript: LanguageOption = {
  label: 'JavaScript',
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: [babel, swc, oxc, acorn, ts, espree, tsEslint],
}
