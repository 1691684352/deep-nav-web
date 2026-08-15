<script setup lang="ts">
import type { FeatureCard } from '#shared/types'

const props = defineProps<{ card: FeatureCard }>()
</script>

<template>
  <NuxtLink
    :to="props.card.to"
    class="group relative block aspect-[237/148] overflow-hidden rounded-xl border bg-neutral-900"
    :aria-label="`浏览 ${props.card.name} 工具`"
  >
    <img
      class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      :src="props.card.background"
      width="960"
      height="600"
      alt=""
    >
    <span class="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-black/25 p-3 backdrop-blur-md">
      <span class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/20 bg-white/90">
        <img class="size-full object-cover" :src="props.card.logo" width="80" height="80" :alt="props.card.name">
      </span>
      <span class="min-w-0 flex-1 text-white">
        <strong class="block truncate font-display text-[14px] font-bold">{{ props.card.name }}</strong>
        <span class="mt-0.5 block truncate text-[11px] text-white/75">{{ props.card.description }}</span>
      </span>
    </span>
  </NuxtLink>
</template>
