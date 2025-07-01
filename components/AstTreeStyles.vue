<script setup lang="ts">
import json5 from 'json5'

const raw = ref(JSON.stringify(astTreeStyles.value, null, 2))
const dialog = useTemplateRef('dialog')

watchEffect(() => {
  let parsed: EditorSettings
  try {
    parsed = json5.parse(raw.value)
  } catch {
    return
  }
  astTreeStyles.value = parsed
})

watchEffect(() => {
  if (showAstTreeStyles.value) openDialog()
})

function openDialog() {
  dialog.value?.showModal()
}

function handleDialogClick(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) closeDialog()
}

function closeDialog() {
  dialog.value?.close()
  showAstTreeStyles.value = false
}
</script>

<template>
  <dialog
    ref="dialog"
    h-100
    w-200
    flex-col
    border
    rounded-2xl
    open:flex
    backdrop:bg-black:30
    backdrop:backdrop-blur-2
    @click="handleDialogClick"
    @close="closeDialog"
  >
    <div flex="~ center" relative gap2 py2 font-bold>
      <span text-lg font-bold>AST Tree Styles</span>
      <a
        title="Reference Documentation"
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#index"
        target="_blank"
        nav-button
      >
        <div i-ri:book-2-line />
      </a>
      <button absolute right-2 nav-button @click="dialog?.close()">
        <div i-ri:close-line />
      </button>
    </div>
    <CodeEditor v-model="raw" language="json" min-h-0 w-full flex-1 />
  </dialog>
</template>
