import type { Parser } from '..'
import type * as TypescriptAst from 'typescript-next/ast'
import type * as TypescriptAsync from 'typescript-next/async'
import type * as TypescriptWasm from 'typescript-next/wasm'

export interface TypescriptWasmContext {
  api: TypescriptAsync.API
  ast: typeof TypescriptAst
  version: string
}
export type TypescriptWasmOptions = TypescriptAsync.CreateSourceFileOptions

export const typescriptWasm: Parser<
  TypescriptWasmContext,
  TypescriptWasmOptions
> = {
  id: 'typescript-wasm',
  label: 'TypeScript (WASM)',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-typescript-official',
  link: 'https://www.typescriptlang.org/',
  options: {
    configurable: true,
    defaultValue: {
      scriptKind: 3 satisfies TypescriptAst.ScriptKind.TS,
    },
    editorLanguage: 'json',
  },
  pkgName: 'typescript',
  defaultVersion: 'next',
  async version() {
    return (await this).version
  },
  async init(_url, pkgId) {
    if (isUrl(pkgId)) {
      throw new Error(
        'TypeScript (WASM) cannot be loaded from a URL. Please use a version number or tag instead.',
      )
    }

    const version = await fetchVersion(pkgId)
    const pkg = `typescript@${version}`
    const [{ instantiateWasm, WasmTransport }, { API }, ast, wasmModule] =
      await Promise.all([
        importModule<typeof TypescriptWasm>(
          getJsdelivrUrl(pkg, '/dist/wasm/index.js'),
        ),
        importModule<typeof TypescriptAsync>(
          getJsdelivrUrl(pkg, '/dist/api/async/api.js'),
        ),
        importModule<typeof TypescriptAst>(
          getJsdelivrUrl(pkg, '/dist/ast/index.js'),
        ),
        // jsDelivr refuses to serve files as large as `tsc.wasm`
        WebAssembly.compileStreaming(
          fetch(
            `https://unpkg.com/@typescript/typescript-wasip1-wasm@${version}/lib/tsc.wasm`,
          ),
        ),
      ]).catch((error) => {
        throw new Error(
          `Failed to load the WebAssembly build of TypeScript ${version}. It is only published for TypeScript 7.1 and later.`,
          { cause: error },
        )
      })

    const instance = await instantiateWasm(wasmModule)
    const api = new API({ transport: new WasmTransport({ instance }) })
    return { api, ast, version }
  },
  async parse(code, options) {
    const retained = await this.api.createSourceFile('/foo.ts', code, options)
    try {
      return toPlainNode(this.ast, retained.sourceFile)
    } finally {
      await retained.dispose()
    }
  },
  editorLanguage: 'typescript',
  getNodeLocation(node: any, ast?: boolean) {
    if (ast) {
      if (node.type !== 'Object') return
      const pos = getJsonValue(node, ['pos'])
      const end = getJsonValue(node, ['end'])
      if (typeof pos === 'number' && typeof end === 'number') return [pos, end]
      return
    }

    // Only nodes converted by this parser. The AST of the previous parser stays
    // on screen while this one loads, and following the cyclic `parent` of
    // legacy TypeScript nodes would never end.
    const start = nodeStarts.get(node)
    if (start !== undefined) return [start, node.end]
  },
  // `this` is not the module of this parser while switching from another one
  nodeTitle(value) {
    const kind: TypescriptAst.SyntaxKind | undefined = value?.kind
    if (typeof kind !== 'number' || !this?.ast) return
    return this.ast.formatSyntaxKind(kind)
  },
  valueHint(key, value) {
    if (typeof value !== 'number' || !this?.ast) return
    const { ast } = this

    switch (key) {
      case 'kind':
      case 'keyword':
      case 'keywordToken':
      case 'operator':
      case 'phaseModifier':
      case 'token':
        return `SyntaxKind.${ast.formatSyntaxKind(value)}`
      case 'flags':
        return formatFlags('NodeFlags', ast.NodeFlags, value)
      case 'tokenFlags':
      case 'templateFlags':
        return formatFlags('TokenFlags', ast.TokenFlags, value)
      case 'scriptKind':
        return `ScriptKind.${ast.ScriptKind[value]}`
      case 'languageVariant':
        return `LanguageVariant.${ast.LanguageVariant[value]}`
    }
  },
  gui: () => import('./TypescriptWasmGui.vue'),
}

const nodeStarts = new WeakMap<object, number>()

function toPlainNode(ast: typeof TypescriptAst, root: TypescriptAst.Node) {
  const converted = new Map<object, unknown>()
  return convert(root)

  function convert(value: unknown): unknown {
    if (!value || typeof value !== 'object') return value
    if (converted.has(value)) return converted.get(value)

    if (Array.isArray(value)) {
      const list: any[] = []
      converted.set(value, list)
      for (const item of value) list.push(convert(item))
      if (isNodeArray(value)) {
        const { pos, end, hasTrailingComma } = value
        Object.assign(list, { pos, end, hasTrailingComma })
        nodeStarts.set(list, pos)
      }
      return list
    }

    if (!isNode(value)) return value

    const node: Record<string, unknown> = {
      kind: value.kind,
      pos: value.pos,
      end: value.end,
      flags: value.flags,
    }
    converted.set(value, node)
    nodeStarts.set(node, value.getStart())

    // Some getters of the lazy view are not guarded by kind, so the properties
    // can't be discovered from the view itself. `cloneNode` is generated from
    // the AST schema and copies exactly the properties of the node's kind.
    const { _data: data } = ast.factory.cloneNode(value) as unknown as {
      _data?: Record<string, unknown>
    }
    for (const [key, child] of Object.entries(data ?? {})) {
      node[key] = convert(child)
    }

    const { jsDoc } = value as { jsDoc?: TypescriptAst.Node[] }
    if (jsDoc) node.jsDoc = convert(jsDoc)

    return node
  }
}

function isNode(value: object): value is TypescriptAst.Node {
  return typeof (value as TypescriptAst.Node).kind === 'number'
}

function isNodeArray(
  value: unknown[],
): value is unknown[] & TypescriptAst.NodeArray<TypescriptAst.Node> {
  return typeof (value as Partial<TypescriptAst.TextRange>).pos === 'number'
}

function formatFlags(
  enumName: string,
  flags: Record<string, string | number>,
  value: number,
) {
  const names: string[] = []
  for (const [name, flag] of Object.entries(flags)) {
    if (typeof flag !== 'number' || !flag || flag & (flag - 1)) continue
    if (value & flag) {
      names.push(`${enumName}.${name}`)
      value &= ~flag
    }
  }
  return names.join(' | ')
}
