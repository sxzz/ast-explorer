<script setup lang="ts">
import { computed, reactive, useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{ layout?: 'horizontal' | 'vertical' }>(),
  {
    layout: 'horizontal',
  },
)
const isVertical = computed(() => props.layout === 'vertical')

const containerRef = useTemplateRef('container')
const state = reactive({
  dragging: false,
  split: 50,
  viewHeight: 0,
  viewWidth: 0,
})

const boundSplit = computed(() => {
  const { split } = state
  return split < 20 ? 20 : Math.min(split, 80)
})

let startPosition = 0
let startSplit = 0

function dragStart(e: MouseEvent) {
  state.dragging = true
  startPosition = isVertical.value ? e.pageY : e.pageX
  startSplit = boundSplit.value
}

function dragMove(e: MouseEvent) {
  if (containerRef.value && state.dragging) {
    const position = isVertical.value ? e.pageY : e.pageX
    const totalSize = isVertical.value
      ? containerRef.value.offsetHeight
      : containerRef.value.offsetWidth
    const dp = position - startPosition
    state.split = startSplit + +((dp / totalSize) * 100).toFixed(2)
  }
}

function dragEnd() {
  state.dragging = false
}
</script>

<template>
  <div
    ref="container"
    class="split-pane"
    :class="{
      dragging: state.dragging,
      [isVertical ? 'vertical' : 'horizontal']: true,
    }"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div
      class="left"
      :style="{ [isVertical ? 'height' : 'width']: `${boundSplit}%` }"
    >
      <slot name="left" />
      <div class="dragger" @mousedown.prevent="dragStart" />
    </div>
    <div
      class="right"
      :style="{ [isVertical ? 'height' : 'width']: `${100 - boundSplit}%` }"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.split-pane {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.split-pane.dragging {
  cursor: ew-resize;
}

.dragging .left,
.dragging .right {
  pointer-events: none;
}

.horizontal > .left,
.horizontal > .right {
  position: relative;
  height: 100%;
}

.horizontal > .left {
  border-right: 1px solid var(--c-border);
}

.horizontal > .left > .dragger {
  position: absolute;
  z-index: 3;
  top: 0;
  bottom: 0;
  right: -5px;
  width: 10px;
  cursor: ew-resize;
}

.toggler {
  display: none;
  z-index: 3;
  color: var(--c-text-base);
  position: absolute;
  left: 50%;
  bottom: 20px;
  background-color: var(--c-bg-base);
  padding: 8px 12px;
  border-radius: 8px;
  transform: translateX(-50%);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.dark .toggler {
  background-color: var(--c-bg-base);
}

.split-pane.vertical {
  display: block;
}

.split-pane.vertical.dragging {
  cursor: ns-resize;
}

.vertical > .left > .dragger {
  position: absolute;
  top: auto;
  height: 10px;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: ns-resize;
}

.vertical > .left,
.vertical > .right {
  position: relative;
  width: 100%;
}

.vertical > .left {
  border-right: none;
  border-bottom: 1px solid var(--c-border);
}
</style>
