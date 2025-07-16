<template>
  <div flex="~ col center" h-full w-full gap2>
    <div i-ri:loader-4-line animate-spin text-5xl />
    <span text-lg><slot>Loading...</slot></span>
  </div>
</template>
