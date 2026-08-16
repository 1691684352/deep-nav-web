<script setup lang="ts">
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: any }>()
</script>

<template>
  <DropdownMenuSeparator
    data-slot="dropdown-menu-separator"
    v-bind="props"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class)"
  />
</template>
