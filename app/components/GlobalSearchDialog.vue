<script setup lang="ts">
import type { Tool } from '#shared/types'
import { useDebounceFn } from '@vueuse/core'
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
const input = ref<HTMLInputElement | null>(null)

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
  input.value?.focus({ preventScroll: true })
  input.value?.select()
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
  <BaseDialog
    :open="ui.searchOpen"
    dialog-class="global-search-dialog"
    aria-labelledby="globalSearchTitle"
    @close="ui.closeSearch()"
  >
    <div class="global-search-panel">
      <div class="global-search-head">
        <h2 id="globalSearchTitle" class="font-display">全站搜索</h2>
        <button class="global-search-close" type="button" aria-label="关闭全站搜索" @click="ui.closeSearch()">
          <AppIcon name="x" class="size-5" />
        </button>
      </div>

      <form class="global-search-form" role="search" @submit.prevent="submit">
        <img src="/assets/icon-search.png" width="18" height="18" alt="">
        <input
          ref="input"
          v-model="keyword"
          class="global-search-input"
          type="search"
          autocomplete="off"
          aria-label="搜索工具、网站或资源"
          placeholder="搜索工具、网站或资源..."
        >
        <button class="global-search-submit" type="submit">搜索</button>
      </form>

      <div class="global-search-hot" aria-label="热门搜索">
        <span>热门：</span>
        <button v-for="item in hotKeywords" :key="item.value" type="button" @click="pick(item.value)">
          {{ item.label }}
        </button>
      </div>

      <div class="global-search-meta">
        <span>{{ resultTitle }}</span>
        <span>{{ loading ? '搜索中…' : resultCount }}</span>
      </div>

      <div class="global-search-results" aria-live="polite">
        <button
          v-for="tool in results"
          :key="tool.id"
          class="global-search-result w-full text-left"
          type="button"
          :aria-label="`查看 ${tool.name} 详情`"
          @click="openTool(tool)"
        >
          <ToolLogo
            :domain="tool.domain"
            :name="tool.name"
            :size="36"
            img-class="global-search-result-logo"
            fallback-class="global-search-result-logo"
          />
          <span class="global-search-result-copy">
            <strong>{{ tool.name }}</strong>
            <span>{{ tool.category }} · {{ tool.desc }}</span>
          </span>
          <img src="/assets/icon-external.png" width="14" height="14" alt="">
        </button>
        <p v-if="!loading && !results.length" class="global-search-empty">未找到匹配的工具</p>
      </div>
    </div>
  </BaseDialog>
</template>
