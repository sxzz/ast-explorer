<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

withDefaults(
  defineProps<{
    text: string
    portal?: boolean
  }>(),
  {
    portal: true,
  },
)
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>

    <TooltipPortal :disabled="!portal">
      <TooltipContent
        class="tooltip-content"
        :collision-padding="8"
        side="bottom"
        :side-offset="6"
      >
        {{ text }}
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
