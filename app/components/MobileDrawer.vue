<script setup lang="ts">
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useUiStore } from '~/stores/ui'

const ui = useUiStore()
</script>

<template>
  <Sheet :open="ui.drawerOpen" @update:open="ui.toggleDrawer($event)">
    <SheetContent id="mobileMenu" side="left" class="flex w-[min(82vw,320px)] flex-col gap-0 p-0">
      <SheetHeader class="flex-row items-center gap-2.5 border-b p-4">
        <AppLogo :size="28" />
        <SheetTitle class="font-display text-[17px] font-bold">深度指引</SheetTitle>
      </SheetHeader>
      <div class="min-h-0 flex-1 overflow-y-auto p-3">
        <SideNavPanel />
      </div>
      <div class="flex items-center gap-2 border-t p-4 text-[11px] text-muted-foreground">
        <AppIcon name="compass" class="size-4" /><span>发现优质网站和工具</span>
      </div>
    </SheetContent>
  </Sheet>
</template>
