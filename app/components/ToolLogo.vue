<script setup lang="ts">
import { faviconUrl, initialOf } from '#shared/utils'

const props = withDefaults(defineProps<{
  domain: string
  name: string
  size?: number
  imgClass?: string
  fallbackClass?: string
}>(), {
  size: 34,
  imgClass: 'logo-img',
  fallbackClass: 'logo-img',
})

const failed = ref(false)

watch(() => props.domain, () => {
  failed.value = false
})
</script>

<template>
  <span class="relative shrink-0">
    <img
      v-show="!failed"
      :class="imgClass"
      :src="faviconUrl(domain)"
      :width="size"
      :height="size"
      loading="lazy"
      :alt="`${name} 图标`"
      @error="failed = true"
    >
    <span
      v-if="failed"
      :class="fallbackClass"
      class="grid place-items-center bg-brand-soft text-[14px] font-bold text-brand"
      aria-hidden="true"
    >{{ initialOf(name) }}</span>
  </span>
</template>
