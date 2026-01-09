import { angular } from './angular'
import { astro } from './astro'
import { css } from './css'
import { custom } from './custom'
import { graphql } from './graphql'
import { html } from './html'
import { java } from './java'
import { javascript } from './javascript'
import { json } from './json'
import { markdown } from './markdown'
import { php } from './php'
import { rust } from './rust'
import { solidity } from './solidity'
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
  | 'svelte'
  | 'css'
  | 'markdown'
  | 'yaml'
  | 'text'
  | 'sql'
  | 'rust'
  | 'php'
  | 'solidity'
  | 'astro'
  | 'graphql'
  | 'java'
  | 'python'

export interface Parser<C = unknown, O = unknown> {
  id: string
  label: string
  icon: string
  link?: string
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
  interopDefault?: boolean
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
  getNodeLocation?: {
    (node: JsonNode, ast: true): Range | undefined
    (object: any, ast?: false): Range | undefined
  }
  nodeTitle?: string | ((this: C, value: any) => string | undefined)
  onValue?: (this: C, node: any) => any
  valueHint?: (
    this: C,
    key: string | number | undefined,
    value: any,
  ) => string | undefined
  hideKeys?: (string | number)[]
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
  astro,
  angular,
  css,
  html,
  json,
  markdown,
  yaml,
  rust,
  sql,
  php,
  java,
  python,
  solidity,
  wxml,
  graphql,
  custom,
}
export type Language = keyof typeof LANGUAGES
