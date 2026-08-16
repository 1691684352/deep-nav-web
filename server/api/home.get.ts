import { greetingFor } from '#shared/utils'
import { featureCards, seoPresets, siteConfig } from '../data/site'
import { editorPicks, latestTools, rankSets, recommendedTools, tools } from '../data/tools'

export default defineEventHandler(() => {
  const hour = new Date().getHours()

  return ok({
    seo: seoPresets.home,
    site: siteConfig,
    featureCards,
    recommendedTools,
    editorPicks,
    categories: categoriesWithCounts(),
    navCategories: navCategoriesWithCounts(),
    greeting: {
      eyebrow: '今日精选导航',
      title: `${greetingFor(hour)}，探索无限可能`,
      subtitle: '收录优质网站和工具，助力你的高效工作与学习',
    },
    tools,
    latestTools,
    rankSets,
    topics: homeTopics(),
  })
})
