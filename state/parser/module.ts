
import { parsersOptions, rawOptions } from './options'
import {
  currentParsers,
  currentParserIds,
  displayVersions,
  isUrlVersion,
  overrideVersion,
} from './parser'

export const loading = ref<'module' | 'parse' | false>(false)
export const ast = ref<any[]>([])
export const errors = ref<Error[] | null>()
export const parseCost = ref<[number, number]>([0, 0])

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
export const parserModules = computed(() => parserModulePromise.value)

export function initParserModule() {
  console.log('4.initParserState')
  watch(
    [parserModulePromise, code, rawOptions],
    () => {
      errors.value = null
      currentParsers.value.forEach(async (parser, idx) => {
        try{
          loading.value = 'module'
          loading.value = 'parse'
          const ctx = await parserModulePromise.value[idx]
          const t = window.performance.now()
          ast.value[idx] = await parser.parse.call(ctx, code.value, parsersOptions.value[parser.id])
          console.log('ast', ast.value[idx], idx)
          parseCost.value[idx] = window.performance.now() - t
        }      
        // eslint-disable-next-line unicorn/catch-error-name
        catch (err: any) {
          console.error(err)
          if(errors.value === null) {
            errors.value = []
          }
          errors.value![idx] = err
        } finally {
          loading.value = false
        }
      })
    },
    { immediate: true, deep: true },
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
