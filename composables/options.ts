import type { WritableComputedRef } from 'vue'

export function useOptions<O extends object, T>(
  read: (opt: O) => T,
  write: (value: T, opt: O) => void,
) {
  return computed<T>({
    get: () => read(options.value),
    set(value) {
      const newOpt: O = typeof options.value === 'object' ? options.value : {}
      write(value, newOpt)
      options.value = { ...newOpt }
    },
  })
}

type GetWithPath<T, Keys extends readonly string[]> = Keys extends readonly []
  ? T
  : Keys extends readonly [infer Head, ...infer Tail]
    ? GetWithPath<NonNullable<T[Head & keyof T]>, Extract<Tail, string[]>>
    : never

function getWithPath<T>(object: T, keys: keyof T & string): T[keyof T]
function getWithPath<T, K extends string[]>(
  object: T,
  keys: K,
): GetWithPath<T, K>
function getWithPath(object: any, keys: string | string[]): any {
  if (typeof keys === 'string') return object[keys]
  return keys.reduce((acc, key) => acc?.[key], object)
}

export function makeUseOption<O extends object>() {
  return <const K extends string | string[]>(
    keys: K,
    defaultValue: K extends keyof O
      ? O[K]
      : K extends any[]
        ? [O, K]
        : never = false as any,
    keep?: boolean,
  ): WritableComputedRef<
    K extends keyof O ? O[K] : K extends any[] ? GetWithPath<O, K> : never
  > =>
    useOptions(
      (opt: O) => getWithPath(opt, keys as any) ?? defaultValue,
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
    ) as any
}
