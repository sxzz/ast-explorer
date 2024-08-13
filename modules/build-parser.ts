import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { addVitePlugin, defineNuxtModule, useLogger } from '@nuxt/kit'
import { version } from '@typescript-eslint/parser'
import { build } from 'esbuild'
import Replace from 'unplugin-replace/esbuild'
import type { ConsolaInstance } from 'consola'

const VIRTUAL_ID = '/virtual/typescript-eslint/parser'

// eslint-disable-next-line import/no-default-export
export default defineNuxtModule(() => {
  const logger = useLogger('build-parser')

  addVitePlugin({
    name: 'virtual-ts-eslint-parser',
    resolveId(id) {
      if (id === VIRTUAL_ID) return id
    },
    async load(id) {
      if (id !== VIRTUAL_ID) return

      const result = await buildTsEslint(logger)
      return result
    },
  })
})

export async function buildTsEslint(logger: ConsolaInstance) {
  const cacheDir = path.resolve(__dirname, `../.nuxt/cache`)
  await mkdir(cacheDir, { recursive: true }).catch(() => null)
  const cachePath = path.resolve(cacheDir, `ts-eslint-parser@${version}.js`)
  const cache = await readFile(cachePath, 'utf8').catch(() => null)
  if (cache) {
    logger.info(`Using cached @typescript-eslint/parser from ${cachePath}`)
    return cache
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
    minify: true,
    alias: {
      path: 'pathe',
      'node:path': 'pathe',
      fs: 'unenv/runtime/mock/proxy',
      os: 'unenv/runtime/mock/proxy',
      'node:os': 'unenv/runtime/mock/proxy',
      'node:process': 'unenv/runtime/mock/proxy',
      'node:util': 'unenv/runtime/mock/proxy',
      stream: 'unenv/runtime/mock/proxy',
      globby: 'unenv/runtime/mock/proxy',
      perf_hooks: 'unenv/runtime/mock/proxy',
      inspector: 'unenv/runtime/mock/proxy',
      crypto: 'unenv/runtime/mock/proxy',
    },
    plugins: [
      Replace({
        exclude: [],
        values: [{ find: /process\.cwd\(\)/g, replacement: '"/"' }],
      }),
    ],
  })
  const text = result.outputFiles[0].text
  await writeFile(cachePath, text, 'utf8')
  logger.success('Built @typescript-eslint/parser')
  return text
}
