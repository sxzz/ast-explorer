declare module 'splitpanes' {
  import type { DefineComponent } from 'vue'

  export const Splitpanes: DefineComponent<{
    horizontal?: boolean
    pushOtherPanes?: boolean
    maximizePanes?: boolean
    rtl?: boolean
    firstSplitter?: boolean
  }>

  export const Pane: DefineComponent<{
    size?: number | string
    minSize?: number | string
    maxSize?: number | string
  }>
}
