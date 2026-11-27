import {
  createHighlighterCoreSync,
  type HighlighterCore,
  type LanguageInput,
} from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import langTypescript from 'shiki/langs/typescript.mjs'
import { themeDark, themeLight } from './theme'
import type { MonacoLanguage } from '~/parser'

/// keep-sorted
export const grammars: Partial<Record<MonacoLanguage, LanguageInput>> = {
  'glimmer-js': () => import('shiki/langs/glimmer-js.mjs'),
  'glimmer-ts': () => import('shiki/langs/glimmer-ts.mjs'),
  astro: () => import('shiki/langs/astro.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  csharp: () => import('shiki/langs/csharp.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  graphql: () => import('shiki/langs/graphql.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  less: () => import('shiki/langs/less.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  protobuf: () => import('shiki/langs/protobuf.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  solidity: () => import('shiki/langs/solidity.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  svelte: () => import('shiki/langs/svelte.mjs'),
  typescript: langTypescript,
  vue: () => import('shiki/langs/vue.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
}

const grammarPromises = new Map<MonacoLanguage, Promise<void>>()
export const loadedGrammars = new Set<MonacoLanguage>(['typescript'])

export function createHighlighter(): HighlighterCore {
  // the AST tree colors values as TypeScript
  return createHighlighterCoreSync({
    themes: [themeLight, themeDark],
    langs: [langTypescript],
    engine: createJavaScriptRegexEngine(),
  })
}

export function loadGrammar(
  highlighter: HighlighterCore,
  language: MonacoLanguage,
): Promise<void> {
  const grammar = grammars[language]
  if (!grammar || loadedGrammars.has(language)) return Promise.resolve()

  let promise = grammarPromises.get(language)
  if (!promise) {
    promise = highlighter.loadLanguage(grammar).then(
      () => {
        loadedGrammars.add(language)
      },
      (error) => {
        grammarPromises.delete(language)
        throw error
      },
    )
    grammarPromises.set(language, promise)
  }
  return promise
}
