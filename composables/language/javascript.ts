import { type LanguageOption, type Parser, getAstLocation } from '../language'
import type * as TsEslint from '@typescript-eslint/parser'
import type * as Babel from '@babel/parser'
import type * as Swc from '@swc/wasm-web'
import type * as Acorn from 'acorn'
import type * as Ts from 'typescript'

// @unocss-include

const getAstLocationBabel = getAstLocation.bind(null, 'babel')

const babel: Parser<typeof Babel, Babel.ParserOptions> = {
  id: 'babel',
  label: '@babel/parser',
  icon: 'i-vscode-icons:file-type-babel2',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      plugins: [],
    },
    editorLanguage: 'json',
  },
  // @ts-expect-error
  init: () => import('https://cdn.jsdelivr.net/npm/@babel/parser/+esm'),
  version: () =>
    fetch('https://cdn.jsdelivr.net/npm/@babel/parser/package.json')
      .then((r) => r.json())
      .then((raw) => `@babel/parser@${raw.version}`),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage(options) {
    try {
      const plugins = Array.isArray(options?.plugins) ? options!.plugins : []
      const normalizedPlugins = plugins.map((item) =>
        Array.isArray(item) ? item[0] : item
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
  init: () =>
    import(
      // @ts-expect-error
      'https://cdn.jsdelivr.net/npm/@swc/wasm-web/wasm-web.js'
    ).then(async (mod: typeof Swc) => {
      await mod.default()
      return mod
    }),
  version: () =>
    fetch('https://cdn.jsdelivr.net/npm/@swc/wasm-web/package.json')
      .then((r) => r.json())
      .then((raw) => `@swc/wasm-web@${raw.version}`),
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

const acorn: Parser<typeof Acorn, Acorn.Options> = {
  id: 'acorn',
  label: 'Acorn',
  icon: 'i-vscode-icons:file-type-js-official',
  options: {
    configurable: true,
    defaultValue: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    editorLanguage: 'json',
  },
  // @ts-expect-error
  init: () => import('https://cdn.jsdelivr.net/npm/acorn/dist/acorn.mjs'),
  async version() {
    return `acorn@${(await this).version}`
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getAstLocation: getAstLocationBabel,
}

const tsEslint: Parser<typeof TsEslint, TsEslint.ParserOptions> = {
  id: 'typescript-eslint',
  label: '@typescript-eslint/parser',
  icon: 'i-vscode-icons:file-type-eslint',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
    },
    editorLanguage: 'json',
  },
  init: () => import('@typescript-eslint/parser'),
  async version() {
    return `@typescript-eslint/parser@${(await this).version}`
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'typescript',
}

const ts: Parser<typeof Ts, Ts.CreateSourceFileOptions> = {
  id: 'typescript',
  label: 'typescript',
  icon: 'i-vscode-icons:file-type-typescript-official',
  options: {
    configurable: true,
    defaultValue: {
      languageVersion: 99,
    },
    editorLanguage: 'json',
  },
  init: () =>
    // @ts-expect-error
    import('https://cdn.jsdelivr.net/npm/typescript/+esm').then(
      (mod) => mod.default
    ),
  async version() {
    return `typescript@${(await this).version}`
  },
  parse(code, options) {
    return this.createSourceFile('foo.ts', code, { ...options })
  },
  editorLanguage: 'typescript',
  getAstLocation: getAstLocation.bind(null, 'ts'),
}

export const javascript: LanguageOption = {
  label: 'JavaScript',
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: [babel, swc, acorn, tsEslint, ts],
}
