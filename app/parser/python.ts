import { pythonTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Pyodide from 'pyodide'

const pyodide: Parser<Pyodide.PyodideAPI> = {
  id: 'pyodide',
  label: 'pyodide',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-python',
  link: 'https://pyodide.org/',
  editorLanguage: 'python',
  options: {
    configurable: false,
    defaultValue: {},
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

def parse_code(code):
  dict = ast_to_dict(ast.parse(code))
  return json.dumps(dict)
`)

    return pyodide
  },

  async parse(code) {
    const result = await this.runPythonAsync(
      `parse_code(${JSON.stringify(code)})`,
    )
    return JSON.parse(result)
  },
}

export const python: LanguageOption = {
  label: 'Python',
  icon: 'i-vscode-icons:file-type-python',
  parsers: [pyodide],
  codeTemplate: pythonTemplate,
}
