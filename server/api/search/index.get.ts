import type { SearchResult } from '#shared/types'
import { seoPresets } from '../../data/site'
import { searchSortOptions, searchSortValues, searchSuggestions } from '../../data/search'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const keyword = toStringParam(query.keyword ?? query.q)
  const categorySlug = toStringParam(query.category, 'all')
  const sort = toEnumParam(query.sort, searchSortValues, 'heat')
  const page = toNumber(query.page, 1)
  const pageSize = toNumber(query.pageSize, 10)

  const { items, facets } = searchCatalog({ keyword, categorySlug, sort })
  const paged = paginate(items, page, pageSize)

  const result: SearchResult = {
    ...paged,
    keyword,
    categorySlug,
    facets,
    sort,
  }

  return ok({
    seo: {
      ...seoPresets.search,
      title: keyword ? `${keyword} 的搜索结果 - 深度指引` : seoPresets.search!.title,
      description: keyword
        ? `深度指引找到 ${paged.total} 个与「${keyword}」相关的工具与网站。`
        : seoPresets.search!.description,
    },
    result,
    sortOptions: searchSortOptions,
    suggestions: searchSuggestions,
  })
})
