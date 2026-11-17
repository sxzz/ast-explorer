import {
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type ShallowRef,
} from 'vue'
import { loadGrammar, loadHighlighter } from '~/composables/shiki'
import { useMonaco } from '#imports'
import type * as Monaco from 'monaco-editor'
import type { MonacoLanguage } from '~/parser'

export const loadedMonaco = shallowRef<typeof Monaco>()

let monacoPromise: Promise<typeof Monaco> | undefined
export function loadMonaco(): Promise<typeof Monaco> {
  return (monacoPromise ||= Promise.all([
    useMonaco(),
    loadHighlighter(),
    import('~/monaco/setup'),
  ]).then(([monaco, highlighter, { setupMonaco }]) => {
    setupMonaco(monaco, highlighter)
    return (loadedMonaco.value = monaco)
  }))
}

export async function loadMonacoLanguage(
  language: MonacoLanguage,
): Promise<void> {
  await Promise.all([
    loadMonaco(),
    loadGrammar(language).catch((error) => console.error(error)),
  ])
}

export function useMonacoLanguage(
  language: MaybeRefOrGetter<MonacoLanguage>,
): Readonly<ShallowRef<MonacoLanguage | undefined>> {
  const loaded = shallowRef<MonacoLanguage>()
  watch(
    () => toValue(language),
    async (lang) => {
      await loadMonacoLanguage(lang)
      if (lang === toValue(language)) loaded.value = lang
    },
    { immediate: true },
  )
  return loaded
}
