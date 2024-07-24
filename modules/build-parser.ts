import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { addVitePlugin, defineNuxtModule, useLogger } from '@nuxt/kit'
import { version } from '@typescript-eslint/parser'
import { build } from 'esbuild'
import Replace from 'unplugin-replace/esbuild'

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

      logger.start('Building @typescript-eslint/parser')
      const result = await buildTsEslint()
      logger.success('Built @typescript-eslint/parser')
      return result
    },
  })
})

export async function buildTsEslint() {
  const cacheDir = path.resolve(__dirname, `../.nuxt/cache`)
  await mkdir(cacheDir, { recursive: true }).catch(() => null)
  const cachePath = path.resolve(cacheDir, `ts-eslint-parser@${version}.js`)
  const cache = await readFile(cachePath, 'utf8').catch(() => null)
  if (cache) return cache

  const result = await build({
    entryPoints: ['@typescript-eslint/parser'],
    write: false,
    bundle: true,
    platform: 'browser',
    minify: true,
    alias: {
      path: 'pathe',
      fs: 'unenv/runtime/mock/proxy',
      os: 'unenv/runtime/mock/proxy',
      'node:os': 'unenv/runtime/mock/proxy',
      'node:process': 'unenv/runtime/mock/proxy',
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
    format: 'esm',
  })
  const text = result.outputFiles[0].text
  await writeFile(cachePath, text, 'utf8')
  return text
}
