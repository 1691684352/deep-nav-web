<script setup lang="ts">
import type { SearchItem, SearchResult, SearchSort, SeoMeta } from '#shared/types'
import { faviconUrl, initialOf } from '#shared/utils'

interface SearchPayload {
  seo: SeoMeta
  result: SearchResult
  sortOptions: ReadonlyArray<{ value: SearchSort, label: string }>
  suggestions: string[]
}

const route = useRoute()
const router = useRouter()
const { visit } = useToolActions()

const keyword = computed(() => String(route.query.keyword ?? route.query.q ?? ''))
const category = computed(() => String(route.query.category ?? 'all'))
const sort = computed(() => String(route.query.sort ?? 'heat') as SearchSort)
const page = computed(() => Number(route.query.page ?? 1))

const input = ref(keyword.value)
watch(keyword, value => (input.value = value))

const { data } = await useAsyncData(
  'search',
  () => $api<SearchPayload>('/api/search', {
    query: { keyword: keyword.value, category: category.value, sort: sort.value, page: page.value, pageSize: 10 },
  }),
  { watch: [keyword, category, sort, page] },
)

useSeoFromApi(() => data.value?.seo)

const result = computed(() => data.value?.result)
const jumpTo = ref(page.value)
watch(page, value => (jumpTo.value = value))

function updateQuery(patch: Record<string, string | number | undefined>) {
  router.push({ query: { ...route.query, q: undefined, ...patch } })
}

function submitSearch() {
  updateQuery({ keyword: input.value.trim() || undefined, page: undefined })
}

function clearSearch() {
  input.value = ''
  router.push({ query: {} })
}

function setPage(value: number) {
  if (!result.value || value < 1 || value > result.value.totalPages) return
  updateQuery({ page: value === 1 ? undefined : value })
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openTool(item: SearchItem) {
  visit(item)
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail />

    <div class="search-content min-w-0 space-y-4">
      <section class="search-results-panel panel rounded-xl p-5" aria-labelledby="search-results-title">
        <div class="search-page-heading">
          <h1 id="search-results-title" class="font-display font-bold">搜索结果</h1>
          <p>
            <template v-if="keyword">
              为您找到与“{{ keyword }}”相关的网站 <strong class="number-font text-ink">{{ result?.total ?? 0 }}</strong> 个
            </template>
            <template v-else>
              当前收录 <strong class="number-font text-ink">{{ result?.total ?? 0 }}</strong> 个优质网站，输入关键词开始检索
            </template>
          </p>
        </div>

        <form class="result-search-form" role="search" @submit.prevent="submitSearch">
          <AppIcon name="search" class="size-4 shrink-0 text-[#8792aa]" />
          <label class="sr-only" for="resultSearchInput">搜索工具、网站或资源</label>
          <input
            id="resultSearchInput"
            v-model="input"
            class="result-search-input"
            type="search"
            autocomplete="off"
            placeholder="搜索工具、网站、AI 应用..."
          >
          <button class="result-search-submit" type="submit">
            <AppIcon name="search" class="size-3.5" /><span>搜索</span>
          </button>
        </form>

        <div class="result-filter-bar">
          <div class="result-filter-tabs" role="tablist" aria-label="搜索结果分类">
            <button
              v-for="facet in result?.facets ?? []"
              :key="facet.slug"
              class="result-filter-tab"
              :class="{ active: category === facet.slug }"
              type="button"
              role="tab"
              :aria-selected="category === facet.slug"
              @click="updateQuery({ category: facet.slug === 'all' ? undefined : facet.slug, page: undefined })"
            >
              {{ facet.label }} <span class="count">{{ facet.count }}</span>
            </button>
          </div>
          <label class="sr-only" for="resultSort">排序方式</label>
          <select
            id="resultSort"
            class="result-sort"
            :value="sort"
            @change="updateQuery({ sort: ($event.target as HTMLSelectElement).value, page: undefined })"
          >
            <option v-for="option in data?.sortOptions ?? []" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="search-result-list" aria-live="polite">
          <article v-for="item in result?.list ?? []" :key="item.id" class="search-result-row">
            <NuxtLink :to="`/tool/${item.slug}`" :aria-label="`${item.name} 详情`">
              <span class="search-result-logo">
                <span v-if="!item.domain" aria-hidden="true">{{ initialOf(item.name) }}</span>
                <img v-else :src="faviconUrl(item.domain)" width="42" height="42" loading="lazy" :alt="`${item.name} 图标`">
              </span>
            </NuxtLink>
            <div class="search-result-copy">
              <div class="search-result-title">
                <strong>{{ item.name }}</strong>
                <span v-if="item.verified" class="verified-tag">官方</span>
              </div>
              <p class="search-result-desc">{{ item.desc }}</p>
              <span class="search-result-meta">{{ item.meta }}</span>
            </div>
            <span class="search-result-heat">
              <AppIcon name="flame" class="size-3" />{{ item.heat }}
            </span>
            <a
              class="search-result-visit"
              :href="item.url"
              target="_blank"
              rel="noopener"
              @click="openTool(item)"
            >访问网站 <AppIcon name="arrow-up-right" class="size-3" /></a>
          </article>
        </div>

        <div class="search-empty" :class="{ 'is-visible': !result?.list.length }">
          <AppIcon name="search-x" class="mx-auto size-7 text-[#a5aec0]" />
          <p class="mt-3 text-[13px] font-semibold">没有找到匹配的网站</p>
          <button class="mt-2 text-[12px] font-semibold text-brand" type="button" @click="clearSearch">清除搜索条件</button>
        </div>

        <nav v-if="result && result.totalPages > 1" class="result-pagination" aria-label="结果分页">
          <button class="page-control" type="button" aria-label="上一页" :disabled="result.page === 1" @click="setPage(result.page - 1)">
            <AppIcon name="chevron-left" class="size-3.5" />
          </button>
          <button
            v-for="p in result.totalPages"
            :key="p"
            class="page-control"
            :class="{ active: p === result.page }"
            type="button"
            :aria-label="`第 ${p} 页`"
            @click="setPage(p)"
          >{{ p }}</button>
          <button
            class="page-control"
            type="button"
            aria-label="下一页"
            :disabled="result.page === result.totalPages"
            @click="setPage(result.page + 1)"
          >
            <AppIcon name="chevron-right" class="size-3.5" />
          </button>
          <label class="page-jump">
            跳至
            <input
              v-model.number="jumpTo"
              type="number"
              min="1"
              :max="result.totalPages"
              aria-label="输入页码"
              @keydown.enter.prevent="setPage(Number(jumpTo))"
            >
            页
          </label>
        </nav>
      </section>

      <section v-if="!keyword" class="panel rounded-xl p-5" aria-labelledby="search-suggest-title">
        <h2 id="search-suggest-title" class="font-display text-[16px] font-bold text-ink">大家都在搜</h2>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="item in data?.suggestions ?? []"
            :key="item"
            class="rounded-lg bg-canvas px-3 py-1.5 text-[12px] font-semibold text-copy transition hover:bg-brand-soft hover:text-brand"
            type="button"
            @click="updateQuery({ keyword: item, page: undefined })"
          >{{ item }}</button>
        </div>
      </section>
    </div>

    <RightRail />
  </div>
</template>
