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
    dialog.value?.focus({ preventScroll: true })
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
    :aria-label="title"
    gap="0.5"
    tabindex="-1"
    flex-col
    border
    border-base
    rounded-xl
    bg-elev
    shadow-2xl
    outline-none
    open:flex
    backdrop:bg-black:50
    backdrop:backdrop-blur-md
    @click="handleDialogClick"
    @close="closeDialog"
  >
    <div flex="~ y-center" relative gap2 border-b border-base px5 py3>
      <div flex="~ col" leading-none>
        <span
          class="text-[0.6875rem] text-mute font-medium tracking-[0.18em] uppercase"
          >Settings</span
        >
        <span class="text-lg font-semibold leading-tight tracking-tight">{{
          title
        }}</span>
      </div>
      <AppTooltip v-if="docs" :portal="false" text="Reference Documentation">
        <a
          aria-label="Reference Documentation"
          :href="docs"
          target="_blank"
          nav-button
        >
          <div i-ri:book-2-line />
        </a>
      </AppTooltip>
      <AppTooltip :portal="false" text="Close">
        <button
          aria-label="Close"
          absolute
          right-3
          top-3
          nav-button
          @click="closeDialog"
        >
          <div i-ri:close-line />
        </button>
      </AppTooltip>
    </div>

    <slot />
  </dialog>
</template>
