<script setup lang="ts">
import { code } from '#imports'

const language = computed(() => {
  if (typeof currentParser.value.editorLanguage === 'string') {
    return currentParser.value.editorLanguage
  }
  return currentParser.value.editorLanguage(options.value)
})
</script>

<template>
  <Suspense>
    <main flex="~ col" lg:h-screen>
      <NavBar mb-1 />

      <div min-h-0 flex flex-1 flex-col gap2 lg:flex-row>
        <SideBar v-show="showSideBar" overflow-auto lg:w-75 lg:flex-none />

        <div min-h-95vh min-w-0 flex flex-col gap2 p2 lg:flex-1 lg:flex-row>
          <div v-show="showLeftLayout" min-w-0 flex-1>
            <CodeEditor v-model="code" :language="language" h-full w-full />
          </div>

          <AstViewer v-show="showRightLayout" min-w-0 flex-1 />
        </div>
      </div>
    </main>

    <template #fallback>
      <div h-screen flex items-center justify-center gap1 text-3xl font-bold>
        <div i-ri:loader-4-fill animate-spin />
        Loading...
      </div>
    </template>
  </Suspense>
</template>
