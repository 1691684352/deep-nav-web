import { seoPresets } from '../data/site'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const safePeriod = toEnumParam(query.period, rankingPeriods, '周榜')
  const safeCategory = toEnumParam(query.category, rankingCategories, '全部')

  return ok({
    seo: {
      ...seoPresets.ranking,
      title: safeCategory === '全部'
        ? seoPresets.ranking!.title
        : `${safeCategory}排行榜 - 深度指引`,
      canonical: '/ranking',
    },
    periods: rankingPeriods,
    periodOptions: rankingPeriods.map(value => ({ value, label: rankingPeriodLabel(value) })),
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
