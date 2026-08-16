import { searchSortOptions, searchSortValues } from '../../data/search'
import { subcategoryFilters } from '../../data/subcategory-tools'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const detail = buildTopicDetail(slug)
  if (!detail) {
    throw createError({ statusCode: 404, statusMessage: '专题不存在' })
  }

  const query = getQuery(event)
  const filter = toEnumParam(query.filter, subcategoryFilters, '全部')
  const sort = toEnumParam(query.sort, searchSortValues, 'heat')
  const page = toNumber(query.page, 1)
  const pageSize = toNumber(query.pageSize, 24)

  return ok({
    seo: {
      title: `${detail.title} - 精选专题 - 深度指引`,
      description: detail.intro,
      keywords: [detail.title, '专题', '工具合集', '深度指引'].join(','),
      ogType: 'article',
      canonical: `/topic/${detail.slug}`,
    },
    topic: detail,
    filters: subcategoryFilters,
    sortOptions: searchSortOptions,
    filter,
    sort,
    result: paginate(sortTools(filterByTag(detail.tools, filter), filter === '最新收录' ? 'newest' : sort), page, pageSize),
  })
})
