type Memo = Record<number, number>

function fibonacci(num: number, memo: Memo = {}): number {
  if (memo[num]) return memo[num]
  if (num <= 1) return 1

  return (memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo))
}
