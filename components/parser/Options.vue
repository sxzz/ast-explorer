<script setup lang="ts">
import { rawOptions } from '~/state/parser/options'
import { currentParser } from '~/state/parser/parser'

defineOptions({ inheritAttrs: false })

const dialog = ref<HTMLDialogElement>()

function openDialog() {
  dialog.value?.showModal()
}

function handleDialogClick(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) dialog.value?.close()
}
</script>

<template>
  <div flex="~ center">
    <button v-bind="$attrs" @click="openDialog">
      <div i-ri:settings-line />
    </button>
    <dialog
      ref="dialog"
      h-80vh
      border
      rounded-2xl
      backdrop:bg-black:30
      backdrop:backdrop-blur-2
      @click="handleDialogClick"
    >
      <div flex="~ center" relative gap1 py2 font-bold>
        <span text-lg font-bold>Parser Options</span>
        <button absolute right-2 nav-button @click="dialog?.close()">
          <div i-ri:close-line />
        </button>
      </div>

      <CodeEditor
        v-model="rawOptions"
        h-full
        w-60vw
        :language="currentParser.options.editorLanguage"
      />
    </dialog>
  </div>
</template>
