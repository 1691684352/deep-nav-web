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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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

    <div class="flex min-w-0 flex-col gap-4">
      <Card class="gap-0 p-7 sm:p-8" aria-labelledby="hero-title">
        <div class="max-w-2xl">
          <div class="flex items-center gap-2 text-[12px] font-semibold text-muted-foreground">
            <span class="h-px w-5 bg-foreground" />{{ data?.greeting.eyebrow }}
          </div>
          <h1 id="hero-title" class="mt-2.5 font-display text-[32px] font-extrabold leading-tight text-balance">
            {{ data?.greeting.title }}
          </h1>
          <p class="mt-2 text-[14px] font-medium leading-6 text-muted-foreground">{{ data?.greeting.subtitle }}</p>

          <form
            class="mt-5 flex items-center gap-2"
            role="search"
            @submit.prevent="submitSearch"
          >
            <label for="toolSearch" class="sr-only">搜索工具、网站或资源</label>
            <div class="relative flex-1">
              <AppIcon name="search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="toolSearch"
                v-model="keyword"
                class="h-12 w-full rounded-lg border bg-background pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-ring placeholder:text-muted-foreground"
                type="search"
                placeholder="输入关键词，搜索工具、网站或资源..."
                autocomplete="off"
              >
            </div>
            <Button type="submit" size="lg" class="h-12 px-7">
              <AppIcon name="search" class="size-4" />搜索
            </Button>
          </form>

          <div class="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px]">
            <span class="text-muted-foreground">热门搜索：</span>
            <button
              v-for="item in data?.site.hotKeywords ?? []"
              :key="item"
              class="text-muted-foreground transition-colors hover:text-foreground"
              type="button"
              @click="pickKeyword(item)"
            >{{ item }}</button>
          </div>
        </div>
      </Card>

      <section class="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="精选工具推荐">
        <FeatureMediaCard v-for="card in data?.featureCards ?? []" :key="card.id" :card="card" />
      </section>

      <Card id="popular-tools" class="gap-0 p-4" aria-labelledby="popular-title">
        <h2 id="popular-title" class="sr-only">网址导航</h2>
        <div
          class="flex gap-1 overflow-x-auto border-b text-[13px] font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="网址导航分类"
        >
          <button
            v-for="nav in navTabs"
            :key="nav.slug"
            :class="cn(
              'h-11 shrink-0 whitespace-nowrap border-b-2 px-3 transition-colors',
              activeNav === nav.slug ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )"
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
            class="flex min-h-[60px] items-center justify-center gap-2 rounded-xl border border-dashed bg-card text-[12px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
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
      </Card>

      <Card id="topics" class="gap-0 p-5" aria-labelledby="topic-title">
        <div class="flex items-center justify-between">
          <h2 id="topic-title" class="font-display text-[17px] font-bold">推荐专题</h2>
          <NuxtLink to="/topic" class="flex items-center gap-1 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
            查看全部 <AppIcon name="arrow-right" class="size-3" />
          </NuxtLink>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <TopicCard v-for="topic in data?.topics ?? []" :key="topic.id" :topic="topic" />
        </div>
      </Card>

      <section class="grid gap-4 xl:grid-cols-[1.35fr_.85fr]">
        <Card class="gap-0 p-5">
          <div class="flex min-h-[52px] items-start justify-between">
            <div>
              <h2 class="font-display text-[18px] font-bold">最新收录</h2>
              <p class="mt-1 text-[12px] text-muted-foreground">发现刚刚收录的新鲜工具</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="刷新最新收录"
              @click="latestReversed = !latestReversed"
            >
              <AppIcon name="refresh-cw" class="size-4" />
            </Button>
          </div>
          <div class="mt-3 flex flex-col gap-1">
            <LatestRow v-for="tool in latestList" :key="tool.id" :tool="tool" />
          </div>
          <NuxtLink
            to="/category/all"
            class="mt-3 flex h-10 items-center justify-center gap-1 rounded-lg text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            查看更多最新收录 <AppIcon name="arrow-right" class="size-3.5" />
          </NuxtLink>
        </Card>

        <Card id="ranking" class="gap-0 p-5">
          <div class="flex min-h-[52px] items-start justify-between">
            <div>
              <h2 class="font-display text-[18px] font-bold">人气榜单</h2>
              <p class="mt-1 text-[12px] text-muted-foreground">全站实时热度排行</p>
            </div>
            <div class="flex rounded-lg bg-muted p-0.5 text-[12px] font-semibold">
              <button
                v-for="period in rankPeriods"
                :key="period"
                :class="cn(
                  'rounded-md px-2.5 py-1.5 transition-colors',
                  rankPeriod === period ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
                )"
                type="button"
                @click="rankPeriod = period"
              >{{ period }}</button>
            </div>
          </div>
          <ol class="mt-3 flex flex-col gap-1">
            <RankRow v-for="(tool, index) in rankList" :key="tool.id" :tool="tool" :rank="index + 1" />
          </ol>
          <NuxtLink
            to="/ranking"
            class="mt-3 flex h-10 items-center justify-center gap-1 rounded-lg text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            查看完整榜单 <AppIcon name="arrow-right" class="size-3.5" />
          </NuxtLink>
        </Card>
      </section>
    </div>

    <RightRail />
  </div>
</template>
