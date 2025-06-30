<script setup lang="ts">
import json5 from 'json5'

const raw = ref(JSON.stringify(astViewSettings.value, null, 2))
const dialog = useTemplateRef('dialog')

watchEffect(() => {
  let parsed: EditorSettings
  try {
    parsed = json5.parse(raw.value)
  } catch {
    return
  }
  astViewSettings.value = parsed
})

watchEffect(() => {
  if (showAstViewSettings.value) openDialog()
})

function openDialog() {
  dialog.value?.showModal()
}

function handleDialogClick(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) closeDialog()
}

function closeDialog() {
  dialog.value?.close()
  showAstViewSettings.value = false
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
      <span text-lg font-bold>AST View Settings</span>
      <button absolute right-2 nav-button @click="dialog?.close()">
        <div i-ri:close-line />
      </button>
    </div>
    <CodeEditor v-model="raw" language="json" min-h-0 w-full flex-1 />
  </dialog>
</template>
