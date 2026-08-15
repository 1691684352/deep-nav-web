<script setup lang="ts">
import type { NavCategory, PageResult, SearchSort, SeoMeta, Tool } from '#shared/types'

interface SubcategoryPayload {
  seo: SeoMeta
  nav: NavCategory
  filters: string[]
  sortOptions: ReadonlyArray<{ value: SearchSort, label: string }>
  filter: string
  sort: SearchSort
  result: PageResult<Tool>
  siblings: NavCategory[]
  hotTools: Tool[]
}

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.slug))
const filter = computed(() => String(route.query.filter ?? '全部'))
const sort = computed(() => String(route.query.sort ?? 'heat') as SearchSort)
const page = computed(() => Number(route.query.page ?? 1))

const { data, error } = await useAsyncData(
  () => `subcategory-${slug.value}`,
  () => $api<SubcategoryPayload>(`/api/subcategories/${slug.value}`, {
    query: { filter: filter.value, sort: sort.value, page: page.value, pageSize: 24 },
  }),
  { watch: [slug, filter, sort, page] },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: '子分类不存在', fatal: true })
}

useSeoFromApi(() => data.value?.seo)

const nav = computed(() => data.value?.nav)
const result = computed(() => data.value?.result)

function updateQuery(patch: Record<string, string | number | undefined>) {
  router.push({ query: { ...route.query, ...patch } })
}

function setFilter(value: string) {
  updateQuery({ filter: value === '全部' ? undefined : value, page: undefined })
}

function setPage(value: number) {
  updateQuery({ page: value === 1 ? undefined : value })
  if (import.meta.client) {
    document.getElementById('popular-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail />

    <div class="min-w-0 space-y-6">
      <section class="hero-panel category-hero rounded-xl border border-border p-7 sm:p-8" aria-labelledby="subcategory-title">
        <div class="hero-copy relative z-10">
          <nav class="category-breadcrumb flex items-center gap-1.5 text-[12px] font-medium" aria-label="面包屑">
            <NuxtLink to="/">工具导航</NuxtLink>
            <AppIcon name="chevron-right" class="size-3.5" />
            <NuxtLink to="/category/ai">AI 导航</NuxtLink>
            <AppIcon name="chevron-right" class="size-3.5" />
            <span>{{ nav?.title }}</span>
          </nav>
          <div class="mt-4 flex items-center gap-3">
            <span class="category-title-icon" aria-hidden="true">
              <AppIcon :name="nav?.icon ?? 'image'" class="size-5" />
            </span>
            <h1 id="subcategory-title" class="font-display text-[32px] font-extrabold leading-tight text-foreground">
              {{ nav?.title }}
            </h1>
          </div>
          <p class="mt-3 max-w-[650px] text-[14px] font-medium leading-6 text-muted-foreground">{{ nav?.description }}</p>
          <div class="mt-5 flex flex-wrap gap-y-3">
            <div class="category-metric"><strong>{{ nav?.toolCount ?? 0 }}</strong><span>已收录工具</span></div>
            <div class="category-metric"><strong>多端可用</strong><span>网页与桌面端</span></div>
            <div class="category-metric"><strong>持续更新</strong><span>每日精选</span></div>
          </div>
        </div>
        <div class="beacon" aria-hidden="true">
          <div class="beacon-glow" /><div class="beacon-ring one" /><div class="beacon-ring two" /><div class="beacon-core" />
          <div class="beacon-star"><AppIcon :name="nav?.icon ?? 'image'" class="size-6" /></div>
          <div class="beacon-chip left"><AppIcon name="wand-sparkles" class="size-4" /></div>
          <div class="beacon-chip right"><AppIcon name="palette" class="size-4" /></div>
        </div>
      </section>

      <section class="panel detail-filter rounded-xl px-4 py-3 sm:px-5" :aria-label="`${nav?.title} 筛选`">
        <div class="detail-filter__tabs" role="tablist" :aria-label="`${nav?.title} 筛选`">
          <button
            v-for="item in data?.filters ?? []"
            :key="item"
            class="detail-filter__tab"
            :class="{ active: filter === item }"
            type="button"
            role="tab"
            :aria-selected="filter === item"
            @click="setFilter(item)"
          >{{ item }}</button>
        </div>
      </section>

      <section id="popular-tools" class="panel rounded-xl p-4" aria-labelledby="detail-tools-title">
        <h2 id="detail-tools-title" class="sr-only">{{ nav?.title }}列表</h2>
        <div v-if="result?.list.length" class="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-live="polite">
          <ToolCard v-for="tool in result.list" :key="tool.id" :tool="tool" />
        </div>
        <EmptyState
          v-else
          title="没有找到匹配的工具"
          action-label="清除筛选条件"
          @action="setFilter('全部')"
        />
        <PaginationBar
          v-if="result"
          :page="result.page"
          :total-pages="result.totalPages"
          label="工具列表分页"
          @change="setPage"
        />
      </section>
    </div>

    <RightRail />
  </div>
</template>
