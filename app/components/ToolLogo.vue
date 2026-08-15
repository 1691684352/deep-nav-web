<script setup lang="ts">
import { faviconUrl, initialOf } from '#shared/utils'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  domain: string
  name: string
  size?: number
  class?: string
}>(), {
  size: 34,
})

const failed = ref(false)

watch(() => props.domain, () => {
  failed.value = false
})
</script>

<template>
  <span
    :class="cn('relative block shrink-0 overflow-hidden rounded-lg border bg-muted', props.class)"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img
      v-show="!failed"
      class="size-full object-cover"
      :src="faviconUrl(domain)"
      :width="size"
      :height="size"
      loading="lazy"
      :alt="`${name} 图标`"
      @error="failed = true"
    >
    <span
      v-if="failed"
      class="grid size-full place-items-center bg-secondary font-bold text-secondary-foreground"
      :style="{ fontSize: `${Math.round(size * 0.4)}px` }"
      aria-hidden="true"
    >{{ initialOf(name) }}</span>
  </span>
</template>
