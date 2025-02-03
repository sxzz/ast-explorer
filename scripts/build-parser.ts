import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { version } from '@typescript-eslint/parser/package.json'
import { build } from 'rolldown'
import Replace from 'unplugin-replace/rolldown'
import type { ConsolaInstance } from 'consola'

const root = path.resolve(import.meta.dirname, '..')

export async function buildTsEslint(logger: ConsolaInstance, noCache = false) {
  const cacheDir = path.resolve(root, `.nuxt/cache`)
  await mkdir(cacheDir, { recursive: true })
  const cachePath = path.resolve(cacheDir, `ts-eslint-parser@${version}.js`)
  if (!noCache) {
    const cache = await readFile(cachePath, 'utf8').catch(() => null)
    if (cache) {
      logger.info(`Using cached @typescript-eslint/parser from ${cachePath}`)
      return cache
    }
  }
  const t = performance.now()
  logger.start('Building @typescript-eslint/parser')
  const ENTRY = 'virtual:entry'
  const output = await build({
    input: [ENTRY],
    write: false,
    platform: 'browser',
    resolve: {
      /// keep-sorted
      alias: {
        '@typescript-eslint/scope-manager': 'unenv/runtime/mock/proxy',
        'fast-glob': 'unenv/runtime/mock/proxy',
        'is-glob': 'unenv/runtime/mock/proxy',
        'node:fs': 'unenv/runtime/mock/proxy',
        'node:path': 'pathe',
        'node:util': 'unenv/runtime/mock/proxy',
        minimatch: 'unenv/runtime/mock/proxy',
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
        exclude: [],
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
  return text
}
