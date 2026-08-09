<script setup lang="ts">
import { resolveIcon } from '~/utils/icons'

const props = withDefaults(defineProps<{
  name: string
  strokeWidth?: number
  fill?: boolean
}>(), {
  strokeWidth: 1.8,
  fill: false,
})

const component = computed(() => resolveIcon(props.name))
</script>

<template>
  <component
    :is="component"
    :stroke-width="strokeWidth"
    :class="fill ? 'fill-current' : undefined"
    aria-hidden="true"
  />
</template>
