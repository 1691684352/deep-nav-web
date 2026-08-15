<script setup lang="ts">
import { Separator, type SeparatorProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<SeparatorProps & { class?: any }>(),
  { orientation: 'horizontal', decorative: true },
)
</script>

<template>
  <Separator
    data-slot="separator"
    :orientation="orientation"
    :decorative="decorative"
    :class="cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      props.class,
    )"
  />
</template>
