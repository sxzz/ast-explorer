interface HoverLocation {
  start: number
  end: number
}

export const hoverLocation = ref<HoverLocation | undefined>()
