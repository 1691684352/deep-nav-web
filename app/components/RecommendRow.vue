<script setup lang="ts">
import type { Tool } from '#shared/types'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{ tool: Tool, recommended?: boolean }>()
</script>

<template>
  <NuxtLink
    :to="`/tool/${props.tool.slug}`"
    class="flex min-h-[64px] items-center gap-3 rounded-lg px-1.5 py-2 transition-colors hover:bg-accent"
    :aria-label="`查看 ${props.tool.name} 详情`"
  >
    <ToolLogo :domain="props.tool.domain" :name="props.tool.name" :size="40" class="rounded-xl" />
    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-2">
        <strong class="truncate text-[13px] font-medium">{{ props.tool.name }}</strong>
        <Badge v-if="props.recommended" variant="secondary" class="shrink-0 px-1 py-0 text-[10px]">推荐</Badge>
      </span>
      <span class="mt-0.5 block truncate text-[11px] leading-4 text-muted-foreground">{{ props.tool.desc }}</span>
    </span>
  </NuxtLink>
</template>
