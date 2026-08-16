<script setup lang="ts">
import type { PageResult, SeoMeta, Topic } from '#shared/types'

interface TopicListPayload {
  seo: SeoMeta
  keyword: string
  result: PageResult<Topic>
}

const route = useRoute()
const router = useRouter()

const keyword = computed(() => String(route.query.keyword ?? ''))
const searchInput = ref(keyword.value)

watch(keyword, value => (searchInput.value = value))

const { data } = await useAsyncData(
  'topic-list',
  // Fetch every topic in one go — the catalogue is small enough not to need pagination.
  () => $api<TopicListPayload>('/api/topics', { query: { keyword: keyword.value, page: 1, pageSize: 100 } }),
  { watch: [keyword] },
)

useSeoFromApi(() => data.value?.seo)

const result = computed(() => data.value?.result)

function submitSearch() {
  router.push({ query: { keyword: searchInput.value.trim() || undefined } })
}

function clearSearch() {
  searchInput.value = ''
  router.push({ query: {} })
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail />

    <section class="min-w-0 space-y-4" aria-labelledby="topic-page-title">
      <section class="topic-hero p-7 sm:p-8">
        <div class="relative z-10 max-w-[680px]">
          <p class="flex items-center gap-2 text-[12px] font-semibold text-primary">
            <span class="h-px w-5 bg-primary" />场景化工具合集
          </p>
          <h1 id="topic-page-title" class="mt-2 font-display text-[29px] font-extrabold leading-tight text-foreground">精选专题</h1>
          <p class="mt-2 text-[13px] font-medium leading-6 text-muted-foreground">
            围绕真实工作与创作场景，整理优质资源合集，帮助你更快找到适合的工具。
          </p>
          <form class="topic-search mt-5 flex items-center p-1" role="search" @submit.prevent="submitSearch">
            <AppIcon name="search" class="ml-3 size-4 shrink-0 text-muted-foreground" />
            <label class="sr-only" for="topicSearch">搜索专题</label>
            <input
              id="topicSearch"
              v-model="searchInput"
              class="flex-1 border-0 bg-transparent px-3 text-[13px] text-foreground placeholder:text-muted-foreground"
              type="search"
              autocomplete="off"
              placeholder="输入关键词，搜索专题合集..."
            >
            <button
              class="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              type="submit"
            >
              <AppIcon name="search" class="size-3.5" /><span>搜索</span>
            </button>
          </form>
        </div>
        <div class="topic-hero__motif" aria-hidden="true"><AppIcon name="layers-3" class="size-10" /></div>
      </section>

      <section class="panel rounded-xl p-5" aria-labelledby="topic-grid-title">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 id="topic-grid-title" class="font-display text-[18px] font-bold">全部专题</h2>
            <p class="mt-1 text-[12px] text-muted-foreground">
              {{ keyword ? `找到 ${result?.total ?? 0} 个相关专题` : `已收录 ${result?.total ?? 0} 个场景专题` }}
            </p>
          </div>
          <span class="rounded-lg bg-secondary px-2.5 py-1.5 text-[11px] font-semibold text-primary">持续更新</span>
        </div>

        <div v-if="result?.list.length" class="topic-grid mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <TopicCard v-for="topic in result.list" :key="topic.id" :topic="topic" />
        </div>

        <div v-else class="topic-empty is-visible mt-5 min-h-40 place-items-center p-6 text-center">
          <div>
            <AppIcon name="search-x" class="mx-auto size-7" />
            <p class="mt-3 text-[13px] font-semibold">没有找到匹配的专题</p>
            <button class="mt-2 text-[12px] font-semibold text-primary" type="button" @click="clearSearch">清除搜索条件</button>
          </div>
        </div>
      </section>
    </section>

    <RightRail />
  </div>
</template>
