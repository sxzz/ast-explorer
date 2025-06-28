export function getIntersection<T>(arr1: T[], arr2: T[]): T[] {
  // 优化：对较小数组建 Set，减少内存占用
  if (arr1.length > arr2.length) [arr1, arr2] = [arr2, arr1]

  const set = new Set(arr1)
  const result: T[] = []

  for (const item of arr2) {
    if (set.has(item)) {
      result.push(item)
      set.delete(item) // 避免重复加入
    }
  }

  return result
}

export function allEqual<T>(arr: T[]): boolean {
  if (arr.length <= 1) return true
  return arr.every((item) => item === arr[0])
}
