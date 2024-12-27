import { css } from './css'
import { html } from './html'
import { javascript } from './javascript'
import { json } from './json'
import { markdown } from './markdown'
import { sql } from './sql'
import { svelte } from './svelte'
import { vue } from './vue'
import { wxml } from './wxml'
import type { JsonNode, Range } from '#imports'
import type { AsyncComponentLoader } from 'vue'

export type MonacoLanguage =
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'html'
  | 'vue'
  // | 'svelte'
  | 'css'
  | 'markdown'
  | 'yaml'
  | 'text'

export interface Parser<C = unknown, O = unknown> {
  id: string
  label: string
  icon: string
  link: string
  pkgName: string
  version?:
    | string
    | ((
        this: C | Promise<C>,
        pkgName: string,
        version?: string,
      ) => string | Promise<string>)
  versionOverridable?: boolean
  getModuleUrl?: (pkgName: string, version?: string) => string
  init?: (moduleUrl: string, pkgId: string) => C | Promise<C>
  parse: (this: C, code: string, options: O) => unknown
  options: {
    configurable: boolean
    editorLanguage: MonacoLanguage
  } & (
    | {
        defaultValue: string
        defaultValueType: 'javascript'
      }
    | {
        defaultValue: O
        defaultValueType?: 'json5'
      }
  )
  editorLanguage: MonacoLanguage | ((options: O) => MonacoLanguage)
  getAstLocation?: {
    (node: JsonNode, ast: true): Range | undefined
    (object: any, ast?: false): Range | undefined
  }
  astTitleField?: string
  getAstTitle?: (this: C, value: any) => string | undefined
  ignoreFocusFields?: (string | number)[]
  gui?: AsyncComponentLoader
}
export interface LanguageOption {
  label: string
  icon: string
  parsers: Parser<any, any>[]
  codeTemplate: string
}

export const LANGUAGES = {
  javascript,
  vue,
  svelte,
  css,
  html,
  json,
  wxml,
  markdown,
  yaml,
  sql,
}
export type Language = keyof typeof LANGUAGES
