import { parserOptions, rawOptions } from './options'
import {
  currentParser,
  currentParserId,
  displayVersion,
  isUrlVersion,
  overrideVersion,
} from './parser'

export const loading = ref<'module' | 'parse' | false>(false)
export const ast = shallowRef<unknown>({})
export const error = shallowRef<unknown>()
export const parseCost = ref(0)

const parserModuleCache: Record<string, unknown> = Object.create(null)
async function initParser() {
  const defaultModuleUrl = (pkg: string) => getJsdelivrUrl(pkg)
  const defaultInit = (url: string) => importUrl(url)
  const {
    pkgName,
    getModuleUrl = defaultModuleUrl,
    init = defaultInit,
  } = currentParser.value

  const pkgId = isUrlVersion.value
    ? overrideVersion.value!
    : `${pkgName}${overrideVersion.value ? `@${overrideVersion.value}` : ''}`
  if (parserModuleCache[pkgId]) return parserModuleCache[pkgId]

  const moduleUrl = isUrlVersion.value
    ? pkgId
    : getModuleUrl(pkgId, overrideVersion.value)
  return (parserModuleCache[pkgId] = await init(moduleUrl, pkgId))
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
        loading.value = 'parse'
        const t = performance.now()
        ast.value = await currentParser.value.parse.call(
          ctx,
          code.value,
          parserOptions.value,
        )
        parseCost.value = performance.now() - t
        error.value = null
        // eslint-disable-next-line unicorn/catch-error-name
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

  // fetch display version
  watch(
    [currentParserId, overrideVersion],
    async () => {
      if (overrideVersion.value) {
        displayVersion.value = overrideVersion.value
        if (!isUrl(overrideVersion.value)) {
          displayVersion.value = await fetchVersion(
            `${currentParser.value.pkgName}@${displayVersion.value}`,
          )
        }
        return
      }

      const parser = currentParser.value
      if (typeof parser.version === 'string') {
        displayVersion.value = parser.version
      } else {
        displayVersion.value = ''
        const res = await Promise.resolve(
          (parser.version || (fetchVersion as never)).call(
            parserModulePromise.value,
            parser.pkgName,
            overrideVersion.value,
          ),
        )
        if (currentParser.value.id === parser.id) {
          displayVersion.value = res
        }
      }
    },
    { immediate: true },
  )
}
