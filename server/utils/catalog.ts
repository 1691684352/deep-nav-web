import type {
  Category,
  CategoryGroup,
  CategoryRankingItem,
  NavCategory,
  RankingEntry,
  RankingPeriod,
  RankingResult,
  RisingRankingItem,
  SearchFacet,
  SearchItem,
  SearchSort,
  Tool,
  ToolDetail,
  Topic,
  TopicDetail,
} from '#shared/types'
import { defaultFeatures, toolDetailOverrides } from '../data/tool-details'
import { categories, categoryBySlug, categoryGroupOrder, navCategories, navCategoryBySlug } from '../data/taxonomy'
import { searchMetaOverrides } from '../data/search'
import { subcategoryCatalog } from '../data/subcategory-tools'
import { homeTopicSlugs, topicBySlug, topicIntros, topics } from '../data/topics'
import { allTools, rankingExtras, toolBySlug, tools } from '../data/tools'
import { publishedReviewsForTool, reviewsForTool } from './reviews'

/** Every addressable record, de-duplicated by slug. */
export const catalog: Tool[] = (() => {
  const map = new Map<string, Tool>()
  for (const tool of [...allTools, ...Object.values(subcategoryCatalog).flat()]) {
    if (!map.has(tool.slug)) map.set(tool.slug, tool)
  }
  return [...map.values()]
})()

const catalogBySlug = new Map(catalog.map(tool => [tool.slug, tool]))

export function findTool(slug: string): Tool | undefined {
  return catalogBySlug.get(slug) ?? toolBySlug.get(slug)
}

/** Stable pseudo-random in [0, 1) so mock rankings stay identical across requests. */
function hashRatio(seed: string): number {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 10000) / 10000
}

export function categoriesWithCounts(): Category[] {
  return categories.map(category => ({
    ...category,
    toolCount: category.slug === 'all'
      ? catalog.length
      : catalog.filter(tool => tool.categorySlug === category.slug).length,
  }))
}

export function navCategoriesWithCounts(): NavCategory[] {
  return navCategories.map(nav => ({
    ...nav,
    toolCount: nav.slug === 'hot'
      ? catalog.filter(tool => tool.tags.includes('热门推荐')).length
      : subcategoryTools(nav.slug).length,
  }))
}

export function subcategoryTools(navSlug: string): Tool[] {
  if (navSlug === 'hot') {
    return [...catalog].filter(tool => tool.tags.includes('热门推荐')).sort((a, b) => b.heatValue - a.heatValue)
  }
  const curated = subcategoryCatalog[navSlug]
  if (curated?.length) return curated
  return catalog.filter(tool => tool.navCategorySlug === navSlug).sort((a, b) => b.heatValue - a.heatValue)
}

export function categoryTools(categorySlug: string): Tool[] {
  if (categorySlug === 'all') return [...catalog].sort((a, b) => b.heatValue - a.heatValue)
  return catalog.filter(tool => tool.categorySlug === categorySlug).sort((a, b) => b.heatValue - a.heatValue)
}

/** Section-per-subcategory layout used by the category landing page. */
export function categoryGroups(categorySlug: string, limit = 8): CategoryGroup[] {
  const pool = categoryTools(categorySlug)
  const groups: CategoryGroup[] = []
  for (const navSlug of categoryGroupOrder) {
    const nav = navCategoryBySlug.get(navSlug)
    if (!nav) continue
    const items = (categorySlug === 'all' ? subcategoryTools(navSlug) : pool.filter(tool => tool.navCategorySlug === navSlug))
    if (!items.length) continue
    groups.push({
      ...nav,
      total: items.length,
      tools: items.slice(0, limit),
    })
  }
  return groups
}

export function sortTools(list: Tool[], sort: SearchSort): Tool[] {
  const copy = [...list]
  if (sort === 'newest') return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  return copy.sort((a, b) => b.heatValue - a.heatValue)
}

export function filterByTag(list: Tool[], tag: string): Tool[] {
  // '全部' shows everything; '最新收录' is not a tag but a recency view — it keeps
  // the full list and lets the caller apply a 'newest' sort.
  if (!tag || tag === '全部' || tag === '最新收录') return list
  return list.filter(tool => tool.tags.includes(tag))
}

const rankingPool: Tool[] = [...tools, ...rankingExtras]

const periodLabels: Record<RankingPeriod, string> = {
  日榜: '今日',
  周榜: '本周',
  月榜: '本月',
  年度: '今年',
}

export function rankingPeriodLabel(period: RankingPeriod) {
  return periodLabels[period]
}

export const rankingPeriods: RankingPeriod[] = ['日榜', '周榜', '月榜', '年度']

export function buildRanking(period: RankingPeriod, categoryName = '全部', size = 13): RankingResult {
  const pool = categoryName === '全部'
    ? rankingPool
    : rankingPool.filter(tool => tool.category === categoryName)

  const scored = pool.map((tool) => {
    const ratio = hashRatio(`${period}:${tool.slug}`)
    const score = Math.round(tool.heatValue * (0.85 + ratio * 0.3))
    const changeSeed = hashRatio(`${period}:change:${tool.slug}`)
    const change = Math.round((changeSeed - 0.45) * 12)
    return { tool, score, change }
  }).sort((a, b) => b.score - a.score)

  const maxScore = scored[0]?.score ?? 1
  const entries: RankingEntry[] = scored.slice(0, size).map((item, index) => ({
    rank: index + 1,
    tool: item.tool,
    score: item.score,
    heat: `${(item.score / 1000).toFixed(1)}k`,
    change: item.change,
    changePercent: Number((Math.abs(item.change) * 1.3 + hashRatio(`pct:${period}:${item.tool.slug}`) * 4).toFixed(1)),
    trend: item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'flat',
    heatPercent: Math.max(18, Math.round((item.score / maxScore) * 100)),
  }))

  return {
    period,
    periodLabel: periodLabels[period],
    category: categoryName,
    summary: categoryName === '全部'
      ? `${periodLabels[period]}综合热度前 ${Math.min(10, Math.max(0, entries.length - 3))} 名`
      : `${periodLabels[period]} ${categoryName} 热度排行`,
    podium: entries.slice(0, 3),
    entries: entries.slice(3),
    total: pool.length,
    updatedAt: '2026-02-01 08:00',
  }
}

export const rankingCategories = ['全部', 'AI工具', '效率工具', '设计创意', '开发技术', '内容创作', '数据分析', '学习教育']

export function categoryRanking(): CategoryRankingItem[] {
  return rankingCategories.filter(name => name !== '全部').map((name) => {
    const top = rankingPool
      .filter(tool => tool.category === name)
      .sort((a, b) => b.heatValue - a.heatValue)[0]
    const category = categories.find(item => item.name === name)
    return {
      category: name,
      categorySlug: category?.slug ?? 'all',
      icon: category?.icon ?? 'layers-3',
      topTool: top!,
    }
  }).filter(item => Boolean(item.topTool))
}

export function risingRanking(size = 6): RisingRankingItem[] {
  return rankingPool
    .map(tool => ({ tool, growth: Math.round(80 + hashRatio(`rising:${tool.slug}`) * 420) }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, size)
    .map((item, index) => ({ rank: index + 1, tool: item.tool, growth: item.growth }))
}

function buildRatingBuckets(rating: number, count: number) {
  const five = Math.round(count * (rating >= 4.6 ? 0.72 : 0.55))
  const four = Math.round(count * 0.2)
  const three = Math.max(0, count - five - four - 2)
  return [
    { score: 5, count: five },
    { score: 4, count: four },
    { score: 3, count: three },
    { score: 2, count: Math.min(1, count) },
    { score: 1, count: Math.min(1, count) },
  ]
}

export function buildToolDetail(slug: string): ToolDetail | null {
  const tool = findTool(slug)
  if (!tool) return null
  const override = toolDetailOverrides[slug] ?? {}
  const baseRating = override.rating ?? Number.parseFloat((4.2 + hashRatio(`rating:${slug}`) * 0.7).toFixed(1))
  const baseRatingCount = override.ratingCount ?? Math.round(24 + hashRatio(`count:${slug}`) * 160)
  const publishedReviews = publishedReviewsForTool(slug)
  const ratingCount = baseRatingCount + publishedReviews.length
  const rating = Number.parseFloat(((baseRating * baseRatingCount + publishedReviews.reduce((sum, review) => sum + review.rating, 0)) / ratingCount).toFixed(1))
  const ratingBuckets = (override.ratingBuckets ?? buildRatingBuckets(baseRating, baseRatingCount)).map(bucket => ({ ...bucket }))
  for (const review of publishedReviews) {
    const bucket = ratingBuckets.find(item => item.score === review.rating)
    if (bucket) bucket.count += 1
  }
  const related = catalog
    .filter(item => item.slug !== tool.slug && (item.navCategorySlug === tool.navCategorySlug || item.categorySlug === tool.categorySlug))
    .sort((a, b) => b.heatValue - a.heatValue)
    .slice(0, 8)

  return {
    ...tool,
    slogan: override.slogan ?? tool.desc,
    siteTags: override.siteTags ?? tool.tags,
    overview: override.overview ?? defaultOverview(tool),
    features: override.features ?? defaultFeatures,
    gallery: override.gallery ?? null,
    stats: override.stats ?? [
      { value: tool.heat, label: '月均浏览' },
      { value: tool.createdAt, label: '收录时间' },
    ],
    rating,
    ratingCount,
    ratingBuckets,
    reviews: reviewsForTool(slug),
    news: override.news ?? [],
    related,
    breadcrumbs: [
      { label: '首页', to: '/' },
      { label: categoryBySlug.get(tool.categorySlug)?.label ?? tool.category, to: `/category/${tool.categorySlug}` },
      { label: navCategoryBySlug.get(tool.navCategorySlug)?.title ?? tool.navCategory, to: `/category/subcategory/${tool.navCategorySlug}` },
      { label: tool.name },
    ],
  }
}

function defaultOverview(tool: Tool): string {
  return `## ${tool.name} 简介

${tool.name} 是${tool.category}分类下的${tool.desc}，帮助用户在日常工作中更快地完成目标。

## 1. 产品定位

### ${tool.navCategory}

${tool.name} 聚焦 ${tool.navCategory} 场景，把常见流程整理成清晰、可复用的操作路径。

## 2. 主要功能特点

<!-- features -->

## 3. 适用人群

- **个人用户：** 用更少的时间处理重复事务。
- **团队协作：** 沉淀统一的工作方式与产出标准。
- **专业场景：** 支撑${tool.category}方向的进阶需求。

## 总结

如果你正在寻找${tool.desc}，${tool.name} 值得放进日常工具箱。具体功能与定价请以官网信息为准。`
}

export function searchCatalog(options: {
  keyword?: string
  categorySlug?: string
  sort?: SearchSort
}): { items: SearchItem[], facets: SearchFacet[] } {
  const keyword = (options.keyword ?? '').trim().toLowerCase()
  const matched = catalog.filter((tool) => {
    if (!keyword) return true
    const haystack = [tool.name, tool.desc, tool.category, tool.navCategory, tool.domain, ...tool.tags]
      .join(' ')
      .toLowerCase()
    return haystack.includes(keyword)
  })

  const facets: SearchFacet[] = [
    { slug: 'all', label: '全部', count: matched.length },
    ...categories
      .filter(category => category.slug !== 'all')
      .map(category => ({
        slug: category.slug,
        label: category.label,
        count: matched.filter(tool => tool.categorySlug === category.slug).length,
      }))
      .filter(facet => facet.count > 0),
  ]

  const categorySlug = options.categorySlug && options.categorySlug !== 'all' ? options.categorySlug : ''
  const scoped = categorySlug ? matched.filter(tool => tool.categorySlug === categorySlug) : matched
  const sorted = sortTools(scoped, options.sort ?? 'heat')

  const items: SearchItem[] = sorted.map(tool => ({
    ...tool,
    desc: searchMetaOverrides[tool.slug]?.desc ?? tool.desc,
    meta: searchMetaOverrides[tool.slug]?.meta ?? tool.navCategory,
  }))

  return { items, facets }
}

export function suggestTools(keyword: string, limit = 6): Tool[] {
  const query = keyword.trim().toLowerCase()
  if (!query) {
    return [...catalog].sort((a, b) => b.heatValue - a.heatValue).slice(0, limit)
  }
  return searchCatalog({ keyword: query }).items.slice(0, limit)
}

export function listTopics(keyword = ''): Topic[] {
  const query = keyword.trim().toLowerCase()
  if (!query) return topics
  return topics.filter(topic =>
    `${topic.title} ${topic.description}`.toLowerCase().includes(query))
}

export function homeTopics(): Topic[] {
  return homeTopicSlugs.map(slug => topicBySlug.get(slug)).filter(Boolean) as Topic[]
}

export function buildTopicDetail(slug: string): TopicDetail | null {
  const topic = topicBySlug.get(slug)
  if (!topic) return null
  const pool = topic.navCategorySlug
    ? subcategoryTools(topic.navCategorySlug)
    : categoryTools(topic.categorySlug)
  const related = topics.filter(item => item.slug !== topic.slug && item.categorySlug === topic.categorySlug).slice(0, 4)
  return {
    ...topic,
    intro: topicIntros[topic.slug] ?? topic.description,
    tools: pool,
    related: related.length ? related : topics.filter(item => item.slug !== topic.slug).slice(0, 4),
  }
}
