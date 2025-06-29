export function getIntersection<T>(arr1: T[], arr2: T[]): T[] {
  if (arr1.length > arr2.length) [arr1, arr2] = [arr2, arr1]

  const set = new Set(arr1)
  const result: T[] = []

  for (const item of arr2) {
    if (set.has(item)) {
      result.push(item)
      set.delete(item)
    }
  }

  return result
}
