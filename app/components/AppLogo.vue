<script setup lang="ts">
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  size?: number
  class?: string
}>(), {
  size: 32,
})
</script>

<template>
  <span
    :class="cn('grid shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground', $props.class)"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <AppIcon name="compass" :style="{ width: `${size * 0.56}px`, height: `${size * 0.56}px` }" :stroke-width="2" />
  </span>
</template>
