import { parsersOptions, rawOptions } from './options'
import {
  currentParserIds,
  currentParsers,
  displayVersions,
  isUrlVersions,
  overrideVersions,
} from './parser'

export const loading = ref<'module' | 'parse' | false>(false)
export const ast = ref<any[]>([])
export const errors = ref<Error[] | null>()
export const parseCost = ref<[number, number]>([0, 0])

const parserModuleCache: Record<string, unknown> = Object.create(null)

async function initParser(currentParser: Parser, idx: number) {
  const defaultModuleUrl = (pkg: string) => getJsdelivrUrl(pkg)
  const defaultInit = (url: string) => importUrl(url)
  const {
    pkgName,
    getModuleUrl = defaultModuleUrl,
    init = defaultInit,
  } = currentParser

  const pkgId = isUrlVersions.value[idx]
    ? overrideVersions.value[idx]!
    : `${pkgName}${overrideVersions.value[idx] ? `@${overrideVersions.value[idx]!}` : ''}`
  if (parserModuleCache[pkgId]) return parserModuleCache[pkgId]

  const moduleUrl = isUrlVersions.value[idx]
    ? pkgId
    : getModuleUrl(pkgId, overrideVersions.value[idx])
  return (parserModuleCache[pkgId] = await init(moduleUrl, pkgId))
}

export const parserModulePromise = computed(() => {
  return currentParsers.value.map((parser, idx) => initParser(parser, idx))
})
export const parserModules = computedAsync(async () => {
  const promises = parserModulePromise.value
  return await Promise.all(promises)
}) as ComputedRef<unknown[]>

export function initParserModule() {
  watch(
    [parserModulePromise, code, rawOptions],
    () => {
      errors.value = null
      currentParsers.value.forEach(async (parser, idx) => {
        try {
          loading.value = 'module'
          const ctx = await parserModulePromise.value[idx]
          const t = window.performance.now()
          loading.value = 'parse'
          ast.value[idx] = await parser.parse.call(
            ctx,
            code.value,
            parsersOptions.value[parser.id],
          )
          parseCost.value[idx] = window.performance.now() - t
        } catch (error: any) {
          console.error(error)
          if (errors.value === null) {
            errors.value = []
          }
          errors.value![idx] = error
        } finally {
          loading.value = false
        }
      })
    },
    { immediate: true, deep: true },
  )

  // fetch display version
  watch(
    [currentParserIds, overrideVersions],
    () => {
      if (overrideVersions.value.length > 0) {
        overrideVersions.value.forEach(async (overrideVersion, index) => {
          displayVersions.value[index] = overrideVersion
          if (!overrideVersion || !isUrl(overrideVersion)) {
            displayVersions.value[index] = await fetchVersion(
              `${currentParsers.value[index]!.pkgName}@${displayVersions.value[index]}`,
            )
          }
        })

        return
      }
      currentParsers.value.forEach(async (parser, index) => {
        if (typeof parser.version === 'string') {
          displayVersions.value[index] = parser.version
        } else {
          displayVersions.value[index] = ''
          const res = await Promise.resolve(
            (parser.version || (fetchVersion as never)).call(
              parserModulePromise.value[index],
              parser.pkgName,
              overrideVersions.value![index],
            ),
          )
          displayVersions.value[index] = res
        }
      })
    },
    { immediate: true, deep: true },
  )
}
