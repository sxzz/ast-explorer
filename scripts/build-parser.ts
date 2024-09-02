import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { version } from '@typescript-eslint/parser'
import { build } from 'esbuild'
import Replace from 'unplugin-replace/esbuild'
import type { ConsolaInstance } from 'consola'

const root = path.resolve(fileURLToPath(import.meta.url), '../..')

export async function buildTsEslint(logger: ConsolaInstance, noCache = false) {
  const cacheDir = path.resolve(root, `.nuxt/cache`)
  await mkdir(cacheDir, { recursive: true }).catch(() => null)
  const cachePath = path.resolve(cacheDir, `ts-eslint-parser@${version}.js`)
  if (!noCache) {
    const cache = await readFile(cachePath, 'utf8').catch(() => null)
    if (cache) {
      logger.info(`Using cached @typescript-eslint/parser from ${cachePath}`)
      return cache
    }
  }
  logger.start('Building @typescript-eslint/parser')
  const result = await build({
    stdin: {
      contents: `export { version, parse } from '@typescript-eslint/parser'`,
      resolveDir: process.cwd(),
    },
    format: 'esm',
    write: false,
    bundle: true,
    platform: 'browser',
    minify: false,
    alias: {
      path: 'pathe',
      'node:path': 'pathe',
      fs: 'unenv/runtime/mock/proxy',
      'node:fs': 'unenv/runtime/mock/proxy',
      os: 'unenv/runtime/mock/proxy',
      'node:os': 'unenv/runtime/mock/proxy',
      'node:process': 'unenv/runtime/mock/proxy',
      util: 'unenv/runtime/mock/proxy',
      'node:util': 'unenv/runtime/mock/proxy',
      stream: 'unenv/runtime/mock/proxy',
      'fast-glob': 'unenv/runtime/mock/proxy',
      perf_hooks: 'unenv/runtime/mock/proxy',
      inspector: 'unenv/runtime/mock/proxy',
      crypto: 'unenv/runtime/mock/proxy',
    },
    plugins: [
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
  })
  const text = result.outputFiles[0].text
  await writeFile(cachePath, text, 'utf8')
  logger.success('Built @typescript-eslint/parser')
  return text
}
