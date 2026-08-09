<script setup lang="ts">
import type { Tool } from '#shared/types'

const props = defineProps<{ tool: Tool }>()

const { visit } = useToolActions()
</script>

<template>
  <article class="tool-card group relative min-h-[60px] overflow-hidden rounded-xl border border-[#e9edf3] bg-white">
    <NuxtLink
      :to="`/tool/${props.tool.slug}`"
      class="flex min-h-[60px] items-center gap-3 py-0 pl-3 pr-11"
      :aria-label="`查看 ${props.tool.name} 详情`"
    >
      <ToolLogo :domain="props.tool.domain" :name="props.tool.name" />
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px] font-medium text-[#202633]">{{ props.tool.name }}</span>
        <span class="mt-0.5 block truncate text-[11px] leading-4 text-[#7d8799]">{{ props.tool.desc }}</span>
      </span>
    </NuxtLink>
    <a
      :href="props.tool.url"
      target="_blank"
      rel="noopener"
      class="tool-external-link absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg opacity-0 transition focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
      :aria-label="`在新标签页打开 ${props.tool.name}`"
      :title="`打开 ${props.tool.name} 官网`"
      @click="visit(props.tool)"
    >
      <img src="/assets/icon-external.png" width="14" height="14" alt="">
    </a>
  </article>
</template>
