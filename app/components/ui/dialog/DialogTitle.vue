<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<DialogTitleProps & { class?: any }>()
</script>

<template>
  <DialogTitle
    data-slot="dialog-title"
    v-bind="props"
    :class="cn('text-lg leading-none font-semibold', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
