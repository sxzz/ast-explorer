import { useOptions } from '~/state/parser/options'
import type { WritableComputedRef } from 'vue'

type KeysOfUnion<T> = T extends T ? keyof T : never

type GetWithPath<T, Keys extends readonly string[]> = Keys extends readonly []
  ? T
  : Keys extends readonly [infer Head, ...infer Tail]
    ? GetWithPath<NonNullable<T[Head & keyof T]>, Extract<Tail, string[]>>
    : never

function getWithPath<T>(object: T, keys: KeysOfUnion<T> & string): T[keyof T]
function getWithPath<T, K extends string[]>(
  object: T,
  keys: K,
): GetWithPath<T, K>
function getWithPath(object: any, keys: string | string[]): any {
  if (typeof keys === 'string') return object[keys]
  return keys.reduce((acc, key) => acc?.[key], object)
}

export function makeUseOption<O extends object>(parserId: string) {
  return <const K extends string | string[]>(
    keys: K,
    defaultValue: K extends KeysOfUnion<O>
      ? O[K]
      : K extends any[]
        ? [O, K]
        : never = false as any,
    keep?: boolean,
  ): WritableComputedRef<
    K extends KeysOfUnion<O>
      ? O[K]
      : K extends any[]
        ? GetWithPath<O, K>
        : never
  > =>
    useOptions(
      (opt?: O) =>
        (opt == null ? null : getWithPath(opt, keys as any)) ?? defaultValue,
      (value, opt) => {
        let obj: any = opt
        let key: string

        if (Array.isArray(keys)) {
          key = keys.at(-1)!
          for (const key of keys.slice(0, -1)) {
            if (obj[key] === undefined) obj[key] = {}
            obj = obj[key]
          }
        } else {
          key = keys
        }

        if (!keep && value === defaultValue) delete obj[key]
        else obj[key] = value
      },
      parserId
    ) as any
}
