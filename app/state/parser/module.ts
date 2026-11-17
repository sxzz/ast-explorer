import { computed, ref, shallowRef, watch } from 'vue'
import { importModule } from '~/parser/utils'
import { code } from '~/state/editor'
import { parserOptions, parserOptionsError, rawOptions } from './options'
import { currentParser } from './parser'
import { initParserVersionState, parserModuleUrl, parserPkgId } from './version'
import type { Parser } from '~/parser'

export const loading = ref<'module' | 'parse' | false>(false)
export const ast = shallowRef<unknown>({})
// `currentParser` switches before the new AST is ready, so render `ast` with
// the parser and module that produced it.
export const astParser = shallowRef<Parser>()
export const astModule = shallowRef<unknown>()
export const error = shallowRef<unknown>()
export const parseCost = ref(0)

const parserModuleCache = new Map<string, unknown>()
async function initParser() {
  const { id, importMap, init, interopDefault } = currentParser.value
  const pkgId = parserPkgId.value
  const moduleUrl = parserModuleUrl.value
  // e.g. tree-sitter-typescript and tree-sitter-tsx share a package
  const cacheKey = `${id}@${pkgId}`
  if (parserModuleCache.has(cacheKey)) return parserModuleCache.get(cacheKey)

  let module = init
    ? await init(moduleUrl, pkgId, importMap)
    : await importModule(moduleUrl, { sandbox: !!importMap, importMap })
  if (interopDefault && module && 'default' in module) {
    module = (module as any).default
  }
  parserModuleCache.set(cacheKey, module)
  return module
}

export const parserModulePromise = computed(() => initParser())

export function initParserModule() {
  watch(
    [parserModulePromise, code, rawOptions],
    async () => {
      const parser = currentParser.value
      const { id } = parser
      try {
        loading.value = 'module'
        const ctx = await parserModulePromise.value
        if (currentParser.value.id !== id) return
        if (parserOptionsError.value) {
          throw new Error(
            `Failed to parse options\n${parserOptionsError.value}`,
            { cause: parserOptionsError.value },
          )
        }
        loading.value = 'parse'
        const t = performance.now()
        const result = await parser.parse.call(
          ctx,
          code.value,
          parserOptions.value,
        )
        parseCost.value = performance.now() - t
        if (currentParser.value.id !== id) return
        ast.value = result
        astParser.value = parser
        astModule.value = ctx
        error.value = null
      } catch (err: any) {
        console.error(err)
        if (currentParser.value.id === id) {
          error.value = err
        }
      } finally {
        loading.value = false
      }
    },
    { immediate: true },
  )

  initParserVersionState(parserModulePromise)
}
