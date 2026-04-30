<template>
  <div flex="~ col center" h-full w-full gap3>
    <div class="relative h-12 w-12">
      <div
        class="absolute inset-0 animate-spin border-2 border-$c-border rounded-full border-dashed"
        style="animation-duration: 4s"
      />
      <div
        class="absolute inset-2 animate-spin border-2 border-transparent border-t-$c-accent rounded-full"
        style="animation-duration: 0.9s"
      />
    </div>
    <span class="text-base text-soft">
      <slot>Loading…</slot>
    </span>
  </div>
</template>
