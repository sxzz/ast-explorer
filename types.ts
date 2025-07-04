import type { Parser } from '#imports'
import type { InjectionKey } from 'vue'

export const injectProps: InjectionKey<{
  index: number
  currentParser: ComputedRef<Parser<unknown, unknown>>
  currentParserId: ComputedRef<string>
}> = Symbol('props')

export type Layout = 'left-right' | 'top-bottom-split'
