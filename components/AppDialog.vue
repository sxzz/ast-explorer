<script setup lang="ts">
const dialog = useTemplateRef('dialog')

defineProps<{
  title: string
  docs?: string
}>()
const open = defineModel<boolean>()

watchEffect(() => {
  if (open.value) {
    dialog.value?.showModal()
  } else {
    dialog.value?.close()
  }
})

function handleDialogClick(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) closeDialog()
}

function closeDialog() {
  open.value = false
}
</script>

<template>
  <dialog
    ref="dialog"
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
      <span text-lg font-bold>{{ title }}</span>
      <a
        v-if="docs"
        title="Reference Documentation"
        :href="docs"
        target="_blank"
        nav-button
      >
        <div i-ri:book-2-line />
      </a>
      <button absolute right-2 nav-button @click="closeDialog">
        <div i-ri:close-line />
      </button>
    </div>

    <slot />
  </dialog>
</template>
