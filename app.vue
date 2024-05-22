<script setup lang="ts">
if (import.meta.server) {
  const title = 'AST Explorer'
  const desc = 'AST Explorer: For most popular front-end languages and parsers.'
  const url = 'https://ast.sxzz.moe/'

  useSeoMeta({
    title,
    description: desc,
    ogTitle: title,
    ogDescription: desc,
    ogImage: '/logo.svg',
    ogUrl: url,
    twitterTitle: title,
    twitterDescription: desc,
    twitterImage: '/logo.svg',
    twitterCard: 'app',
  })

  useHead({
    htmlAttrs: {
      lang: 'en',
    },
    link: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo.svg',
      },
    ],
  })
}
</script>

<template>
  <Suspense>
    <main flex="~ col" lg:h-screen>
      <ClientOnly>
        <AppNavBar border-b />

        <div min-h-0 flex flex-1 flex-col gap2 lg:flex-row>
          <AppSideBar
            v-show="showSideBar"
            overflow-auto
            border-r
            lg:w-75
            lg:flex-none
          />

          <div min-h-95vh min-w-0 flex flex-col gap2 p2 lg:flex-1 lg:flex-row>
            <InputContainer v-show="showLeftLayout" min-w-0 flex-1 />
            <OutputContainer v-show="showRightLayout" min-w-0 flex-1 />
          </div>
        </div>
      </ClientOnly>
    </main>

    <template #fallback>
      <div flex="~ center" h-screen gap1 text-3xl font-bold>
        <div i-ri:loader-4-fill animate-spin />
        Loading...
      </div>
    </template>
  </Suspense>
</template>
