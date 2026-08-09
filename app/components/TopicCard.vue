<script setup lang="ts">
import type { Topic } from '#shared/types'
import { faviconUrl } from '#shared/utils'

const props = defineProps<{ topic: Topic }>()

const accentClass = computed(() => ({
  indigo: 'border-[#e2e6ff] bg-[#f3f4ff]',
  blue: 'border-[#e2e6ff] bg-[#f1f3ff]',
  slate: 'border-[#e8ecf4] bg-[#f4f7fb]',
  neutral: 'border-[#ececf0] bg-[#f7f7f8]',
}[props.topic.accent]))

const titleClass = computed(() =>
  props.topic.accent === 'indigo' || props.topic.accent === 'blue' ? 'text-[#26318c]' : '')
</script>

<template>
  <NuxtLink :to="`/topic/${props.topic.slug}`" class="topic-card rounded-xl border p-4" :class="accentClass">
    <p class="text-[15px] font-semibold" :class="titleClass">{{ props.topic.title }}</p>
    <p class="mt-1 text-[11px] text-[#737e9d]">{{ props.topic.description }}</p>
    <div class="mt-4 flex items-center justify-between gap-2">
      <div class="flex -space-x-1.5">
        <img
          v-for="domain in props.topic.icons"
          :key="domain"
          :src="faviconUrl(domain)"
          width="26"
          height="26"
          loading="lazy"
          alt=""
          class="mini-logo border-2 border-white"
        >
      </div>
      <p class="shrink-0 whitespace-nowrap text-[11px] text-[#65718c]">
        <strong class="number-font text-[14px] text-[#354264]">{{ props.topic.toolCount }}</strong> 个工具
      </p>
    </div>
  </NuxtLink>
</template>
