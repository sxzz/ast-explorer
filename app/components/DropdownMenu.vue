<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'

defineSlots<{
  default: () => unknown
  trigger: (props: {
    openFromPointer: () => void
    schedulePointerClose: () => void
  }) => unknown
}>()

const open = shallowRef(false)
const openedWithPointer = shallowRef(false)
const closedWithPointer = shallowRef(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined

function clearCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
}

function openFromPointer() {
  clearCloseTimer()
  openedWithPointer.value = true
  open.value = true
}

function schedulePointerClose() {
  if (!openedWithPointer.value) return

  clearCloseTimer()
  closeTimer = setTimeout(() => {
    closedWithPointer.value = true
    openedWithPointer.value = false
    open.value = false
  }, 100)
}

function handleOpenChange(value: boolean) {
  open.value = value
  if (!value) openedWithPointer.value = false
}

function handleOpenAutoFocus(event: Event) {
  if (openedWithPointer.value) event.preventDefault()
}

function handleCloseAutoFocus(event: Event) {
  if (!closedWithPointer.value) return

  event.preventDefault()
  closedWithPointer.value = false
}

onBeforeUnmount(clearCloseTimer)
</script>

<template>
  <DropdownMenuRoot :open :modal="false" @update:open="handleOpenChange">
    <DropdownMenuTrigger as-child>
      <slot
        name="trigger"
        :open-from-pointer="openFromPointer"
        :schedule-pointer-close="schedulePointerClose"
      />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :class="{ dark: isDark }"
        class="dropdown-menu-content"
        align="start"
        :collision-padding="8"
        loop
        :side-offset="4"
        @close-auto-focus="handleCloseAutoFocus"
        @open-auto-focus="handleOpenAutoFocus"
        @mouseenter="openFromPointer"
        @mouseleave="schedulePointerClose"
      >
        <ScrollAreaRoot
          class="dropdown-menu-scroll-area"
          :scroll-hide-delay="300"
          type="hover"
        >
          <ScrollAreaViewport class="dropdown-menu-scroll-viewport">
            <slot />
          </ScrollAreaViewport>
          <ScrollAreaScrollbar
            class="dropdown-menu-scrollbar"
            orientation="vertical"
          >
            <ScrollAreaThumb class="dropdown-menu-scroll-thumb" />
          </ScrollAreaScrollbar>
        </ScrollAreaRoot>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
