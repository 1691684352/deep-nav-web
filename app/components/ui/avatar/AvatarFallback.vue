<script setup lang="ts">
import { AvatarFallback, type AvatarFallbackProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<AvatarFallbackProps & { class?: any }>()
</script>

<template>
  <AvatarFallback
    data-slot="avatar-fallback"
    v-bind="props"
    :class="cn('flex size-full items-center justify-center rounded-[inherit] bg-muted', props.class)"
  >
    <slot />
  </AvatarFallback>
</template>
