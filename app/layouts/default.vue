<script setup lang="ts">
import { useSiteStore } from '~/stores/site'
import { useAccountStore } from '~/stores/account'
import { useUiStore } from '~/stores/ui'

const site = useSiteStore()
const account = useAccountStore()
const ui = useUiStore()
const route = useRoute()

await Promise.all([
  useAsyncData('site-config', () => site.ensure()),
  useAsyncData('account-session', () => account.restoreSession()),
])

watch(() => route.fullPath, () => ui.closeAll())

onMounted(() => {
  if (route.query.login === '1') ui.openLogin()
})
</script>

<template>
  <div>
    <a href="#main-content" class="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-lg transition-transform focus:translate-y-0">
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
