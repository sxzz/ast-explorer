import { createContext, SourceTextModule } from 'node:vm'
import consola from 'consola'
import { buildTsEslintParser } from './build-parser.ts'

const { code } = await buildTsEslintParser(consola, true)
const mod = new SourceTextModule(code, { context: createContext() })
await mod.link((specifier) => {
  throw new Error(`Unable to resolve dependency: ${specifier}`)
})
await mod.evaluate()
const { parse } = mod.namespace as typeof import('@typescript-eslint/parser')
const ast = parse('const foo: number = 1')
if (ast) {
  consola.success('Parser built successfully')
} else {
  consola.error('Parser built failed')
}
