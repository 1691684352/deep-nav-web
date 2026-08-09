import { featureCards, siteConfig } from '../../data/site'
import { recommendedTools } from '../../data/tools'

export default defineEventHandler(() => ok({
  site: siteConfig,
  featureCards,
  recommendedTools,
  categories: categoriesWithCounts(),
  navCategories: navCategoriesWithCounts(),
}))
