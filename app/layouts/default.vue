<script setup lang="ts">
import { useSiteStore } from '~/stores/site'
import { useUiStore } from '~/stores/ui'

const site = useSiteStore()
const ui = useUiStore()
const route = useRoute()

await useAsyncData('site-config', () => site.ensure())

watch(() => route.fullPath, () => ui.closeAll())
</script>

<template>
  <div class="min-h-dvh">
    <a
      href="#main-content"
      class="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
    >
      跳到主要内容
    </a>

    <AppHeader />
    <MobileDrawer />

    <main id="main-content" class="page-shell py-6">
      <slot />
    </main>

    <AppFooter />

    <GlobalSearchDialog />
    <LoginDialog />
    <AppToaster />
  </div>
</template>
