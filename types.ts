import type { InjectionKey } from 'vue'
import type { Parser } from 'yaml'

export const injectProps: InjectionKey<{
  'index': number
  'currentParser': ComputedRef<Parser>
  'currentParserId': ComputedRef<string>
}> = Symbol('props')

export type Layout = 'layout1' | 'layout2'