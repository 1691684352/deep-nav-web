<script setup lang="ts">
import type { Tool } from '#shared/types'
import { useDebounceFn } from '@vueuse/core'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSiteStore } from '~/stores/site'
import { useUiStore } from '~/stores/ui'

interface SuggestPayload {
  keyword: string
  tools: Tool[]
  keywords: Array<{ label: string, value: string }>
}

const ui = useUiStore()
const site = useSiteStore()

const keyword = ref('')
const results = ref<Tool[]>([])
const total = ref(0)
const loading = ref(false)
const input = ref<InstanceType<typeof Input> | null>(null)

const hotKeywords = computed(() => site.site?.globalSearchKeywords ?? [])
const resultTitle = computed(() => (keyword.value.trim() ? '搜索结果' : '推荐工具'))
const resultCount = computed(() => (keyword.value.trim() ? `${total.value} 个结果` : `${results.value.length} 项`))

async function load() {
  loading.value = true
  try {
    const payload = await $api<SuggestPayload>('/api/search/suggest', {
      query: { keyword: keyword.value, limit: 8 },
    })
    results.value = payload.tools
    total.value = payload.tools.length
    if (keyword.value.trim()) {
      const search = await $api<{ result: { total: number } }>('/api/search', {
        query: { keyword: keyword.value, pageSize: 1 },
      })
      total.value = search.result.total
    }
  }
  finally {
    loading.value = false
  }
}

const debouncedLoad = useDebounceFn(load, 220)

watch(keyword, () => debouncedLoad())

watch(() => ui.searchOpen, async (open) => {
  if (!open) return
  await load()
  await nextTick()
  const el = input.value?.$el as HTMLInputElement | undefined
  el?.focus({ preventScroll: true })
  el?.select()
})

function submit() {
  const value = keyword.value.trim()
  ui.closeSearch()
  navigateTo({ path: '/search', query: value ? { keyword: value } : {} })
}

function pick(value: string) {
  keyword.value = value
  load()
}

function openTool(tool: Tool) {
  ui.closeSearch()
  navigateTo(`/tool/${tool.slug}`)
}
</script>

<template>
  <Dialog :open="ui.searchOpen" @update:open="(value) => !value && ui.closeSearch()">
    <DialogContent class="top-[12%] max-w-[620px] translate-y-0 gap-4">
      <DialogHeader>
        <DialogTitle class="font-display text-[18px]">全站搜索</DialogTitle>
      </DialogHeader>

      <form role="search" @submit.prevent="submit">
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref="input"
              v-model="keyword"
              type="search"
              autocomplete="off"
              aria-label="搜索工具、网站或资源"
              placeholder="搜索工具、网站或资源..."
              class="h-11 pl-9"
            />
          </div>
          <Button type="submit" class="h-11">搜索</Button>
        </div>
      </form>

      <div class="flex items-center gap-2 overflow-x-auto text-[11px] text-muted-foreground" aria-label="热门搜索">
        <span class="shrink-0">热门：</span>
        <Badge
          v-for="item in hotKeywords"
          :key="item.value"
          as="button"
          type="button"
          variant="secondary"
          class="shrink-0 cursor-pointer font-normal"
          @click="pick(item.value)"
        >
          {{ item.label }}
        </Badge>
      </div>

      <div class="flex items-center justify-between text-[12px] font-semibold">
        <span>{{ resultTitle }}</span>
        <span class="font-normal text-muted-foreground">{{ loading ? '搜索中…' : resultCount }}</span>
      </div>

      <div class="-mx-1 max-h-[352px] overflow-y-auto px-1" aria-live="polite">
        <button
          v-for="tool in results"
          :key="tool.id"
          class="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
          type="button"
          :aria-label="`查看 ${tool.name} 详情`"
          @click="openTool(tool)"
        >
          <ToolLogo :domain="tool.domain" :name="tool.name" :size="36" />
          <span class="min-w-0 flex-1">
            <strong class="block truncate text-[13px] font-semibold">{{ tool.name }}</strong>
            <span class="block truncate text-[11px] text-muted-foreground">{{ tool.category }} · {{ tool.desc }}</span>
          </span>
          <AppIcon name="arrow-up-right" class="size-4 shrink-0 text-muted-foreground" />
        </button>
        <p v-if="!loading && !results.length" class="py-8 text-center text-[12px] text-muted-foreground">未找到匹配的工具</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
