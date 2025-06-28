<script setup lang="ts">
import Layout1 from '~/icons/layout1.vue'
import Layout2 from '~/icons/layout2.vue'
import { version } from '~/package.json'

const { branch } = useAppConfig()

const layoutValue = defineModel('layout', { type: String, default: 'layout1' })
const onLayoutChange = (layout: 'layout1' | 'layout2') => {
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
            <Layout1 v-show="layoutValue === 'layout1'" />
            <Layout2 v-show="layoutValue === 'layout2'" />
          </span>
          <template #popper>
            <div size-fit flex cursor-pointer p-10px>
              <Layout1
                :class="{ 'text-emerald-400': layoutValue === 'layout1' }"
                mr-5px
                @click="() => onLayoutChange('layout1')"
              />
              <Layout2
                :class="{ 'text-emerald-400': layoutValue === 'layout2' }"
                @click="() => onLayoutChange('layout2')"
              />
            </div>
          </template>
        </VMenu>
        <button
          title="Toggle Input Editor"
          :class="!showInputEditor && 'op-40'"
          nav-button
          @click="toggleInputEditor()"
        >
          <div i-ri:code-block />
        </button>
        <button
          title="Toggle Output Result"
          :class="!showOutput && 'op-40'"
          nav-button
          @click="toggleOutput()"
        >
          <div i-ri:node-tree />
        </button>
        <button title="Toggle Dark Mode" nav-button @click="toggleDark">
          <div i-ri:sun-line dark:i-ri:moon-line />
        </button>
        <a
          href="https://github.com/sxzz/ast-explorer"
          target="_blank"
          title="GitHub"
          nav-button
        >
          <div i-ri:github-line />
        </a>
        <a
          href="https://github.com/sponsors/sxzz"
          target="_blank"
          flex="~ center"
          title="Sponsor"
          group
          nav-button
        >
          <div
            i-ri:heart-3-line
            group-hover:i-ri:heart-3-fill
            text-pink-400
            group-hover:text-pink-400
          />
        </a>
      </div>
    </div>
  </div>
</template>
