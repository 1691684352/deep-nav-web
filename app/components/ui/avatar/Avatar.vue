<script setup lang="ts">
import { AvatarRoot } from 'reka-ui'
import { cn } from '~/lib/utils'
import { avatarVariants, type AvatarVariants } from '.'

const props = defineProps<{
  class?: any
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
}>()
</script>

<template>
  <AvatarRoot
    data-slot="avatar"
    :class="cn(avatarVariants({ size, shape }), props.class)"
  >
    <slot />
  </AvatarRoot>
</template>
