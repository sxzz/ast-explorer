import type { InjectionKey } from 'vue'
import type { Parser } from '#imports'

export const injectProps: InjectionKey<{
  'index': number
  'currentParser': ComputedRef<Parser<unknown, unknown>>
  'currentParserId': ComputedRef<string>
}> = Symbol('props')

export type Layout = 'layout1' | 'layout2'