import { pythonTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Pyodide from 'pyodide'

interface Options {
  filename?: string
  mode?: string
  type_comments?: boolean
  feature_version?: number
  optimize?: number
}

const pyodide: Parser<Pyodide.PyodideAPI, Options> = {
  id: 'pyodide',
  label: 'pyodide',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-python',
  link: 'https://pyodide.org/',
  editorLanguage: 'python',
  options: {
    configurable: false,
    defaultValue: {
      type_comments: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'pyodide',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/pyodide.mjs'),
  async version() {
    return (await this).version
  },
  async init(moduleUrl) {
    const mod = await importUrl<typeof Pyodide>(moduleUrl)

    const pyodide = await mod.loadPyodide({
      stdout: console.info,
      stderr: console.error,
    })
    await pyodide.runPythonAsync(`
import ast
import json

def ast_to_dict(node):
  if isinstance(node, ast.AST):
    result = {"type": node.__class__.__name__}
    for field in node._fields:
        result[field] = ast_to_dict(getattr(node, field))
    for attr in node._attributes:
        result[attr] = ast_to_dict(getattr(node, attr))
    return result
  elif isinstance(node, list):
    return [ast_to_dict(item) for item in node]
  else:
    return node

def parse_code(code, options):
  dict = ast_to_dict(ast.parse(code, **options))
  return json.dumps(dict)
`)

    return pyodide
  },

  async parse(code, options) {
    const result = await this.runPythonAsync(`parse_code(code, options)`, {
      locals: this.toPy({
        code,
        options: this.toPy(options),
      }),
    })
    return JSON.parse(result)
  },

  getNodeLocation(node, ast) {
    if (ast ? node.type !== 'Object' : typeof node !== 'object') return

    const get = ast ? getJsonValue : getValue
    const type = get(node, ['type'])
    if (!type) return

    const lineno = get(node, ['lineno'])
    const col_offset = get(node, ['col_offset'])
    const end_lineno = get(node, ['end_lineno'])
    const end_col_offset = get(node, ['end_col_offset'])
    if (
      typeof lineno !== 'number' ||
      typeof col_offset !== 'number' ||
      typeof end_lineno !== 'number' ||
      typeof end_col_offset !== 'number'
    )
      return

    const start = getOffset(code.value, lineno, col_offset)
    const end = getOffset(code.value, end_lineno, end_col_offset)
    return [start, end]
  },
}

export const python: LanguageOption = {
  label: 'Python',
  icon: 'i-vscode-icons:file-type-python',
  parsers: [pyodide],
  codeTemplate: pythonTemplate,
}
