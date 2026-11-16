import { parserOptions, parserOptionsError, rawOptions } from './options'
import { currentParser } from './parser'
import { initParserVersionState, parserModuleUrl, parserPkgId } from './version'

export const loading = ref<'module' | 'parse' | false>(false)
export const ast = shallowRef<unknown>({})
export const error = shallowRef<unknown>()
export const parseCost = ref(0)

const parserModuleCache = new Map<string, unknown>()
async function initParser() {
  const { id, importMap, init, interopDefault } = currentParser.value
  const pkgId = parserPkgId.value
  const moduleUrl = parserModuleUrl.value
  // Parsers may share a package but differ in entry file or `init`
  // (e.g. tree-sitter-typescript vs. tree-sitter-tsx), so key by parser too.
  const cacheKey = `${id} ${moduleUrl}`
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
export const parserModule = computedAsync(() => parserModulePromise.value)

export function initParserModule() {
  watch(
    [parserModulePromise, code, rawOptions],
    async () => {
      const id = currentParser.value.id
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
        ast.value = await currentParser.value.parse.call(
          ctx,
          code.value,
          parserOptions.value,
        )
        parseCost.value = performance.now() - t
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
