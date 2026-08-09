<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const ui = useUiStore()

const toneIcon = {
  success: 'circle-check',
  error: 'circle-alert',
  info: 'badge-info',
} as const

const toneColor = {
  success: 'text-[#75e8ba]',
  error: 'text-[#ff9aa4]',
  info: 'text-[#9cc4ff]',
} as const
</script>

<template>
  <div class="pointer-events-none fixed bottom-7 left-1/2 z-[120] flex -translate-x-1/2 flex-col items-center gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="item in ui.toasts"
        :key="item.id"
        class="pointer-events-auto flex min-h-11 items-center gap-2 rounded-full bg-[#172038] px-5 py-2.5 text-[13px] font-medium text-white shadow-xl"
        role="status"
        aria-live="polite"
      >
        <AppIcon :name="toneIcon[item.tone]" class="size-4" :class="toneColor[item.tone]" />
        <span>{{ item.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity .22s ease, transform .22s var(--ease-fluid);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(14px);
}
</style>
