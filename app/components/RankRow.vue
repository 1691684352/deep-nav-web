<script setup lang="ts">
import type { Tool } from '#shared/types'
import { faviconUrl } from '#shared/utils'

const props = defineProps<{ tool: Tool, rank: number }>()
</script>

<template>
  <li class="rounded-lg px-2 transition-colors hover:bg-accent">
    <NuxtLink :to="`/tool/${props.tool.slug}`" class="flex w-full items-center gap-3 py-1.5">
      <span
        class="number-font w-4 text-center text-[12px] font-bold"
        :class="props.rank <= 3 ? 'text-foreground' : 'text-muted-foreground'"
      >{{ props.rank }}</span>
      <img
        class="size-[26px] shrink-0 rounded-lg border bg-muted object-cover"
        :src="faviconUrl(props.tool.domain)"
        width="26"
        height="26"
        loading="lazy"
        alt=""
      >
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px] font-medium">{{ props.tool.name }}</span>
        <span class="mt-0.5 block truncate text-[11px] leading-4 text-muted-foreground">{{ props.tool.desc }}</span>
      </span>
      <span class="number-font flex items-center justify-end gap-0.5 text-[12px] font-semibold text-muted-foreground">
        <AppIcon name="flame" class="size-3.5" />{{ props.tool.heat }}
      </span>
    </NuxtLink>
  </li>
</template>
