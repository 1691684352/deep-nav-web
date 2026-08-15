<script setup lang="ts">
import type { PageResult, SearchSort, SeoMeta, Tool, TopicDetail } from '#shared/types'
import { faviconUrl } from '#shared/utils'

interface TopicDetailPayload {
  seo: SeoMeta
  topic: TopicDetail
  filters: string[]
  sortOptions: ReadonlyArray<{ value: SearchSort, label: string }>
  filter: string
  sort: SearchSort
  result: PageResult<Tool>
}

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.slug))
const filter = computed(() => String(route.query.filter ?? '全部'))
const sort = computed(() => String(route.query.sort ?? 'heat') as SearchSort)
const page = computed(() => Number(route.query.page ?? 1))

const { data, error } = await useAsyncData(
  () => `topic-${slug.value}`,
  () => $api<TopicDetailPayload>(`/api/topics/${slug.value}`, {
    query: { filter: filter.value, sort: sort.value, page: page.value, pageSize: 20 },
  }),
  { watch: [slug, filter, sort, page] },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: '专题不存在', fatal: true })
}

useSeoFromApi(() => data.value?.seo)

const topic = computed(() => data.value?.topic)
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
    document.getElementById('topic-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail />

    <div class="min-w-0 space-y-4">
      <section class="topic-hero p-7 sm:p-8" aria-labelledby="topic-detail-title">
        <div class="relative z-10 max-w-[680px]">
          <nav class="category-breadcrumb flex items-center gap-1.5 text-[12px] font-medium" aria-label="面包屑">
            <NuxtLink to="/">工具导航</NuxtLink>
            <AppIcon name="chevron-right" class="size-3.5" />
            <NuxtLink to="/topic">精选专题</NuxtLink>
            <AppIcon name="chevron-right" class="size-3.5" />
            <span>{{ topic?.title }}</span>
          </nav>
          <h1 id="topic-detail-title" class="mt-3 font-display text-[29px] font-extrabold leading-tight text-foreground">
            {{ topic?.title }}
          </h1>
          <p class="mt-2 text-[13px] font-medium leading-6 text-muted-foreground">{{ topic?.intro }}</p>
          <div class="mt-5 flex flex-wrap items-center gap-3">
            <div class="flex -space-x-1.5">
              <img
                v-for="domain in topic?.icons ?? []"
                :key="domain"
                class="mini-logo border-2 border-white"
                :src="faviconUrl(domain)"
                width="28"
                height="28"
                loading="lazy"
                alt=""
              >
            </div>
            <p class="text-[12px] text-muted-foreground">
              共 <strong class="number-font text-[14px] text-foreground">{{ result?.total ?? 0 }}</strong> 个工具
            </p>
          </div>
        </div>
        <div class="topic-hero__motif" aria-hidden="true"><AppIcon name="layers-3" class="size-10" /></div>
      </section>

      <section class="panel detail-filter rounded-xl px-4 py-3 sm:px-5" aria-label="专题筛选">
        <div class="flex flex-wrap items-center gap-3">
          <div class="detail-filter__tabs" role="tablist" aria-label="专题筛选">
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
        </div>
      </section>

      <section id="topic-tools" class="panel rounded-xl p-4" aria-labelledby="topic-tools-title">
        <h2 id="topic-tools-title" class="sr-only">{{ topic?.title }}工具列表</h2>
        <div v-if="result?.list.length" class="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-live="polite">
          <ToolCard v-for="tool in result.list" :key="tool.id" :tool="tool" />
        </div>
        <EmptyState v-else title="该专题下暂无匹配工具" action-label="清除筛选条件" @action="setFilter('全部')" />
        <PaginationBar
          v-if="result"
          :page="result.page"
          :total-pages="result.totalPages"
          label="专题工具分页"
          @change="setPage"
        />
      </section>

      <section v-if="topic?.related?.length" class="panel rounded-xl p-5" aria-labelledby="topic-related-title">
        <h2 id="topic-related-title" class="font-display text-[17px] font-bold text-foreground">相关专题</h2>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <TopicCard v-for="item in topic.related" :key="item.id" :topic="item" />
        </div>
      </section>
    </div>

    <RightRail />
  </div>
</template>
