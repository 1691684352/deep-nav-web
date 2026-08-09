<script setup lang="ts">
import type {
  Category,
  FeatureCard,
  HomeGreeting,
  LatestTool,
  NavCategory,
  SeoMeta,
  SiteConfig,
  Tool,
  Topic,
} from '#shared/types'
import { useSiteStore } from '~/stores/site'

interface HomePayload {
  seo: SeoMeta
  site: SiteConfig
  featureCards: FeatureCard[]
  recommendedTools: Tool[]
  categories: Category[]
  navCategories: NavCategory[]
  greeting: HomeGreeting
  tools: Tool[]
  latestTools: LatestTool[]
  rankSets: Record<string, Tool[]>
  topics: Topic[]
}

const site = useSiteStore()
const { data } = await useAsyncData('home', () => $api<HomePayload>('/api/home'))

watchEffect(() => {
  if (data.value) site.hydrate(data.value)
})

useSeoFromApi(() => data.value?.seo)

const activeNav = ref('hot')
const keyword = ref('')
const latestReversed = ref(false)
const rankPeriod = ref('日榜')

const navTabs = computed(() => data.value?.navCategories ?? [])
const rankPeriods = computed(() => Object.keys(data.value?.rankSets ?? {}))

const visibleTools = computed(() => {
  const pool = data.value?.tools ?? []
  const needle = keyword.value.trim().toLowerCase()
  return pool.filter((tool) => {
    const navMatch = activeNav.value === 'hot' || tool.navCategorySlug === activeNav.value
    const keywordMatch = !needle
      || `${tool.name}${tool.desc}${tool.category}${tool.navCategory}`.toLowerCase().includes(needle)
    return navMatch && keywordMatch
  })
})

const showMoreCard = computed(() =>
  activeNav.value === 'hot' && !keyword.value.trim() && visibleTools.value.length >= 20)

const latestList = computed(() => {
  const list = data.value?.latestTools ?? []
  return latestReversed.value ? [...list].reverse() : list
})

const rankList = computed(() => data.value?.rankSets?.[rankPeriod.value] ?? [])

function submitSearch() {
  const value = keyword.value.trim()
  if (!value) return
  navigateTo({ path: '/search', query: { keyword: value } })
}

function pickKeyword(value: string) {
  keyword.value = value
  navigateTo({ path: '/search', query: { keyword: value } })
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail active-category="" active-action="" />

    <div class="min-w-0 space-y-4">
      <section class="hero-panel rounded-xl border border-[#e6ecf8] p-7 sm:p-8" aria-labelledby="hero-title">
        <div class="hero-copy relative z-10 max-w-[66%]">
          <div class="flex items-center gap-2 text-[12px] font-semibold text-brand">
            <span class="h-px w-5 bg-brand" />{{ data?.greeting.eyebrow }}
          </div>
          <h1 id="hero-title" class="mt-2.5 font-display text-[32px] font-extrabold leading-tight text-[#121827]">
            {{ data?.greeting.title }}
          </h1>
          <p class="mt-2 text-[14px] font-medium leading-6 text-copy">{{ data?.greeting.subtitle }}</p>

          <form
            id="searchForm"
            class="search-wrap mt-5 flex h-[58px] items-center rounded-full border border-white/90 bg-white/95 p-1.5"
            role="search"
            @submit.prevent="submitSearch"
          >
            <label for="toolSearch" class="sr-only">搜索工具、网站或资源</label>
            <AppIcon name="search" class="ml-3 size-[18px] shrink-0 text-[#8792aa]" />
            <input
              id="toolSearch"
              v-model="keyword"
              class="min-w-0 flex-1 border-0 bg-transparent px-3 text-[13px] text-ink outline-none placeholder:text-[#9aa5b9]"
              type="search"
              placeholder="输入关键词，搜索工具、网站或资源..."
              autocomplete="off"
            >
            <button
              class="flex h-[46px] shrink-0 items-center gap-2 rounded-full bg-brand px-7 text-[13px] font-semibold text-white shadow-[0_7px_15px_rgba(36,87,245,.20)] transition hover:bg-brand-deep active:scale-[.98]"
              type="submit"
            >
              <AppIcon name="search" class="size-4" />搜索
            </button>
          </form>

          <div class="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#72809a]">
            <span class="text-[#99a3b6]">热门搜索：</span>
            <button
              v-for="item in data?.site.hotKeywords ?? []"
              :key="item"
              class="hot-key hover:text-brand"
              type="button"
              @click="pickKeyword(item)"
            >{{ item }}</button>
          </div>
        </div>

        <div class="beacon" aria-hidden="true">
          <div class="beacon-glow" /><div class="beacon-ring one" /><div class="beacon-ring two" /><div class="beacon-core" />
          <div class="beacon-star"><AppIcon name="star" class="size-6" fill /></div>
          <div class="beacon-chip left"><AppIcon name="arrow-up" class="size-4" /></div>
          <div class="beacon-chip right"><AppIcon name="sparkles" class="size-4" /></div>
        </div>
      </section>

      <section class="feature-media-grid" aria-label="精选工具推荐">
        <FeatureMediaCard v-for="card in data?.featureCards ?? []" :key="card.id" :card="card" />
      </section>

      <section id="popular-tools" class="panel rounded-xl p-4" aria-labelledby="popular-title">
        <h2 id="popular-title" class="sr-only">网址导航</h2>
        <div
          id="categoryTabs"
          class="flex gap-1 overflow-x-auto border-b border-[#e9edf3] text-[13px] font-medium"
          role="tablist"
          aria-label="网址导航分类"
        >
          <button
            v-for="nav in navTabs"
            :key="nav.slug"
            class="category-tab h-11 shrink-0 px-3"
            :class="{ active: activeNav === nav.slug }"
            type="button"
            role="tab"
            :aria-selected="activeNav === nav.slug"
            @click="activeNav = nav.slug"
          >{{ nav.label }}</button>
        </div>

        <div v-if="visibleTools.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5" aria-live="polite">
          <ToolCard v-for="tool in visibleTools" :key="tool.id" :tool="tool" />
          <NuxtLink
            v-if="showMoreCard"
            to="/category/all"
            class="view-more-card tool-card flex min-h-[60px] items-center justify-center gap-2 rounded-xl border border-[#e9edf3] bg-white text-[12px] font-medium text-[#687386] transition hover:text-brand"
          >
            查看更多 <AppIcon name="chevron-right" class="size-4" />
          </NuxtLink>
        </div>

        <EmptyState
          v-else
          title="没有找到匹配的工具"
          action-label="清除搜索条件"
          @action="keyword = ''; activeNav = 'hot'"
        />
      </section>

      <section id="topics" class="panel rounded-xl p-5" aria-labelledby="topic-title">
        <div class="flex items-center justify-between">
          <h2 id="topic-title" class="font-display text-[17px] font-bold">推荐专题</h2>
          <NuxtLink to="/topic" class="flex items-center gap-1 text-[12px] font-semibold text-brand">
            查看全部 <AppIcon name="arrow-right" class="size-3" />
          </NuxtLink>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <TopicCard v-for="topic in data?.topics ?? []" :key="topic.id" :topic="topic" />
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.35fr_.85fr]">
        <div class="panel rounded-xl p-5">
          <div class="flex min-h-[52px] items-start justify-between">
            <div>
              <h2 class="font-display text-[18px] font-bold">最新收录</h2>
              <p class="mt-1 text-[12px] text-muted">发现刚刚收录的新鲜工具</p>
            </div>
            <button
              class="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-canvas hover:text-brand"
              type="button"
              aria-label="刷新最新收录"
              @click="latestReversed = !latestReversed"
            >
              <AppIcon name="refresh-cw" class="size-4" />
            </button>
          </div>
          <div class="mt-3 space-y-1">
            <LatestRow v-for="tool in latestList" :key="tool.id" :tool="tool" />
          </div>
          <NuxtLink
            to="/category/all"
            class="mt-3 flex h-10 items-center justify-center gap-1 rounded-lg text-[13px] font-semibold text-brand transition hover:bg-brand-soft"
          >
            查看更多最新收录 <AppIcon name="arrow-right" class="size-3.5" />
          </NuxtLink>
        </div>

        <div id="ranking" class="panel rounded-xl p-5">
          <div class="flex min-h-[52px] items-start justify-between">
            <div>
              <h2 class="font-display text-[18px] font-bold">人气榜单</h2>
              <p class="mt-1 text-[12px] text-muted">全站实时热度排行</p>
            </div>
            <div class="flex rounded-lg bg-canvas p-0.5 text-[12px] font-semibold">
              <button
                v-for="period in rankPeriods"
                :key="period"
                class="rank-period rounded-md px-2.5 py-1.5"
                :class="rankPeriod === period ? 'bg-white text-brand shadow-sm' : 'text-muted'"
                type="button"
                @click="rankPeriod = period"
              >{{ period }}</button>
            </div>
          </div>
          <ol class="mt-3 space-y-1">
            <RankRow v-for="(tool, index) in rankList" :key="tool.id" :tool="tool" :rank="index + 1" />
          </ol>
          <NuxtLink
            to="/ranking"
            class="mt-3 flex h-10 items-center justify-center gap-1 rounded-lg text-[13px] font-semibold text-brand transition hover:bg-brand-soft"
          >
            查看完整榜单 <AppIcon name="arrow-right" class="size-3.5" />
          </NuxtLink>
        </div>
      </section>
    </div>

    <RightRail />
  </div>
</template>
