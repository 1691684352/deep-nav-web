<script setup lang="ts">
import type { Tool } from '#shared/types'

const props = defineProps<{ tool: Tool }>()

const { visit } = useToolActions()
</script>

<template>
  <article class="group relative min-h-[60px] overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20 hover:bg-accent/50">
    <NuxtLink
      :to="`/tool/${props.tool.slug}`"
      class="flex min-h-[60px] items-center gap-3 py-0 pl-3 pr-11"
      :aria-label="`查看 ${props.tool.name} 详情`"
    >
      <ToolLogo :domain="props.tool.domain" :name="props.tool.name" />
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px] font-medium">{{ props.tool.name }}</span>
        <span class="mt-0.5 block truncate text-[11px] leading-4 text-muted-foreground">{{ props.tool.desc }}</span>
      </span>
    </NuxtLink>
    <a
      :href="props.tool.url"
      target="_blank"
      rel="noopener"
      class="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
      :aria-label="`在新标签页打开 ${props.tool.name}`"
      :title="`打开 ${props.tool.name} 官网`"
      @click="visit(props.tool)"
    >
      <AppIcon name="arrow-up-right" class="size-3.5" />
    </a>
  </article>
</template>
