interface HoverLocation {
  startColumn: number
  endColumn: number
  startLineNumber: number
  endLineNumber: number
}

export const hoverLocation = ref<HoverLocation | undefined>()
