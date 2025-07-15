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
export const errors = ref<(Error | null)[]>([])
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
  async function runParseModule(parser: Parser, idx: number) {
    try {
      errors.value[idx] = null
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
      errors.value![idx] = error
    } finally {
      loading.value = false
    }
  }
  watch(
    [parserModulePromise, code, rawOptions],
    async () => {
      const isSameParser = currentParserIds.value.every(
        (id) => id === currentParserIds.value[0],
      )

      if (isSameParser) {
        await runParseModule(currentParsers.value[0]!, 0)
        for (let i = 1; i <= currentParserIds.value.length; i++) {
          ast.value[i] = ast.value[0]
          parseCost.value[i] = parseCost.value[0]
          errors.value[i] = errors.value[0]!
        }
      } else {
        currentParsers.value.forEach((parser, idx) => {
          runParseModule(parser, idx)
        })
      }
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
