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

type KeysOfUnion<T> = T extends T ? keyof T : never

export function makeUseOption<O extends object>() {
  return <K extends KeysOfUnion<O>>(
    key: K,
    defaultValue: O[K] = false as any,
    keep?: boolean,
  ) =>
    useOptions(
      (opt: O) => opt[key] ?? defaultValue,
      (value, opt) => {
        if (!keep && value === defaultValue) delete opt[key]
        else opt[key] = value
      },
    )
}
