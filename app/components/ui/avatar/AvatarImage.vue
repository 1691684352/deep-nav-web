<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<AvatarImageProps & { class?: any }>()
</script>

<template>
  <AvatarImage
    data-slot="avatar-image"
    v-bind="props"
    :class="cn('aspect-square size-full object-cover', props.class)"
  />
</template>
