// import { parserOptions, rawOptions } from './options'
import {
  currentParsers,
  currentParserIds,
  displayVersions,
  isUrlVersion,
  overrideVersion,
} from './parser'

export const loading = ref<'module' | 'parse' | false>(false)
export const ast = shallowRef<unknown>([])
export const error = shallowRef<unknown>()
export const parseCost = ref(0)

const parserModuleCache: Record<string, unknown> = Object.create(null)

async function initParser(currentParser: Parser) {
  const defaultModuleUrl = (pkg: string) => getJsdelivrUrl(pkg)
  const defaultInit = (url: string) => importUrl(url)
  const {
    pkgName,
    getModuleUrl = defaultModuleUrl,
    init = defaultInit,
  } = currentParser

  const pkgId = isUrlVersion.value
    ? overrideVersion.value!
    : `${pkgName}${overrideVersion.value ? `@${overrideVersion.value}` : ''}`
  if (parserModuleCache[pkgId]) return parserModuleCache[pkgId]

  const moduleUrl = isUrlVersion.value
    ? pkgId
    : getModuleUrl(pkgId, overrideVersion.value)
  return (parserModuleCache[pkgId] = await init(moduleUrl, pkgId))
}

export const parserModulePromise = computed(() => {
  return currentParsers.value.map((parser) => initParser(parser))
})
export const parserModule = computedAsync(() => parserModulePromise.value)

export function initParserModule() {
  console.log('4.initParserState')
  watch(
    // [parserModulePromise, code, rawOptions],
    [parserModulePromise, code],
    async () => {
      // const id = currentParsers.value.id
      try {
        loading.value = 'module'

        // if (currentParsers.value.id !== id) return
        loading.value = 'parse'
        const t = window.performance.now()
        console.log('currentParsers', currentParsers)
        const results = await Promise.all(
          currentParsers.value.map(async (parser, idx) => {
            const ctx = await parserModulePromise.value[idx]
            return await parser.parse.call(ctx, code.value)
          })
        )
        console.log('result', results)
        ast.value = results
        parseCost.value = window.performance.now() - t
        error.value = null
        // eslint-disable-next-line unicorn/catch-error-name
      } catch (err: any) {
        // console.error(err)
        // if (currentParsers.value.id === id) {
        //   error.value = err
        // }
      } finally {
        loading.value = false
      }
    },
    { immediate: true },
  )

  // fetch display version
  watch(
    [currentParserIds, overrideVersion],
    async () => {
      // if (overrideVersion.value) {
      //   displayVersion.value = overrideVersion.value
      //   if (!isUrl(overrideVersion.value)) {
      //     displayVersion.value = await fetchVersion(
      //       `${currentParsers.value.pkgName}@${displayVersion.value}`,
      //     )
      //   }
      //   return
      // }

      currentParsers.value.forEach(async (parser, index) => {
        if (typeof parser.version === 'string') {
          displayVersions.value[index] = parser.version
        } else {
          displayVersions.value[index] = ''
          const res = await Promise.resolve(
            (parser.version || (fetchVersion as never)).call(
              parserModulePromise.value,
              parser.pkgName,
              overrideVersion.value,
            ),
          )
          if (parser.id === parser.id) {
            displayVersions.value[index] = res
          }
        }
      })
      
    },
    { immediate: true },
  )
}
