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

/**
 * Set once Monaco and everything registered on top of it (Shiki tokenizers,
 * formatters, language defaults) is ready. Editors render only after that, so
 * loading Monaco never blocks the rest of the app.
 */
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
    loadGrammar(language).catch((error) => {
      // fall back to plain text rather than never showing the editor
      console.error(error)
    }),
  ])
}

/**
 * The language an editor can switch to: `language` once its grammar has
 * loaded, so the editor never shows code without highlighting.
 */
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
