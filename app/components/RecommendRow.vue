<script setup lang="ts">
import type { Tool } from '#shared/types'

const props = defineProps<{ tool: Tool, recommended?: boolean }>()
</script>

<template>
  <NuxtLink
    :to="`/tool/${props.tool.slug}`"
    class="recommend-row flex min-h-[64px] items-center gap-3 rounded-lg px-1.5 py-2"
    :aria-label="`查看 ${props.tool.name} 详情`"
  >
    <ToolLogo
      :domain="props.tool.domain"
      :name="props.tool.name"
      :size="40"
      img-class="recommend-logo"
      fallback-class="recommend-logo"
    />
    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-2">
        <strong class="truncate text-[13px] font-medium text-[#252b38]">{{ props.tool.name }}</strong>
        <span v-if="props.recommended" class="shrink-0 rounded bg-[#fff0f3] px-1 py-0.5 text-[10px] font-semibold text-[#ff4164]">推荐</span>
      </span>
      <span class="mt-0.5 block truncate text-[11px] leading-4 text-[#7b8597]">{{ props.tool.desc }}</span>
    </span>
  </NuxtLink>
</template>
