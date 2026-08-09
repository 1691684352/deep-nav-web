import { seoPresets } from '../../data/site'
import { searchSortOptions, searchSortValues } from '../../data/search'
import { subcategoryFilters } from '../../data/subcategory-tools'
import { navCategoryBySlug } from '../../data/taxonomy'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? 'hot'
  const nav = navCategoryBySlug.get(slug)
  if (!nav) {
    throw createError({ statusCode: 404, statusMessage: '子分类不存在' })
  }

  const query = getQuery(event)
  const filter = toEnumParam(query.filter, subcategoryFilters, '全部')
  const sort = toEnumParam(query.sort, searchSortValues, 'heat')
  const page = toNumber(query.page, 1)
  const pageSize = toNumber(query.pageSize, 24)

  const pool = subcategoryTools(slug)
  const filtered = sortTools(filterByTag(pool, filter), sort)

  return ok({
    seo: {
      ...seoPresets.category,
      title: `${nav.title} - 深度指引`,
      description: `${nav.description}。深度指引已收录 ${pool.length} 个${nav.title}相关工具。`,
      canonical: `/category/subcategory/${slug}`,
    },
    nav: { ...nav, toolCount: pool.length },
    filters: subcategoryFilters,
    sortOptions: searchSortOptions,
    filter,
    sort,
    result: paginate(filtered, page, pageSize),
    siblings: navCategoriesWithCounts().filter(item => item.slug !== slug),
    hotTools: [...pool].sort((a, b) => b.heatValue - a.heatValue).slice(0, 6),
  })
})
