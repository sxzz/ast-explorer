import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import pkg from '@typescript-eslint/parser/package.json' with { type: 'json' }
import { build } from 'rolldown'
import Replace from 'unplugin-replace/rolldown'
import type { ConsolaInstance } from 'consola'

const root = path.resolve(import.meta.dirname, '..')

export async function buildTsEslintParser(
  logger: ConsolaInstance,
  noCache = false,
): Promise<{ path: string; code: string }> {
  const cacheDir = path.resolve(root, `.nuxt/cache`)
  await mkdir(cacheDir, { recursive: true })
  const cachePath = path.resolve(cacheDir, `ts-eslint-parser@${pkg.version}.js`)
  if (!noCache) {
    const cache = await readFile(cachePath, 'utf8').catch(() => null)
    if (cache) return { path: cachePath, code: cache }
  }
  const t = performance.now()
  logger.start('Building @typescript-eslint/parser')
  const ENTRY = 'virtual:entry'
  const mockPath = fileURLToPath(import.meta.resolve('unenv/mock/proxy'))
  const output = await build({
    input: [ENTRY],
    write: false,
    platform: 'browser',
    resolve: {
      /// keep-sorted
      alias: {
        'node:fs': mockPath,
        'node:path': 'pathe',
        'node:util': mockPath,
        tinyglobby: mockPath,
      },
    },
    plugins: [
      {
        name: ENTRY,
        resolveId(id) {
          if (id === ENTRY) return id
        },
        load: (id) => {
          if (id === ENTRY)
            return `export { parse, version } from '@typescript-eslint/parser'`
        },
      },
      Replace({
        values: [
          {
            find: /process\.cwd\(\)/g,
            replacement: '"/"',
          },
          {
            find: 'process.versions.node',
            replacement: JSON.stringify(process.versions.node),
          },
        ],
      }),
    ],
    output: {
      format: 'esm',
    },
  })
  const text = output.output[0].code
  await writeFile(cachePath, text, 'utf8')
  logger.success(
    `Built @typescript-eslint/parser in ${Math.round(performance.now() - t)}ms`,
  )
  return { code: text, path: cachePath }
}
