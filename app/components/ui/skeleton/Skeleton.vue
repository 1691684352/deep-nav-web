<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<PrimitiveProps & { class?: any }>()
</script>

<template>
  <Primitive
    data-slot="skeleton"
    :as="as"
    :as-child="asChild"
    :class="cn('bg-accent animate-pulse rounded-md', props.class)"
  >
    <slot />
  </Primitive>
</template>
