<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'
import { useUiStore } from '~/stores/ui'

const ui = useUiStore()
const drawer = ref<HTMLElement | null>(null)

onClickOutside(drawer, () => {
  if (ui.drawerOpen) ui.toggleDrawer(false)
})

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && ui.drawerOpen) ui.toggleDrawer(false)
})

watch(() => ui.drawerOpen, (open) => {
  if (!import.meta.client) return
  document.body.classList.toggle('mobile-drawer-open', open)
  if (open) nextTick(() => drawer.value?.focus())
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.classList.remove('mobile-drawer-open')
})
</script>

<template>
  <div id="mobileMenu" class="mobile-drawer-shell" :class="{ 'is-open': ui.drawerOpen }" :aria-hidden="!ui.drawerOpen">
    <button
      class="mobile-drawer-backdrop"
      type="button"
      aria-label="关闭分类菜单"
      tabindex="-1"
      @click="ui.toggleDrawer(false)"
    />
    <aside
      ref="drawer"
      class="mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobileDrawerTitle"
      tabindex="-1"
    >
      <div class="mobile-drawer__header">
        <span class="logo-mark" aria-hidden="true" />
        <strong id="mobileDrawerTitle" class="font-display text-[17px] font-bold text-foreground">深度指引</strong>
        <button class="mobile-drawer__close" type="button" aria-label="关闭分类菜单" @click="ui.toggleDrawer(false)">
          <AppIcon name="x" class="size-5" />
        </button>
      </div>
      <div class="mobile-nav-content">
        <SideNavPanel />
      </div>
      <div class="mobile-drawer__footer">
        <AppIcon name="compass" class="size-4" /><span>发现优质网站和工具</span>
      </div>
    </aside>
  </div>
</template>
