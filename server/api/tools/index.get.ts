import { searchSortValues } from '../../data/search'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const categorySlug = toStringParam(query.category, 'all')
  const navSlug = toStringParam(query.nav)
  const tag = toStringParam(query.tag, '全部')
  const keyword = toStringParam(query.keyword)
  const sort = toEnumParam(query.sort, searchSortValues, 'heat')
  const page = toNumber(query.page, 1)
  const pageSize = toNumber(query.pageSize, 24)

  let pool = navSlug ? subcategoryTools(navSlug) : categoryTools(categorySlug)
  if (keyword) {
    const needle = keyword.toLowerCase()
    pool = pool.filter(tool => `${tool.name} ${tool.desc} ${tool.domain}`.toLowerCase().includes(needle))
  }

  return ok(paginate(sortTools(filterByTag(pool, tag), sort), page, pageSize))
})
