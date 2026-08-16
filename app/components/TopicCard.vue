<script setup lang="ts">
import type { Topic } from '#shared/types'
import { faviconUrl } from '#shared/utils'

const props = defineProps<{ topic: Topic }>()
</script>

<template>
  <NuxtLink :to="`/topic/${props.topic.slug}`" class="topic-card rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent">
    <p class="text-[15px] font-semibold text-foreground">{{ props.topic.title }}</p>
    <p class="mt-1 text-[11px] text-muted-foreground">{{ props.topic.description }}</p>
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
          class="mini-logo border-2 border-card"
        >
      </div>
      <p class="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">
        <strong class="number-font text-[14px] text-foreground">{{ props.topic.toolCount }}</strong> 个工具
      </p>
    </div>
  </NuxtLink>
</template>
