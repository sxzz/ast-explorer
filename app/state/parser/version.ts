import { computed, ref, watch, type Ref } from 'vue'
import { fetchVersion, getJsdelivrUrl } from '~/parser/utils'
import { isUrl } from '~/state/url'
import { currentParser, overrideVersion } from './parser'
import type { Parser } from '~/parser'

export const isUrlVersion = computed(() => isUrl(overrideVersion.value || ''))

export const versionOverridable = computed(
  () => currentParser.value.versionOverridable !== false,
)

export const parserPkgId = computed(() => {
  if (isUrlVersion.value) return overrideVersion.value!
  const { pkgName, defaultVersion } = currentParser.value
  const range = overrideVersion.value || defaultVersion
  return range ? `${pkgName}@${range}` : pkgName
})

export const parserModuleUrl = computed(() => {
  if (isUrlVersion.value) return overrideVersion.value!
  const { getModuleUrl } = currentParser.value
  return getModuleUrl
    ? getModuleUrl(parserPkgId.value, overrideVersion.value)
    : getJsdelivrUrl(parserPkgId.value)
})

export const packageUrl = computed(() =>
  isUrlVersion.value
    ? overrideVersion.value!
    : `https://npmx.dev/package/${currentParser.value.pkgName}`,
)

export const displayVersion = ref<string>()

function resolveVersion(
  parser: Parser,
  override: string | undefined,
  pkgId: string,
  parserModule: Promise<unknown>,
): string | Promise<string> {
  if (!parser.pkgName) return ''
  if (override) return isUrl(override) ? override : fetchVersion(pkgId)
  const { version } = parser
  if (typeof version === 'string') return version
  return version ? version.call(parserModule, pkgId) : fetchVersion(pkgId)
}

export function initParserVersionState(
  parserModulePromise: Readonly<Ref<Promise<unknown>>>,
) {
  watch(
    [currentParser, overrideVersion],
    async ([parser, override]) => {
      displayVersion.value =
        override || (typeof parser.version === 'string' ? parser.version : '')

      let version: string
      try {
        version = await resolveVersion(
          parser,
          override,
          parserPkgId.value,
          parserModulePromise.value,
        )
      } catch (error) {
        console.error(error)
        return
      }
      if (
        parser === currentParser.value &&
        override === overrideVersion.value
      ) {
        displayVersion.value = version
      }
    },
    { immediate: true },
  )
}
