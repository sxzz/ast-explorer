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
    gap="0.5"
    border
    border-base
    rounded-3xl
    shadow-2xl
    open:flex
    backdrop:bg-gray:40
    backdrop:backdrop-blur-md
    dark-bg="#1E1E1E"
    @click="handleDialogClick"
    @close="closeDialog"
  >
    <div flex="~ center" relative gap2 border-b py2 font-bold>
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
