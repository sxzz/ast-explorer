import type { Range } from '#imports'

export const code = ref('')
export const editorCursor = ref<number>(0)
export const outputHoverRange = ref<Range | undefined>()
