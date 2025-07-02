<script setup lang="ts">
import { version } from '~/package.json'

const { branch } = useAppConfig()

const layoutValue = defineModel('layout', {
  type: String,
  default: 'left-right',
})
const onLayoutChange = (layout: 'left-right' | 'top-bottom-split') => {
  layoutValue.value = layout
}
</script>

<template>
  <div flex="~ y-center wrap" justify-between gap2 p2>
    <div flex="~ gap4 wrap center" max-sm="w-full flex-col flex-gap2">
      <div mr8 flex gap1>
        <AppLogo />
        <h1 text-lg font-bold>AST Explorer</h1>
        <small>{{ branch === 'release' ? `v${version}` : 'dev' }}</small>
      </div>
      <NavbarLanguageSelect />
    </div>

    <div flex gap3 max-sm="flex-col w-full">
      <div flex="~ center" gap1>
        <button title="Toggle Side Bar" :class="(!showSidebar || !sideBarAvailable) && 'op-40'"
          :disabled="!sideBarAvailable" nav-button @click="toggleSidebar()">
          <div i-ri:list-settings-line />
        </button>
        <VMenu>
          <span nav-button>
            <div v-if="layoutValue === 'top-bottom-split'" i-ri:layout-6-line></div>
            <div v-else-if="layoutValue === 'left-right'" i-ri:layout-column-line></div>
          </span>
          <template #popper>
            <div size-fit flex cursor-pointer p-10px>
              <div :class="{
                'text-emerald-400': layoutValue === 'top-bottom-split',
              }" i-ri:layout-6-line mr-5px @click="() => onLayoutChange('top-bottom-split')" />
              <div :class="{ 'text-emerald-400': layoutValue === 'left-right' }" i-ri:layout-column-line
                @click="() => onLayoutChange('left-right')" />
            </div>
          </template>
        </VMenu>
        <button title="Toggle Input Editor" :class="!showInputEditor && 'op-40'" nav-button
          @click="toggleInputEditor()">
          <div i-ri:code-block />
        </button>
        <button title="Toggle Output Result" :class="!showOutput && 'op-40'" nav-button @click="toggleOutput()">
          <div i-ri:node-tree />
        </button>
        <button title="Toggle Dark Mode" nav-button @click="toggleDark">
          <div i-ri:sun-line dark:i-ri:moon-line />
        </button>
        <a href="https://github.com/sxzz/ast-explorer" target="_blank" title="GitHub" nav-button>
          <div i-ri:github-line />
        </a>
        <a href="https://github.com/sponsors/sxzz" target="_blank" flex="~ center" title="Sponsor" group nav-button>
          <div i-ri:heart-3-line group-hover:i-ri:heart-3-fill text-pink-400 group-hover:text-pink-400 />
        </a>
      </div>
    </div>
  </div>
</template>
