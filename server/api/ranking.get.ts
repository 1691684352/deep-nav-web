import type { RankingPeriod } from '#shared/types'
import { seoPresets } from '../data/site'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const period = toStringParam(query.period, '周榜') as RankingPeriod
  const category = toStringParam(query.category, '全部')
  const safePeriod = rankingPeriods.includes(period) ? period : '周榜'
  const safeCategory = rankingCategories.includes(category) ? category : '全部'

  return ok({
    seo: {
      ...seoPresets.ranking,
      title: safeCategory === '全部'
        ? seoPresets.ranking!.title
        : `${safeCategory}排行榜 - 深度指引`,
      canonical: '/ranking',
    },
    periods: rankingPeriods,
    categories: rankingCategories,
    ranking: buildRanking(safePeriod, safeCategory),
    categoryRanking: categoryRanking(),
    rising: risingRanking(),
    editorPicks: catalog.slice(0, 5),
    stats: [
      { value: '24h', label: '滚动统计' },
      { value: String(catalog.length), label: '入榜工具' },
      { value: String(rankingCategories.length - 1), label: '分类榜单' },
    ],
  })
})
