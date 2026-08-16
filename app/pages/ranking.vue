<script setup lang="ts">
import type {
  CategoryRankingItem,
  RankingEntry,
  RankingPeriod,
  RankingResult,
  RisingRankingItem,
  SeoMeta,
  Tool,
} from '#shared/types'
import { faviconUrl, initialOf } from '#shared/utils'

interface RankingPayload {
  seo: SeoMeta
  periods: RankingPeriod[]
  periodOptions: Array<{ value: RankingPeriod, label: string }>
  categories: string[]
  ranking: RankingResult
  categoryRanking: CategoryRankingItem[]
  rising: RisingRankingItem[]
  editorPicks: Tool[]
  stats: Array<{ value: string, label: string }>
}

const route = useRoute()
const router = useRouter()

const period = computed(() => String(route.query.period ?? '周榜') as RankingPeriod)
const category = computed(() => String(route.query.category ?? '全部'))

const { data } = await useAsyncData(
  'ranking',
  () => $api<RankingPayload>('/api/ranking', { query: { period: period.value, category: category.value } }),
  { watch: [period, category] },
)

useSeoFromApi(() => data.value?.seo)

// Structured data: breadcrumb + an ordered ItemList of the ranked tools.
const abs = useAbsoluteUrl()
useJsonLd('ranking', () => {
  const r = data.value?.ranking
  if (!r) return null
  const entries = r.entries ?? []
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': '首页', 'item': abs('/') },
          { '@type': 'ListItem', 'position': 2, 'name': '排行榜', 'item': abs('/ranking') },
        ],
      },
      {
        '@type': 'CollectionPage',
        'name': `工具排行榜 · ${r.periodLabel}`,
        'description': r.summary,
        'url': abs('/ranking'),
        ...(entries.length
          ? {
              mainEntity: {
                '@type': 'ItemList',
                'numberOfItems': r.total,
                'itemListElement': entries.map(entry => ({
                  '@type': 'ListItem',
                  'position': entry.rank,
                  'name': entry.tool.name,
                  'url': abs(`/tool/${entry.tool.slug}`),
                })),
              },
            }
          : {}),
      },
    ],
  }
})

const ranking = computed(() => data.value?.ranking)

/** The podium renders 2nd, 1st, 3rd so the winner sits in the middle. */
const podium = computed<RankingEntry[]>(() => {
  const list = ranking.value?.podium ?? []
  return [list[1], list[0], list[2]].filter((entry): entry is RankingEntry => Boolean(entry))
})

function updateQuery(patch: Record<string, string | undefined>) {
  router.push({ query: { ...route.query, ...patch } })
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail />

    <section id="ranking" class="ranking-center min-w-0 space-y-4" aria-labelledby="ranking-title">
      <section class="ranking-hero panel rounded-xl p-7 sm:p-8">
        <div class="ranking-hero__copy max-w-[620px]">
          <p class="ranking-hero__eyebrow">全站热度数据</p>
          <h1 id="ranking-title" class="mt-2 font-display text-[30px] font-extrabold leading-tight text-foreground">排行榜</h1>
          <p class="mt-2 max-w-[520px] text-[13px] font-medium leading-6 text-muted-foreground">
            发现最受欢迎的优质工具和网站，排行基于站内访问、收藏与分享数据综合计算。
          </p>
          <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
            <span v-for="stat in data?.stats ?? []" :key="stat.label">
              <strong class="number-font mr-1 text-[13px] text-foreground">{{ stat.value }}</strong>{{ stat.label }}
            </span>
          </div>
        </div>
        <div class="ranking-hero__trophy" aria-hidden="true"><AppIcon name="trophy" class="size-10" /></div>
      </section>

      <section class="panel overflow-hidden rounded-xl" aria-label="排行榜筛选">
        <div class="ranking-filter ranking-tabs flex overflow-x-auto px-3" role="tablist" aria-label="排行分类">
          <button
            v-for="item in data?.categories ?? []"
            :key="item"
            class="ranking-filter__button"
            :class="{ 'is-active': category === item }"
            type="button"
            role="tab"
            :aria-selected="category === item"
            @click="updateQuery({ category: item === '全部' ? undefined : item })"
          >{{ item === '全部' ? '总榜' : item }}</button>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div class="flex items-center gap-1 rounded-lg bg-muted p-1" aria-label="统计周期">
            <button
              v-for="item in data?.periodOptions ?? []"
              :key="item.value"
              class="ranking-period"
              :class="{ 'is-active': period === item.value }"
              type="button"
              @click="updateQuery({ period: item.value === '周榜' ? undefined : item.value })"
            >{{ item.label }}</button>
          </div>
          <p class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <AppIcon name="clock-3" class="size-3.5" /><span>数据更新于 {{ ranking?.updatedAt }}</span>
          </p>
        </div>
      </section>

      <section class="panel rounded-xl p-5" aria-labelledby="ranking-list-title">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="ranking-list-title" class="font-display text-[18px] font-bold text-foreground">全站热度排行</h2>
            <p class="mt-1 text-[12px] text-muted-foreground">{{ ranking?.summary }}</p>
          </div>
          <button
            class="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
            type="button"
            aria-label="刷新排行榜"
            @click="refreshNuxtData('ranking')"
          >
            <AppIcon name="refresh-cw" class="size-4" />
          </button>
        </div>

        <div v-if="podium.length" class="ranking-podium mt-5" aria-label="排行榜前三名">
          <NuxtLink
            v-for="entry in podium"
            :key="entry.tool.id"
            class="podium-card"
            :data-rank="entry.rank"
            :to="`/tool/${entry.tool.slug}`"
          >
            <img class="podium-card__logo" :src="faviconUrl(entry.tool.domain)" width="42" height="42" :alt="`${entry.tool.name} 图标`">
            <strong class="podium-card__name">{{ entry.tool.name }}</strong>
            <span class="podium-card__meta">
              <AppIcon name="flame" class="mr-0.5 inline size-3 text-muted-foreground" />{{ entry.heat }}
            </span>
          </NuxtLink>
        </div>

        <div class="ranking-table mt-4">
          <div class="ranking-table__head" aria-hidden="true">
            <span class="text-center">排名</span><span>产品</span><span>分类</span><span>热度值</span><span class="text-right">趋势</span>
          </div>
          <div aria-live="polite">
            <NuxtLink
              v-for="entry in ranking?.entries ?? []"
              :key="entry.tool.id"
              class="ranking-row"
              :to="`/tool/${entry.tool.slug}`"
              :aria-label="`查看 ${entry.tool.name} 详情`"
            >
              <span class="ranking-row__index" :class="{ top: entry.rank <= 3 }">{{ entry.rank }}</span>
              <span class="ranking-row__product">
                <img class="ranking-row__logo" :src="faviconUrl(entry.tool.domain)" width="30" height="30" alt="">
                <span class="min-w-0">
                  <strong class="ranking-row__name">{{ entry.tool.name }}</strong>
                  <span class="ranking-row__desc">{{ entry.tool.desc }}</span>
                </span>
              </span>
              <span class="truncate text-[11px] text-muted-foreground">{{ entry.tool.category }}</span>
              <span class="ranking-heat">
                <span class="ranking-heat__value"><AppIcon name="flame" class="mr-0.5 inline size-3" />{{ entry.heat }}</span>
                <span class="ranking-heat__bar"><span :style="{ width: `${entry.heatPercent}%` }" /></span>
              </span>
              <span class="ranking-trend" :class="{ down: entry.trend === 'down' }">
                <AppIcon :name="entry.trend === 'down' ? 'trending-down' : 'trending-up'" class="size-3" />{{ entry.changePercent }}%
              </span>
            </NuxtLink>
            <p v-if="!ranking?.entries.length" class="py-10 text-center text-[13px] text-muted-foreground">该分类暂未收录足够数据</p>
          </div>
        </div>
      </section>

      <section class="panel rounded-xl p-5" aria-labelledby="ranking-recommend-title">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 id="ranking-recommend-title" class="font-display text-[17px] font-bold text-foreground">编辑推荐</h2>
            <p class="mt-1 text-[12px] text-muted-foreground">兼顾实用性与产品体验的优质工具</p>
          </div>
          <NuxtLink to="/category/ai" class="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-primary">
            查看更多 <AppIcon name="arrow-right" class="size-3.5" />
          </NuxtLink>
        </div>
        <div class="ranking-recommend mt-4">
          <NuxtLink
            v-for="tool in data?.editorPicks ?? []"
            :key="tool.id"
            class="ranking-recommend__item"
            :to="`/tool/${tool.slug}`"
          >
            <img :src="faviconUrl(tool.domain)" width="30" height="30" :alt="`${tool.name} 图标`">
            <strong>{{ tool.name }}</strong>
            <span>{{ tool.desc }}</span>
          </NuxtLink>
        </div>
      </section>
    </section>

    <aside class="ranking-right-rail right-rail space-y-4" aria-label="排行榜说明与分类榜单">
      <section class="panel rounded-xl p-5">
        <div class="flex items-center gap-2">
          <AppIcon name="badge-info" class="size-4 text-primary" />
          <h2 class="font-display text-[16px] font-bold text-foreground">榜单说明</h2>
        </div>
        <div class="ranking-info-list">
          <p><strong>数据来源</strong><br>站内访问、收藏、分享与停留时长。</p>
          <p><strong>更新频率</strong><br>每小时更新一次，异常流量自动过滤。</p>
          <p><strong>统计周期</strong><br>最近 7 天综合热度为默认榜单。</p>
        </div>
        <NuxtLink to="/about/help" class="mt-4 flex items-center gap-1 text-[12px] font-semibold text-primary">
          了解计算规则 <AppIcon name="arrow-right" class="size-3.5" />
        </NuxtLink>
      </section>

      <section class="panel rounded-xl p-5" aria-labelledby="category-ranking-title">
        <div class="flex items-center justify-between gap-3">
          <h2 id="category-ranking-title" class="font-display text-[16px] font-bold text-foreground">分类榜单</h2>
          <NuxtLink to="/category/ai" class="text-[11px] font-semibold text-primary">查看全部</NuxtLink>
        </div>
        <div class="mt-3 space-y-1">
          <NuxtLink
            v-for="(item, index) in data?.categoryRanking ?? []"
            :key="item.category"
            class="rank-row rank-data-row flex items-center gap-3 rounded-lg px-2 py-1.5"
            :to="`/ranking?category=${encodeURIComponent(item.category)}`"
          >
            <span class="number-font w-4 text-center text-[11px] font-bold text-muted-foreground">{{ index + 1 }}</span>
            <span class="relative grid size-[26px] shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary text-[10px] font-bold text-primary">
              <span aria-hidden="true">{{ initialOf(item.topTool.name) }}</span>
              <img class="mini-logo absolute inset-0" :src="faviconUrl(item.topTool.domain)" width="26" height="26" :alt="`${item.topTool.name} 图标`">
            </span>
            <span class="min-w-0 flex-1">
              <strong class="block truncate text-[12px] font-medium text-foreground">{{ item.category }}榜</strong>
              <span class="mt-0.5 block truncate text-[10px] leading-4 text-muted-foreground">{{ item.topTool.name }} · {{ item.topTool.heat }}</span>
            </span>
            <span class="number-font flex items-center justify-end gap-0.5 text-[11px] font-semibold text-muted-foreground">
              <AppIcon name="flame" class="size-3" />{{ item.topTool.heat }}
            </span>
          </NuxtLink>
        </div>
      </section>

      <section class="panel rounded-xl p-5" aria-labelledby="rising-ranking-title">
        <div class="flex items-center justify-between gap-3">
          <h2 id="rising-ranking-title" class="font-display text-[16px] font-bold text-foreground">上升最快</h2>
          <span class="rounded-md bg-secondary px-1.5 py-1 text-[10px] font-bold text-muted-foreground">实时</span>
        </div>
        <div class="mt-3">
          <NuxtLink
            v-for="item in data?.rising ?? []"
            :key="item.tool.id"
            class="rank-row rank-data-row flex items-center gap-3 rounded-lg px-2 py-1.5"
            :to="`/tool/${item.tool.slug}`"
          >
            <span
              class="number-font w-4 text-center text-[11px] font-bold"
              :class="item.rank <= 3 ? 'text-foreground' : 'text-muted-foreground'"
            >{{ item.rank }}</span>
            <span class="relative grid size-[26px] shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary text-[10px] font-bold text-primary">
              <span aria-hidden="true">{{ initialOf(item.tool.name) }}</span>
              <img class="mini-logo absolute inset-0" :src="faviconUrl(item.tool.domain)" width="26" height="26" :alt="`${item.tool.name} 图标`">
            </span>
            <span class="min-w-0 flex-1">
              <strong class="block truncate text-[12px] font-medium text-foreground">{{ item.tool.name }}</strong>
              <span class="mt-0.5 block truncate text-[10px] leading-4 text-muted-foreground">{{ item.tool.category }}</span>
            </span>
            <span class="number-font flex items-center justify-end gap-0.5 text-[11px] font-semibold text-muted-foreground">
              <AppIcon name="trending-up" class="size-3" />+{{ item.growth }}%
            </span>
          </NuxtLink>
        </div>
      </section>
    </aside>
  </div>
</template>
