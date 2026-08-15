<script setup lang="ts">
import type { LatestTool } from '#shared/types'
import { faviconUrl } from '#shared/utils'

const props = defineProps<{ tool: LatestTool }>()
</script>

<template>
  <NuxtLink
    :to="`/tool/${props.tool.slug}`"
    class="rank-row rank-data-row grid grid-cols-[28px_76px_minmax(0,1fr)_64px_52px] items-center gap-2.5 rounded-lg px-2 text-[12px] text-muted-foreground"
  >
    <img class="mini-logo" :src="faviconUrl(props.tool.domain)" width="26" height="26" loading="lazy" alt="">
    <strong class="truncate text-[13px] font-medium text-foreground">{{ props.tool.name }}</strong>
    <span class="truncate"><span class="mr-2 text-foreground/70">{{ props.tool.category }}</span>{{ props.tool.desc }}</span>
    <span class="text-right">{{ props.tool.time }}</span>
    <span class="number-font flex items-center justify-end gap-0.5 font-semibold text-foreground">
      <AppIcon name="flame" class="size-3.5 text-muted-foreground" />{{ props.tool.gain }}
    </span>
  </NuxtLink>
</template>
